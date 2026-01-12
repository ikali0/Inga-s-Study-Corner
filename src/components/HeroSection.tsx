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
  return <section id="hero" className="relative pt-20 pb-8 sm:pt-24 sm:pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Decorative Blobs - Hidden on mobile for cleaner look */}
      <div className="hidden sm:block blob-shape -top-20 -left-20 w-72 h-72 md:w-96 md:h-96 bg-pink-light rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl" aria-hidden="true" />
      <div className="hidden sm:block blob-shape bottom-10 -right-10 w-56 h-56 md:w-72 md:h-72 bg-blue-light rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-3xl" aria-hidden="true" />
      <div className="hidden sm:block blob-shape top-1/2 left-10 w-40 h-40 md:w-52 md:h-52 bg-green-light rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-3xl" aria-hidden="true" />

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 z-10 order-2 md:order-1">
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-sm transform -rotate-1">
            ✨ Interactive Learning for Ages 8–14
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
            Build{" "}
            <span className="text-primary underline decoration-wavy decoration-accent underline-offset-4">
              Confidence
            </span>
            . Strengthen <span className="text-blue">Skills</span>.
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
            Inga's Study Corner is a supportive after-school learning space where
            students strengthen their understanding of{" "}
            <strong className="text-foreground">math, english and science</strong>{" "}
            through clear explanations, guided practice, and curiosity-driven
            learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => handleNavigate("book")} size="lg" className="btn-bounce bg-blue hover:bg-blue/90 text-primary-foreground px-5 sm:px-6 md:px-8 py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg shadow-xl flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
              <Zap size={18} className="fill-current" />
              Book Your First Session
            </Button>
            <Button onClick={() => handleNavigate("reviews")} variant="outline" size="lg" className="btn-bounce bg-card hover:bg-muted text-foreground border-2 border-border px-5 sm:px-6 md:px-8 py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
              <Star size={18} className="text-primary fill-current" />
              Read Success Stories
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm font-semibold text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle size={14} className="text-green shrink-0" /> Ages 8-14
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle size={14} className="text-green shrink-0" /> Tue-Fri 3-9 PM
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle size={14} className="text-green shrink-0" /> Small Groups
            </span>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative z-10 order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md">
            {/* Background accent blob */}
            <div className="absolute inset-0 bg-primary/20 rounded-2xl md:rounded-3xl transform rotate-3 scale-105 z-0" aria-hidden="true" />

            {/* Main Image Frame */}
            <div className="relative bg-card p-2 sm:p-3 rounded-2xl md:rounded-3xl shadow-xl z-10 transform -rotate-1 transition-transform hover:rotate-0 duration-500">
              <div className="rounded-xl md:rounded-2xl overflow-hidden aspect-[4/3] relative group">
                <img alt="Kids learning together at Inga's Study Corner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="eager" src="/lovable-uploads/a0aa8e09-8040-4729-8a5d-2f83fdeda30d.png" />

                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary/90 via-secondary/60 to-transparent p-3 sm:p-4 md:p-6 text-primary-foreground text-center">
                  <div key={currentQuoteIndex} className="fade-in-text">
                    <p className="font-bold text-xs sm:text-sm md:text-base lg:text-lg italic leading-snug">
                      "{quotes[currentQuoteIndex]}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-2 -right-1 sm:-bottom-3 sm:-right-2 md:-bottom-4 md:-right-3 lg:-bottom-6 lg:-right-4 bg-card p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl shadow-lg z-20">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="bg-green-light p-1 sm:p-1.5 md:p-2 rounded-full">
                  <ThumbsUp className="text-green w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-[10px] sm:text-xs md:text-sm">
                    Parents Love It
                  </p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
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