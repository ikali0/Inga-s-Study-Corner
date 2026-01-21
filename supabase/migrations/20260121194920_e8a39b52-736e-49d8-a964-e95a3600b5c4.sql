-- ================================================
-- PRODUCTION-GRADE RLS FOR TUTORING PLATFORM
-- ================================================

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('student', 'tutor', 'admin');

-- 2. Create user_roles table (for admin privileges)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role app_role NOT NULL DEFAULT 'student',
    full_name TEXT NOT NULL,
    email TEXT,
    bio TEXT,
    subjects TEXT[], -- For tutors
    hourly_rate DECIMAL(10,2), -- For tutors
    avatar_url TEXT,
    is_public BOOLEAN DEFAULT false, -- Tutors set to true for discovery
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ================================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ================================================
-- SECURITY DEFINER HELPER FUNCTIONS
-- (Prevents infinite recursion in RLS policies)
-- ================================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Check if user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(_user_id, 'admin')
$$;

-- Get user's profile role (without recursion)
CREATE OR REPLACE FUNCTION public.get_profile_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.profiles
    WHERE user_id = _user_id
    LIMIT 1
$$;

-- ================================================
-- RLS POLICIES: user_roles
-- Only admins can manage roles
-- ================================================

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- RLS POLICIES: profiles
-- ================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Public tutor profiles are visible to everyone
CREATE POLICY "Public tutor profiles are visible"
ON public.profiles
FOR SELECT
TO authenticated
USING (role = 'tutor' AND is_public = true);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Users can insert their own profile
CREATE POLICY "Users can create own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own profile (but not change to admin)
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid() AND role != 'admin');

-- Admins can update any profile
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Admins can delete any profile
CREATE POLICY "Admins can delete all profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- RLS POLICIES: bookings
-- ================================================

-- Students can view their own bookings
CREATE POLICY "Students can view own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Tutors can view bookings assigned to them
CREATE POLICY "Tutors can view assigned bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (tutor_id = auth.uid());

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Students can create bookings for themselves only
CREATE POLICY "Students can create own bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

-- Students can update their own bookings
CREATE POLICY "Students can update own bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Tutors can update bookings assigned to them (confirm/complete)
CREATE POLICY "Tutors can update assigned bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (tutor_id = auth.uid())
WITH CHECK (tutor_id = auth.uid());

-- Admins can update all bookings
CREATE POLICY "Admins can update all bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Students can cancel (delete) their own bookings
CREATE POLICY "Students can delete own bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (student_id = auth.uid());

-- Admins can delete all bookings
CREATE POLICY "Admins can delete all bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ================================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ================================================

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_public_tutors ON public.profiles(role, is_public) WHERE role = 'tutor' AND is_public = true;
CREATE INDEX idx_bookings_student_id ON public.bookings(student_id);
CREATE INDEX idx_bookings_tutor_id ON public.bookings(tutor_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);