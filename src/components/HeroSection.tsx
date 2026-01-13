import { useState, useEffect, useCallback } from 'react';
import { Zap, Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMultipleParallax } from '@/hooks/use-parallax';
interface HeroSectionProps {
  onNavigate: (id: string) => void;
}
const quotes = ["Learning should feel like play.", "Mistakes are proof you are trying.", "Every expert was once a beginner.", "Small steps lead to big jumps."];
const HeroSection = ({
  onNavigate
}: HeroSectionProps) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const {
    getOffset,
    getRotation,
    getScale
  } = useMultipleParallax();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const handleNavigate = useCallback((id: string) => {
    onNavigate(id);
  }, [onNavigate]);
  return <section id="hero" aria-labelledby="hero-heading" className="relative pt-24 pb-10 sm:pt-28 sm:pb-14 md:pt-32 md:pb-18 lg:pt-36 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Parallax Background Elements */}
      <div className="absolute top-10 left-5 sm:left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl pointer-events-none" style={{
      transform: `translateY(${getOffset(0.3, 'down')}px) rotate(${getRotation(0.5)}deg) scale(${getScale(1, 0.5)})`
    }} aria-hidden="true" />
      <div className="absolute top-1/3 right-0 w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 bg-gradient-to-bl from-orange/15 to-orange/5 rounded-full blur-3xl pointer-events-none" style={{
      transform: `translateY(${getOffset(0.2, 'up')}px) rotate(${getRotation(-0.3)}deg)`
    }} aria-hidden="true" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-tr from-blue/15 to-blue/5 rounded-full blur-2xl pointer-events-none" style={{
      transform: `translateY(${getOffset(0.4, 'down')}px) scale(${getScale(1.1, 0.3)})`
    }} aria-hidden="true" />
      <div className="absolute top-1/2 left-0 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-r from-green/10 to-green/5 rounded-full blur-2xl pointer-events-none" style={{
      transform: `translateY(${getOffset(0.25, 'up')}px)`
    }} aria-hidden="true" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center relative z-10">
        {/* Text Content */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6 z-10 order-2 lg:order-1 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-block bg-gradient-to-r from-primary/15 to-orange/10 text-primary py-2 font-bold text-xs sm:text-sm tracking-wide border border-primary/20 shadow-sm px-[8px] rounded-sm">
            ✨ Interactive Learning for Ages 8–14
          </div>

          {/* Heading */}
          <h1 id="hero-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
            Build{" "}
            <span className="text-primary underline decoration-wavy decoration-accent underline-offset-4 decoration-2">
              Confidence
            </span>
            . Strengthen <span className="text-blue">Skills</span>.
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
            Inga's Study Corner is a supportive after-school learning space where
            students strengthen their understanding of{" "}
            <strong className="text-foreground">Math, English and Science</strong>{" "}
            through clear explanations, guided practice, and curiosity-driven learning.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
            <Button onClick={() => handleNavigate("book")} size="lg" className="btn-3d bg-blue hover:bg-blue/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-blue/25 flex items-center justify-center gap-2 w-full sm:w-auto border-2 border-blue/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue/30 hover:-translate-y-0.5">
              <Zap size={18} className="fill-current" aria-hidden="true" />
              Book Your First Session
            </Button>
            <Button onClick={() => handleNavigate("reviews")} variant="outline" size="lg" className="bg-card hover:bg-muted text-foreground border-2 border-border hover:border-primary/30 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <Star size={18} className="text-primary fill-current" aria-hidden="true" />
              Read Success Stories
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-2 sm:gap-[8px]">
            {[{
            icon: <CheckCircle size={14} className="text-green shrink-0" />,
            text: "Ages 8-14"
          }, {
            icon: <CheckCircle size={14} className="text-green shrink-0" />,
            text: "Tue-Fri 3-9 PM"
          }, {
            icon: <CheckCircle size={14} className="text-green shrink-0" />,
            text: "Small Groups"
          }].map((item, i) => <span key={i} className="flex items-center gap-1.5 bg-muted/60 backdrop-blur-sm px-3 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-muted-foreground border border-border/50 shadow-sm sm:text-xs sm:px-[8px]">
                {item.icon}
                {item.text}
              </span>)}
          </div>
        </div>

        {/* Image Section */}
        <div className="relative z-10 order-1 lg:order-2 flex justify-center lg:justify-end perspective-1000">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px]">
            {/* Background accent blob */}
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-br from-primary/25 via-orange/20 to-blue/15 rounded-3xl sm:rounded-[2rem] transform rotate-3 scale-105 z-0 blur-sm" aria-hidden="true" />
            
            {/* Secondary glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-blue/10 to-primary/10 rounded-2xl sm:rounded-3xl transform -rotate-2 scale-102 z-0" aria-hidden="true" />

            {/* Main Image Frame - 3D Card Effect */}
            <div className="card-3d relative bg-card p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl z-10 transform -rotate-1 transition-all duration-500 hover:rotate-0 hover:scale-[1.02] border-2 sm:border-3 border-border/60 hover:border-primary/40 hover:shadow-primary/20">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] relative group shadow-inner">
                <img alt="Kids learning together at Inga's Study Corner" loading="eager" src="/lovable-uploads/5fafd3c0-0a69-4f4c-a005-67c9a1b8929d.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quote Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary/95 via-secondary/80 to-transparent p-3 sm:p-4 lg:p-5 text-primary-foreground text-center">
                  <div key={currentQuoteIndex} className="animate-fade-in">
                    <p className="font-bold text-xs sm:text-sm lg:text-base italic leading-snug drop-shadow-md">
                      "{quotes[currentQuoteIndex]}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge - 3D Effect */}
            <div className="absolute -bottom-4 -right-3 sm:-bottom-5 sm:-right-4 lg:-bottom-6 lg:-right-5 bg-card p-2.5 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-xl z-20 border-2 border-border/60 hover:border-green/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-float">
              <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                <div className="bg-gradient-to-br from-green/20 to-green/10 p-1.5 sm:p-2 rounded-full border border-green/20">
                  <ThumbsUp className="text-green w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-[11px] sm:text-xs lg:text-sm leading-tight">
                    Parents Love It
                  </p>
                  <p className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    100% Recommended
                  </p>
                </div>
              </div>
            </div>
            
            {/* Decorative floating elements */}
            <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 bg-primary/20 rounded-full blur-sm animate-pulse" aria-hidden="true" />
            <div className="absolute top-1/4 -right-4 sm:-right-6 w-4 h-4 sm:w-6 sm:h-6 bg-orange/30 rounded-full blur-sm animate-pulse" style={{
            animationDelay: '1s'
          }} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;