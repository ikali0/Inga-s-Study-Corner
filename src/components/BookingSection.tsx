import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import { z } from "zod";
import confetti from "canvas-confetti";

// Confetti animation
const fireConfetti = () => {
  const duration = 3000;
  const end = Date. now() + duration;
  const colors = ["#FF9F1C", "#2EC4B6", "#E71D36", "#FFD700", "#7B68EE"];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 3,
      angle:  120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
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
const EMAILJS_TEMPLATE_ID = "template_16tlqcu";
const EMAILJS_PUBLIC_KEY = "j673bQmepWx0echbf";

// Validation schema
const bookingSchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(1, "Parent name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes"
    ),
  childName: z
    . string()
    .trim()
    .min(1, "Child name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    . string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .regex(/^[\d\s()+-]*$/, "Phone can only contain numbers, spaces, and ()+-")
    .optional()
    .or(z.literal("")),
  subject: z.enum(subjects),
  message: z
    .string()
    .trim()
    .max(1000, "Message must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof bookingSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    . replace(/javascript:/gi, "") // Remove javascript:  protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

const BookingSection = () => {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    parentName: "",
    childName: "",
    email: "",
    phone: "",
    subject:  "Math",
    message: "",
  });

  const handleInputChange = (field: keyof FormData, value:  string) => {
    const sanitized = sanitizeInput(value);
    setFormData((prev) => ({
      ...prev,
      [field]: sanitized,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React. FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = bookingSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        if (! fieldErrors[field]) {
          fieldErrors[field] = err. message;
        }
      });
      setErrors(fieldErrors);
      
      // Focus first error field
      const firstErrorField = Object.keys(fieldErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      
      toast({
        title: "Please fix the errors",
        description: "Check the form for validation errors.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          parent_name: result.data.parentName,
          child_name: result.data. childName,
          from_email: result.data.email,
          phone: result.data.phone || "Not provided",
          subject: result. data.subject,
          message: result.data.message || "No additional message",
        },
        EMAILJS_PUBLIC_KEY
      );

      setShowSuccess(true);
      fireConfetti();

      setTimeout(() => {
        setShowSuccess(false);
        toast({
          title: "Request Received! 🎉",
          description: "I'll be in touch shortly to confirm your consultation.",
        });
        setFormData({
          parentName: "",
          childName: "",
          email: "",
          phone: "",
          subject: "Math",
          message: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Email submission error:", error);
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again or contact us directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="book"
      className="py-8 sm:py-12 md:py-16 lg:py-20 pb-12 sm:pb-16 md:pb-20 lg:pb-24 relative z-10"
      aria-labelledby="booking-heading"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2
            id="booking-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3"
          >
            Ready to Get Started?  🚀
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Book a free consultation.  Let's chat about your child's goals. 
          </p>
        </header>

        {/* Form Card */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 border border-border shadow-lg">
          {showSuccess ?  (
            // Success State
            <div
              className="text-center py-10 sm:py-12 md:py-16 animate-in zoom-in duration-500"
              role="status"
              aria-live="polite"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 sm: mb-6">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
              </div>
              <h3 className="text-xl sm:text-2xl md: text-3xl font-bold text-foreground mb-2 sm:mb-3">
                Request Received! 
              </h3>
              <p className="text-muted-foreground text-sm sm: text-base">
                I'll be in touch shortly to confirm your slot.
              </p>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
              {/* Parent & Child Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="parentName"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Parent's Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="parentName"
                    required
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange("parentName", e.target.value)}
                    className={`text-sm ${errors.parentName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    maxLength={100}
                    aria-invalid={!!errors.parentName}
                    aria-describedby={errors. parentName ? "parentName-error" : undefined}
                  />
                  {errors. parentName && (
                    <p
                      id="parentName-error"
                      className="text-destructive text-xs"
                      role="alert"
                    >
                      {errors.parentName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="childName"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Child's Name & Age <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="childName"
                    required
                    type="text"
                    placeholder="Leo, Age 10"
                    value={formData.childName}
                    onChange={(e) => handleInputChange("childName", e.target.value)}
                    className={`text-sm ${errors.childName ?  "border-destructive focus-visible:ring-destructive" : ""}`}
                    maxLength={100}
                    aria-invalid={!!errors.childName}
                    aria-describedby={errors.childName ? "childName-error" : undefined}
                  />
                  {errors. childName && (
                    <p
                      id="childName-error"
                      className="text-destructive text-xs"
                      role="alert"
                    >
                      {errors.childName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm: grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    required
                    type="email"
                    placeholder="hello@family.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`text-sm ${errors.email ? "border-destructive focus-visible: ring-destructive" : ""}`}
                    maxLength={255}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors. email ? "email-error" :  undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-destructive text-xs" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Phone{" "}
                    <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(215) 555-0123"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`text-sm ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    maxLength={20}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors. phone && (
                    <p id="phone-error" className="text-destructive text-xs" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject Selection */}
              <fieldset className="space-y-2">
                <legend className="block text-sm font-semibold text-foreground mb-3">
                  Interested Subject <span className="text-destructive">*</span>
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {subjects.map((sub) => (
                    <button
                      type="button"
                      key={sub}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          subject: sub,
                        })
                      }
                      className={`p-3 sm:p-3. 5 rounded-lg border-2 font-semibold text-xs sm:text-sm transition-all ${
                        formData.subject === sub
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border text-muted-foreground hover: border-primary/50 hover:text-foreground"
                      }`}
                      aria-pressed={formData.subject === sub}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Message */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-foreground"
                >
                  How can I help? {" "}
                  <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell me a bit about what your child is working on or struggling with..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className={`min-h-[100px] sm:min-h-[120px] resize-none text-sm ${errors.message ? "border-destructive focus-visible: ring-destructive" : ""}`}
                  maxLength={1000}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                <div className="flex justify-between items-center">
                  {errors.message ?  (
                    <p id="message-error" className="text-destructive text-xs" role="alert">
                      {errors. message}
                    </p>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {formData.message.length}/1000
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold py-3 sm:py-4 rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Schedule Free Consultation"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
