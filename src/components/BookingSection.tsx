import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';
import { z } from 'zod';
import confetti from 'canvas-confetti';

const fireConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ['#FF9F1C', '#2EC4B6', '#E71D36', '#FFD700', '#7B68EE'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

const subjects = ['Math', 'Physics', 'Chemistry', 'Engineering'];

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_knx8thk';
const EMAILJS_TEMPLATE_ID = 'template_16tlqcu';
const EMAILJS_PUBLIC_KEY = 'hBuUzJCwLRky_JftD';

// Validation schema
const bookingSchema = z.object({
  parentName: z.string()
    .trim()
    .min(1, 'Parent name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes'),
  childName: z.string()
    .trim()
    .min(1, 'Child name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z.string()
    .trim()
    .max(20, 'Phone must be less than 20 characters')
    .regex(/^[\d\s()+-]*$/, 'Phone can only contain numbers, spaces, and ()+-')
    .optional()
    .or(z.literal('')),
  subject: z.enum(['Math', 'Physics', 'Chemistry', 'Engineering']),
  message: z.string()
    .trim()
    .max(1000, 'Message must be less than 1000 characters')
    .optional()
    .or(z.literal(''))
});

type FormErrors = Partial<Record<keyof z.infer<typeof bookingSchema>, string>>;

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

const BookingSection = () => {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    email: '',
    phone: '',
    subject: 'Math' as const,
    message: ''
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const sanitized = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitized }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
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
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          parent_name: result.data.parentName,
          child_name: result.data.childName,
          from_email: result.data.email,
          phone: result.data.phone || 'Not provided',
          subject: result.data.subject,
          message: result.data.message || 'No additional message',
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
          parentName: '',
          childName: '',
          email: '',
          phone: '',
          subject: 'Math',
          message: ''
        });
      }, 3000);
    } catch (error) {
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
    <section id="book" className="py-16 md:py-20 pb-24 md:pb-32 relative z-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Get Started? 🚀</h2>
          <p className="text-muted-foreground">Book a free consultation. Let's chat about your child's goals.</p>
        </div>

        <div className="bg-card rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12 border border-border">
          {showSuccess ? (
            <div className="text-center py-12 animate-in zoom-in">
              <div className="w-20 h-20 bg-green-light text-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Request Received!</h3>
              <p className="text-muted-foreground">I'll be in touch shortly to confirm your slot.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">Parent's Name</label>
                  <Input 
                    required
                    type="text" 
                    placeholder="Jane Doe"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange('parentName', e.target.value)}
                    className={`bg-muted border-border ${errors.parentName ? 'border-destructive' : ''}`}
                    maxLength={100}
                  />
                  {errors.parentName && <p className="text-destructive text-xs ml-1">{errors.parentName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">Child's Name & Age</label>
                  <Input 
                    required
                    type="text" 
                    placeholder="Leo, Age 10"
                    value={formData.childName}
                    onChange={(e) => handleInputChange('childName', e.target.value)}
                    className={`bg-muted border-border ${errors.childName ? 'border-destructive' : ''}`}
                    maxLength={100}
                  />
                  {errors.childName && <p className="text-destructive text-xs ml-1">{errors.childName}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">Email Address</label>
                  <Input 
                    required
                    type="email" 
                    placeholder="hello@family.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`bg-muted border-border ${errors.email ? 'border-destructive' : ''}`}
                    maxLength={255}
                  />
                  {errors.email && <p className="text-destructive text-xs ml-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">Phone (Optional)</label>
                  <Input 
                    type="tel" 
                    placeholder="(215) 555-0123"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`bg-muted border-border ${errors.phone ? 'border-destructive' : ''}`}
                    maxLength={20}
                  />
                  {errors.phone && <p className="text-destructive text-xs ml-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Interested Subject</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {subjects.map(sub => (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => setFormData({...formData, subject: sub as typeof formData.subject})}
                      className={`p-3 rounded-xl border-2 font-bold transition-all ${formData.subject === sub ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">How can I help?</label>
                <Textarea 
                  placeholder="Tell me a bit about what your child is working on or struggling with..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={`bg-muted border-border min-h-[120px] resize-none ${errors.message ? 'border-destructive' : ''}`}
                  maxLength={1000}
                />
                {errors.message && <p className="text-destructive text-xs ml-1">{errors.message}</p>}
              </div>

              <Button 
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue to-accent hover:opacity-90 text-primary-foreground font-bold py-4 rounded-xl shadow-lg transform transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Schedule Free Consultation'
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
