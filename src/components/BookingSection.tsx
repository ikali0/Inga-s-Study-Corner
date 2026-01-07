import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const subjects = ['Math', 'Physics', 'Chemistry', 'Engineering'];

const BookingSection = () => {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    email: '',
    phone: '',
    subject: 'Math',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
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
                    onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">Child's Name & Age</label>
                  <Input 
                    required
                    type="text" 
                    placeholder="Leo, Age 10"
                    value={formData.childName}
                    onChange={(e) => setFormData({...formData, childName: e.target.value})}
                    className="bg-muted border-border"
                  />
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
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-muted border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground ml-1">Phone (Optional)</label>
                  <Input 
                    type="tel" 
                    placeholder="(215) 555-0123"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-muted border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Interested Subject</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {subjects.map(sub => (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => setFormData({...formData, subject: sub})}
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
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="bg-muted border-border min-h-[120px] resize-none"
                />
              </div>

              <Button 
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-blue to-accent hover:opacity-90 text-primary-foreground font-bold py-4 rounded-xl shadow-lg transform transition-transform hover:scale-[1.01] active:scale-[0.98]"
              >
                Schedule Free Consultation
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
