import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import { z } from "zod";
import confetti from "canvas-confetti";
const fireConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;
  const colors = ["#FF9F1C", "#2EC4B6", "#E71D36", "#FFD700", "#7B68EE"];
  (function frame() {
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
  })();
};
const subjects = ["Math", "English", "Social Studies", "Extra Curriculars"];

// EmailJS configuration (public keys only - safe for client-side)
const EMAILJS_SERVICE_ID = "service_knx8thk";
const EMAILJS_TEMPLATE_ID = "template_16tlqcu";
const EMAILJS_PUBLIC_KEY = "j673bQmepWx0echbf";

// Validation schema
const bookingSchema = z.object({
  parentName: z.string().trim().min(1, "Parent name is required").max(100, "Name must be less than 100 characters").regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),
  childName: z.string().trim().min(1, "Child name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").regex(/^[\d\s()+-]*$/, "Phone can only contain numbers, spaces, and ()+-").optional().or(z.literal("")),
  subject: z.enum(["Math", "English", "Social Studies", "Extra Curriculars"]),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional().or(z.literal(""))
});
type FormErrors = Partial<Record<keyof z.infer<typeof bookingSchema>, string>>;

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "") // Remove angle brackets
  .replace(/javascript:/gi, "") // Remove javascript: protocol
  .replace(/on\w+=/gi, "") // Remove event handlers
  .trim();
};
const BookingSection = () => {
  const {
    toast
  } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    email: "",
    phone: "",
    subject: "Math" as const,
    message: ""
  });
  const handleInputChange = (field: keyof typeof formData, value: string) => {
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
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again or contact us directly via email.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section id="book" className="py-10 sm:py-12 md:py-16 lg:py-20 pb-16 sm:pb-20 md:pb-24 lg:pb-32 relative z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">Book a free consultation.</h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base font-serif text-center">Let's chat about your child's goals.</p>
        </header>

        <div className="rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-8 lg:p-10 xl:p-12 border border-border px-[40px] py-[40px] border-solid bg-orange-100">
          {showSuccess ? <div className="text-center py-8 sm:py-10 md:py-12 animate-in zoom-in">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-green-light text-green rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <CheckCircle size={32} className="sm:w-9 sm:h-9 md:w-10 md:h-10" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
                Request Received!
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                I'll be in touch shortly to confirm your slot.
              </p>
            </div> : <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="parentName" className="text-xs sm:text-sm font-bold text-foreground ml-1 font-serif">
                    Parent's Name
                  </label>
                  <Input id="parentName" required type="text" placeholder="Jane Doe" value={formData.parentName} onChange={e => handleInputChange("parentName", e.target.value)} className={`bg-muted border-border text-sm ${errors.parentName ? "border-destructive" : ""}`} maxLength={100} />
                  {errors.parentName && <p className="text-destructive text-[10px] sm:text-xs ml-1" role="alert">
                      {errors.parentName}
                    </p>}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="childName" className="text-xs sm:text-sm font-bold text-foreground ml-1 font-serif text-center">
                    Child's Name & Age
                  </label>
                  <Input id="childName" required type="text" placeholder="Leo, Age 10" value={formData.childName} onChange={e => handleInputChange("childName", e.target.value)} className={`bg-muted border-border text-sm ${errors.childName ? "border-destructive" : ""}`} maxLength={100} />
                  {errors.childName && <p className="text-destructive text-[10px] sm:text-xs ml-1" role="alert">
                      {errors.childName}
                    </p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="email" className="text-xs sm:text-sm font-bold text-foreground ml-1 font-serif">
                    Email Address
                  </label>
                  <Input id="email" required type="email" placeholder="hello@family.com" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} className={`bg-muted border-border text-sm ${errors.email ? "border-destructive" : ""}`} maxLength={255} />
                  {errors.email && <p className="text-destructive text-[10px] sm:text-xs ml-1" role="alert">
                      {errors.email}
                    </p>}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="phone" className="text-xs sm:text-sm font-bold text-foreground ml-1 font-serif">
                    Phone 
                  </label>
                  <Input id="phone" type="tel" placeholder="(215) 555-0123" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} className={`bg-muted border-border text-sm ${errors.phone ? "border-destructive" : ""}`} maxLength={20} />
                  {errors.phone && <p className="text-destructive text-[10px] sm:text-xs ml-1" role="alert">
                      {errors.phone}
                    </p>}
                </div>
              </div>

              <fieldset className="space-y-1.5 sm:space-y-2">
                <legend className="text-xs sm:text-sm font-bold text-foreground ml-1 mb-1.5 sm:mb-2">
                  Interested Subject
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {subjects.map(sub => <button type="button" key={sub} onClick={() => setFormData({
                ...formData,
                subject: sub as typeof formData.subject
              })} className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 font-bold text-xs sm:text-sm md:text-base transition-all ${formData.subject === sub ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`} aria-pressed={formData.subject === sub}>
                      {sub}
                    </button>)}
                </div>
              </fieldset>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="message" className="text-xs sm:text-sm font-bold text-foreground ml-1 font-serif">
                  How can I help?
                </label>
                <Textarea id="message" placeholder="Tell me a bit about what your child is working on or struggling with..." value={formData.message} onChange={e => handleInputChange("message", e.target.value)} className={`bg-muted border-border min-h-[100px] sm:min-h-[110px] md:min-h-[120px] resize-none text-sm ${errors.message ? "border-destructive" : ""}`} maxLength={1000} />
                {errors.message && <p className="text-destructive text-[10px] sm:text-xs ml-1" role="alert">
                    {errors.message}
                  </p>}
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue to-accent hover:opacity-90 text-primary-foreground font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg transform transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 text-sm sm:text-base">
                {isSubmitting ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </> : "Schedule Free Consultation"}
              </Button>
            </form>}
        </div>
      </div>
    </section>;
};
export default BookingSection;