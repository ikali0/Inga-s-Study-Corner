import { useState, forwardRef } from "react";
import { CheckCircle, Loader2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrustChip } from "@/components/ui/trust-chip";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import { z } from "zod";
import confetti from "canvas-confetti";

// Confetti animation
const fireConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;
  const colors = ["#FF9F1C", "#2EC4B6", "#E71D36", "#FFD700", "#7B68EE"];
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: {
        x: 0
      },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: {
        x: 1
      },
      colors: colors
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};
const subjects = ["Math", "English", "Social Studies", "Extra Curriculars"] as const;

// EmailJS configuration (public keys only - safe for client-side)
const EMAILJS_SERVICE_ID = "service_knx8thk";
const EMAILJS_TEMPLATE_ID = "portfolio1122";
const EMAILJS_PUBLIC_KEY = "dJTxndu6umEp5SIXv";

// Validation schema
const bookingSchema = z.object({
  parentName: z.string().trim().min(1, "Parent name is required").max(100, "Name must be less than 100 characters").regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),
  childName: z.string().trim().min(1, "Child name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").regex(/^[\d\s()+-]*$/, "Phone can only contain numbers, spaces, and ()+-").optional().or(z.literal("")),
  subject: z.enum(subjects),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional().or(z.literal(""))
});
type FormData = z.infer<typeof bookingSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "") // Remove angle brackets
  .replace(/javascript:/gi, "") // Remove javascript:  protocol
  .replace(/on\w+=/gi, "") // Remove event handlers
  .trim();
};
const BookingSection = forwardRef<HTMLElement>((_, ref) => {
  const {
    toast
  } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    parentName: "",
    childName: "",
    email: "",
    phone: "",
    subject: "Math",
    message: ""
  });
  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitized = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [field]: sanitized
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);

      // Focus first error field
      const firstErrorField = Object.keys(fieldErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      toast({
        title: "Please fix the errors",
        description: "Check the form for validation errors.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        parent_name: result.data.parentName,
        child_name: result.data.childName,
        from_email: result.data.email,
        phone: result.data.phone || "Not provided",
        subject: result.data.subject,
        message: result.data.message || "No additional message"
      }, EMAILJS_PUBLIC_KEY);
      setShowSuccess(true);
      fireConfetti();
      setTimeout(() => {
        setShowSuccess(false);
        toast({
          title: "Request Received! 🎉",
          description: "I'll be in touch shortly to confirm your consultation."
        });
        setFormData({
          parentName: "",
          childName: "",
          email: "",
          phone: "",
          subject: "Math",
          message: ""
        });
      }, 3000);
    } catch (error) {
      console.error("Email submission error:", error);
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again or contact us directly via email.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section ref={ref} id="book" className="py-8 sm:py-12 md:py-16 relative z-10" aria-labelledby="booking-heading">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-5 sm:mb-6">
          <h2 id="booking-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1.5">
            Ready to Get Started? 🚀
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            Book a free consultation. Let's chat about your child's goals.
          </p>
        </header>

        {/* Form Card */}
        <div className="card-3d rounded-xl p-4 sm:p-5 md:p-6 border border-fuchsia-400 border-solid">
          {showSuccess ?
        // Success State
        <div className="text-center py-8 sm:py-10 animate-in zoom-in duration-500" role="status" aria-live="polite">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5">
                Request Received!
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                I'll be in touch shortly to confirm your slot.
              </p>
            </div> :
        // Form
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate>
              {/* Parent Name */}
              <div className="space-y-1">
                <label htmlFor="parentName" className="block text-xs font-semibold text-foreground">
                  Parent's Name <span className="text-destructive">*</span>
                </label>
                <Input id="parentName" required type="text" placeholder="Jane Doe" value={formData.parentName} onChange={e => handleInputChange("parentName", e.target.value)} className={`h-9 text-sm ${errors.parentName ? "border-destructive focus-visible:ring-destructive" : ""}`} maxLength={100} aria-invalid={!!errors.parentName} aria-describedby={errors.parentName ? "parentName-error" : undefined} />
                {errors.parentName && <p id="parentName-error" className="text-destructive text-[10px]" role="alert">
                    {errors.parentName}
                  </p>}
              </div>

              {/* Child Name */}
              <div className="space-y-1">
                <label htmlFor="childName" className="block text-xs font-semibold text-foreground">
                  Child's Name & Age <span className="text-destructive">*</span>
                </label>
                <Input id="childName" required type="text" placeholder="Leo, Age 10" value={formData.childName} onChange={e => handleInputChange("childName", e.target.value)} className={`h-9 text-sm ${errors.childName ? "border-destructive focus-visible:ring-destructive" : ""}`} maxLength={100} aria-invalid={!!errors.childName} aria-describedby={errors.childName ? "childName-error" : undefined} />
                {errors.childName && <p id="childName-error" className="text-destructive text-[10px]" role="alert">
                    {errors.childName}
                  </p>}
              </div>

              {/* Email & Phone - Stack on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-semibold text-foreground">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input id="email" required type="email" placeholder="hello@family.com" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} className={`h-9 text-sm ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`} maxLength={255} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
                  {errors.email && <p id="email-error" className="text-destructive text-[10px]" role="alert">
                      {errors.email}
                    </p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-xs font-semibold text-foreground">
                    Phone <span className="text-muted-foreground font-normal text-[10px]">(Optional)</span>
                  </label>
                  <Input id="phone" type="tel" placeholder="(215) 555-0123" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} className={`h-9 text-sm ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`} maxLength={20} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
                  {errors.phone && <p id="phone-error" className="text-destructive text-[10px]" role="alert">
                      {errors.phone}
                    </p>}
                </div>
              </div>

              {/* Subject Selection - Compact */}
              <fieldset className="space-y-1.5">
                <legend className="block text-xs font-semibold text-foreground">
                  Subject <span className="text-destructive">*</span>
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map(sub => <button type="button" key={sub} onClick={() => setFormData({
                ...formData,
                subject: sub
              })} className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${formData.subject === sub ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border/50"}`} aria-pressed={formData.subject === sub}>
                      {sub}
                    </button>)}
                </div>
              </fieldset>

              {/* Message - Compact */}
              <div className="space-y-1">
                <label htmlFor="message" className="block text-xs font-semibold text-foreground">
                  Message <span className="text-muted-foreground font-normal text-[10px]">(Optional)</span>
                </label>
                <Textarea id="message" placeholder="What is your child working on?" value={formData.message} onChange={e => handleInputChange("message", e.target.value)} className={`min-h-[70px] resize-none text-sm ${errors.message ? "border-destructive focus-visible:ring-destructive" : ""}`} maxLength={1000} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />
                <div className="flex justify-end">
                  {errors.message ? <p id="message-error" className="text-destructive text-[10px]" role="alert">
                      {errors.message}
                    </p> : <span className="text-[10px] text-muted-foreground">
                      {formData.message.length}/1000
                    </span>}
                </div>
              </div>

              {/* Submit Button - High conversion CTA */}
              <Button type="submit" disabled={isSubmitting} variant="cta" size="touch" className="w-full text-sm font-bold">
                {isSubmitting ? <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    Sending...
                  </> : "Book Free Consultation"}
              </Button>

              {/* Trust reinforcement */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <TrustChip variant="muted" icon="lock">
                  Secure Form
                </TrustChip>
                <TrustChip variant="muted" icon="shield">
                  No Spam
                </TrustChip>
              </div>
            </form>}
        </div>
      </div>
    </section>;
});
BookingSection.displayName = "BookingSection";
export default BookingSection;