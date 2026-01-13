import { useState, useEffect, useCallback } from 'react';
import { Zap, Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onNavigate: (id: string) => void;
}

const quotes = [
  "Learning should feel like play.",
  "Mistakes are proof you are trying.",
  "Every expert was once a beginner.",
  "Small steps lead to big jumps."
];

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = useCallback((id: string) => {
    onNavigate(id);
  }, [onNavigate]);

  return (
    <section 
      id="hero" 
      aria-labelledby="hero-heading" 
      className="relative pt-20 pb-8 sm:pt-24 sm:pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14 items-center">
        {/* Text Content */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6 z-10 order-2 md:order-1 text-center md:text-left">
          {/* Badge */}
          <div className="inline-block bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold text-xs tracking-wide">
            ✨ Interactive Learning for Ages 8–14
          </div>

          {/* Heading */}
          <h1 
            id="hero-heading" 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground"
          >
            Build{" "}
            <span className="text-primary underline decoration-wavy decoration-accent underline-offset-4 decoration-2">
              Confidence
            </span>
            . Strengthen <span className="text-blue">Skills</span>.
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-lg leading-relaxed mx-auto md:mx-0">
            Inga's Study Corner is a supportive after-school learning space where
            students strengthen their understanding of{" "}
            <strong className="text-foreground">Math, English and Science</strong>{" "}
            through clear explanations, guided practice, and curiosity-driven learning.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button 
              onClick={() => handleNavigate("book")} 
              size="lg" 
              className="bg-blue hover:bg-blue/90 text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue/20 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Zap size={18} className="fill-current" aria-hidden="true" />
              Book Your First Session
            </Button>
            <Button 
              onClick={() => handleNavigate("reviews")} 
              variant="outline" 
              size="lg" 
              className="bg-card hover:bg-muted text-foreground border-2 border-border px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Star size={18} className="text-primary fill-current" aria-hidden="true" />
              Read Success Stories
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
            {[
              { icon: <CheckCircle size={14} className="text-green shrink-0" />, text: "Ages 8-14" },
              { icon: <CheckCircle size={14} className="text-green shrink-0" />, text: "Tue-Fri 3-9 PM" },
              { icon: <CheckCircle size={14} className="text-green shrink-0" />, text: "Small Groups" },
            ].map((item, i) => (
              <span 
                key={i}
                className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground"
              >
                {item.icon}
                {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className="relative z-10 order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[380px]">
            {/* Background accent */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange/15 rounded-2xl transform rotate-3 scale-105 z-0" 
              aria-hidden="true" 
            />

            {/* Main Image Frame */}
            <div className="relative bg-card p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xl z-10 transform -rotate-1 transition-transform hover:rotate-0 duration-500 border border-border/50">
              <div className="rounded-lg sm:rounded-xl overflow-hidden aspect-[4/3] relative group">
                <img 
                  alt="Kids learning together at Inga's Study Corner" 
                  loading="eager" 
                  src="/lovable-uploads/5fafd3c0-0a69-4f4c-a005-67c9a1b8929d.png" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />

                {/* Quote Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary/95 via-secondary/70 to-transparent p-3 sm:p-4 text-primary-foreground text-center">
                  <div key={currentQuoteIndex} className="animate-fade-in">
                    <p className="font-bold text-xs sm:text-sm italic leading-snug drop-shadow-sm">
                      "{quotes[currentQuoteIndex]}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-3 bg-card p-2 sm:p-2.5 rounded-lg shadow-lg z-20 border border-border/50">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="bg-green/15 p-1.5 rounded-full">
                  <ThumbsUp className="text-green w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-[10px] sm:text-xs leading-tight">
                    Parents Love It
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                    100% Recommended
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
