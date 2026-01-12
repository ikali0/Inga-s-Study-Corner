import { useState, useEffect, useCallback } from 'react';
import { Zap, Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-kids-learning.jpg';
interface HeroSectionProps {
  onNavigate: (id: string) => void;
}
const quotes = ["Learning should feel like play.", "Mistakes are proof you are trying.", "Every expert was once a beginner.", "Small steps lead to big jumps."];
const HeroSection = ({
  onNavigate
}: HeroSectionProps) => {
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
  return <section id="hero" className="relative pt-24 pb-10 sm:pt-28 sm:pb-14 md:pt-32 md:pb-18 lg:pt-36 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden" aria-labelledby="hero-heading">
      {/* Decorative Blobs - Hidden on mobile for cleaner look */}
      <div className="hidden md:block blob-shape -top-24 -left-24 w-80 h-80 lg:w-[28rem] lg:h-[28rem] bg-pink-light rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl opacity-60" aria-hidden="true" />
      <div className="hidden md:block blob-shape bottom-0 -right-16 w-64 h-64 lg:w-80 lg:h-80 bg-blue-light rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-3xl opacity-60" aria-hidden="true" />
      <div className="hidden lg:block blob-shape top-1/3 left-1/4 w-48 h-48 bg-green-light rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-3xl opacity-50" aria-hidden="true" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-center">
        {/* Text Content */}
        <div className="space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8 z-10 order-2 md:order-1 text-center md:text-left">
          <div className="inline-block bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-sm transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            ✨ Interactive Learning for Ages 8–14
          </div>

          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.15] text-foreground">
            Build{" "}
            <span className="text-primary underline decoration-wavy decoration-accent underline-offset-4 decoration-2">
              Confidence
            </span>
            . Strengthen <span className="text-blue">Skills</span>.
          </h1>

          <p className="text-sm sm:text-base md:text-base lg:text-lg text-muted-foreground font-medium max-w-lg leading-relaxed mx-auto md:mx-0">
            Inga's Study Corner is a supportive after-school learning space where
            students strengthen their understanding of{" "}
            <strong className="text-foreground">math, english and science</strong>{" "}
            through clear explanations, guided practice, and curiosity-driven
            learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <Button onClick={() => handleNavigate("book")} size="lg" className="btn-bounce bg-blue hover:bg-blue/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-blue/20 flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
              <Zap size={18} className="fill-current" aria-hidden="true" />
              Book Your First Session
            </Button>
            <Button onClick={() => handleNavigate("reviews")} variant="outline" size="lg" className="btn-bounce bg-card hover:bg-muted text-foreground border-2 border-border px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
              <Star size={18} className="text-primary fill-current" aria-hidden="true" />
              Read Success Stories
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs sm:text-sm font-semibold text-muted-foreground justify-center md:justify-start pt-1 py-[2px] sm:gap-[14px]">
            <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
              <CheckCircle size={14} className="text-green shrink-0" aria-hidden="true" /> Ages 8-14
            </span>
            <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
              <CheckCircle size={14} className="text-green shrink-0" aria-hidden="true" /> Tue-Fri 3-9 PM
            </span>
            <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
              <CheckCircle size={14} className="text-green shrink-0" aria-hidden="true" /> Small Groups
            </span>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative z-10 order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[400px]">
            {/* Background accent blob */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-orange/20 rounded-2xl md:rounded-3xl transform rotate-3 scale-105 z-0" aria-hidden="true" />

            {/* Main Image Frame */}
            <div className="relative bg-card p-2 sm:p-2.5 md:p-3 rounded-2xl shadow-2xl z-10 transform -rotate-1 transition-transform hover:rotate-0 duration-500 border border-border/50 md:rounded-xl py-[10px] px-[10px]">
              <div className="rounded-xl md:rounded-2xl overflow-hidden aspect-[4/3] relative group">
                <img alt="Kids learning together at Inga's Study Corner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="eager" src="/lovable-uploads/a0aa8e09-8040-4729-8a5d-2f83fdeda30d.png" />

                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary/95 via-secondary/70 to-transparent p-3 sm:p-4 md:p-5 text-primary-foreground text-center">
                  <div key={currentQuoteIndex} className="fade-in-text">
                    <p className="font-bold text-xs sm:text-sm md:text-base italic leading-snug drop-shadow-sm">
                      "{quotes[currentQuoteIndex]}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-3 md:-bottom-5 md:-right-4 bg-card p-2 sm:p-2.5 md:p-3 rounded-xl shadow-lg shadow-foreground/5 z-20 border border-border/50 animate-bounce-subtle">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="bg-green/15 p-1.5 sm:p-2 rounded-full">
                  <ThumbsUp className="text-green w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-[10px] sm:text-xs md:text-sm leading-tight">
                    Parents Love It
                  </p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    100% Recommended
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;