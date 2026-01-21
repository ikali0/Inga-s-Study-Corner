import { useState, useEffect, useCallback } from 'react';
import { Zap, Star, CheckCircle, ThumbsUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrustChip } from '@/components/ui/trust-chip';
import { useMultipleParallax } from '@/hooks/use-parallax';
import heroImage from '@/assets/hero-kids-learning.jpg';
interface HeroSectionProps {
  onNavigate: (id: string) => void;
}
const quotes = ["Learning should feel like play.", "Mistakes are proof you are trying.", "Every expert was once a beginner.", "Small steps lead to big jumps."];
const HeroSection = ({
  onNavigate
}: HeroSectionProps) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [gradientPhase, setGradientPhase] = useState(0);
  const {
    getOffset,
    getRotation,
    getScale
  } = useMultipleParallax();
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(quoteInterval);
  }, []);

  // Animated gradient phase
  useEffect(() => {
    const gradientInterval = setInterval(() => {
      setGradientPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(gradientInterval);
  }, []);
  const handleNavigate = useCallback((id: string) => {
    onNavigate(id);
  }, [onNavigate]);

  // Dynamic gradient classes based on phase
  const gradientClasses = ['from-primary/15 via-blue/10 to-orange/15', 'from-blue/15 via-orange/10 to-primary/15', 'from-orange/15 via-primary/10 to-blue/15', 'from-primary/10 via-green/10 to-blue/15'];
  return <section id="hero" aria-labelledby="hero-heading" className="relative pt-20 pb-8 sm:pt-24 sm:pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Animated Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradientPhase]} transition-all duration-[2000ms] ease-in-out`} aria-hidden="true" />
      
      {/* Secondary animated gradient layer */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${gradientClasses[(gradientPhase + 2) % 4]} opacity-50 transition-all duration-[2500ms] ease-in-out`} aria-hidden="true" />

      {/* Parallax Background Elements */}
      <div className="absolute top-8 left-2 sm:left-10 w-24 h-24 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-gradient-to-br from-primary/25 to-primary/5 rounded-full blur-2xl sm:blur-3xl pointer-events-none" style={{
      transform: `translateY(${getOffset(0.3, 'down')}px) rotate(${getRotation(0.5)}deg) scale(${getScale(1, 0.5)})`
    }} aria-hidden="true" />
      <div className="absolute top-1/3 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-bl from-orange/20 to-orange/5 rounded-full blur-2xl sm:blur-3xl pointer-events-none" style={{
      transform: `translateY(${getOffset(0.2, 'up')}px) rotate(${getRotation(-0.3)}deg)`
    }} aria-hidden="true" />
      <div className="absolute bottom-16 left-1/4 w-20 h-20 sm:w-32 sm:h-32 lg:w-44 lg:h-44 bg-gradient-to-tr from-blue/20 to-blue/5 rounded-full blur-xl sm:blur-2xl pointer-events-none" style={{
      transform: `translateY(${getOffset(0.4, 'down')}px) scale(${getScale(1.1, 0.3)})`
    }} aria-hidden="true" />
      <div className="hidden sm:block absolute top-1/2 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-green/15 to-green/5 rounded-full blur-xl sm:blur-2xl pointer-events-none" style={{
      transform: `translateY(${getOffset(0.25, 'up')}px)`
    }} aria-hidden="true" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-12 xl:gap-16 items-center relative z-10">
        {/* Text Content */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-5 z-10 order-2 lg:order-1 text-center lg:text-left">
          {/* Badge with sparkle */}
          <a href="tel:215-791-5906" className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary/20 to-orange/15 text-primary sm:py-2 font-bold text-[11px] sm:text-xs tracking-wide border border-primary/25 shadow-sm sm:px-3 hover:from-primary/30 hover:to-orange/25 hover:shadow-md transition-all duration-200 active:scale-95 group rounded-sm opacity-80 border-dotted text-center px-[6px] py-[6px]">
            
            <span>📞 215-791-5906</span>
          </a>

          {/* Heading - Improved mobile sizing */}
          <h1 id="hero-heading" className="text-[1.625rem] leading-[1.2] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">
            Build{" "}
            <span className="text-primary underline decoration-wavy decoration-accent underline-offset-4 decoration-2">
              Confidence
            </span>
            . Strengthen <span className="text-blue">Skills</span>.
          </h1>

          {/* Description - Better mobile readability */}
          <p className="text-[13px] leading-relaxed sm:text-sm lg:text-base text-muted-foreground font-medium max-w-xl mx-auto lg:mx-0">
            Inga's Study Corner is a supportive after-school learning space where
            students strengthen their understanding of{" "}
            <strong className="text-foreground">Math, English and Science</strong>{" "}
            through clear explanations, guided practice, and curiosity-driven learning.
          </p>

          {/* CTA Buttons - Improved mobile layout with proper tap targets */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start pt-1 sm:pt-2 sm:gap-[6px]">
            <Button onClick={() => handleNavigate("book")} variant="cta" size="touch" className="bg-blue hover:bg-blue/90 text-primary-foreground px-5 sm:px-6 rounded-xl font-semibold text-sm shadow-lg shadow-blue/25 hover:shadow-xl hover:shadow-blue/35 flex items-center justify-center gap-2 w-full sm:w-auto border border-blue/40">
              <Zap size={16} className="fill-current" aria-hidden="true" />
              Contact Now
            </Button>
            <Button onClick={() => handleNavigate("reviews")} variant="outline" size="touch" className="bg-card hover:bg-muted text-foreground border-2 border-border px-5 sm:px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 w-full sm:w-auto">
              <Star size={16} className="text-primary fill-current" aria-hidden="true" />
              Parent Reviews
            </Button>
          </div>

          {/* Trust Chips Row */}
          <div className="flex flex-wrap justify-center lg:justify-start pt-2 gap-[6px] py-[6px]">
            <TrustChip variant="success" icon="shield">
              Background Verified
            </TrustChip>
            <TrustChip variant="info" icon="award">
              5+ Years Experience
            </TrustChip>
          </div>

          {/* Feature Pills - Compact mobile layout */}
          <div className="flex flex-wrap justify-center lg:justify-start pt-1 py-[6px] gap-[4px]">
            {[{
            icon: <CheckCircle size={10} className="text-green shrink-0" />,
            text: "Ages 8-14",
            target: "about",
            color: "from-green/20 to-green/10 border-green/30"
          }, {
            icon: <CheckCircle size={10} className="text-blue shrink-0" />,
            text: "Tue-Fri 3-9 PM",
            target: "book",
            color: "from-blue/20 to-blue/10 border-blue/30"
          }, {
            icon: <CheckCircle size={10} className="text-orange shrink-0" />,
            text: "Small Groups",
            target: "services",
            color: "from-orange/20 to-orange/10 border-orange/30"
          }].map((item, i) => <button key={i} onClick={() => handleNavigate(item.target)} className={`flex items-center gap-1 bg-gradient-to-r ${item.color} px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold text-foreground border shadow-[0_2px_0_0_hsl(var(--border)),0_3px_6px_-2px_hsl(var(--muted)/0.4)] transition-all duration-150 cursor-pointer hover:translate-y-0.5 hover:shadow-[0_1px_0_0_hsl(var(--border))] active:shadow-none active:translate-y-1`}>
                {item.icon}
                {item.text}
              </button>)}
          </div>
        </div>

        {/* Image Section - Enhanced 3D Design */}
        <div className="relative z-10 order-1 lg:order-2 flex justify-center lg:justify-end" style={{
        perspective: '1200px'
      }}>
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] group/card">
            {/* Deep shadow layer for 3D depth */}
            <div className="absolute -inset-4 sm:-inset-5 lg:-inset-6 bg-gradient-to-br from-secondary/40 via-secondary/20 to-transparent rounded-3xl sm:rounded-[2rem] transform translate-y-4 translate-x-2 blur-xl z-0 transition-all duration-500 group-hover/card:translate-y-6 group-hover/card:translate-x-3" aria-hidden="true" />
            
            {/* Background accent blob - 3D layer 1 */}
            <div className="absolute -inset-3 sm:-inset-4 lg:-inset-5 bg-gradient-to-br from-primary/35 via-orange/30 to-blue/25 rounded-2xl sm:rounded-3xl transform rotate-3 scale-105 z-0 blur-sm transition-all duration-500 group-hover/card:rotate-1 group-hover/card:scale-107" aria-hidden="true" />

            {/* Secondary glow - 3D layer 2 */}
            <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-tr from-blue/20 to-primary/20 rounded-xl sm:rounded-2xl transform -rotate-2 z-0 transition-all duration-500 group-hover/card:rotate-0" aria-hidden="true" />

            {/* Main Image Frame - 3D Card */}
            <div className="relative bg-card p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl z-10 border-3 border-border/70 transition-all duration-500 ease-out group-hover/card:border-primary/50" style={{
            transform: 'rotateX(4deg) rotateY(-3deg)',
            transformStyle: 'preserve-3d',
            boxShadow: '0 25px 50px -12px hsl(var(--secondary)/0.5), 0 12px 24px -8px hsl(var(--primary)/0.15), inset 0 1px 0 hsl(var(--card)/0.8)'
          }}>
              {/* Inner 3D frame */}
              <div className="rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden aspect-[4/3] relative shadow-inner border border-border/30" style={{
              transform: 'translateZ(20px)'
            }}>
                <img alt="Kids learning together at Inga's Study Corner" loading="eager" src={heroImage} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110" />

                {/* Glossy overlay for 3D effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" aria-hidden="true" />

                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                {/* Quote Overlay - Enhanced */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary/95 via-secondary/85 to-transparent p-2.5 sm:p-3 lg:p-4 text-primary-foreground text-center">
                  <div key={currentQuoteIndex} className="animate-fade-in">
                    <p className="font-bold text-[11px] sm:text-xs lg:text-sm italic leading-snug drop-shadow-lg">
                      "{quotes[currentQuoteIndex]}"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 3D Edge highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />
            </div>

            {/* Floating Badge - Enhanced 3D */}
            <div className="absolute -bottom-4 -right-3 sm:-bottom-5 sm:-right-4 lg:-bottom-6 lg:-right-5 bg-card p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl z-20 border-2 border-border/70 hover:border-green/50 transition-all duration-300 hover:scale-110 animate-float px-[10px] py-[10px]" style={{
            boxShadow: '0 15px 30px -8px hsl(var(--secondary)/0.4), 0 8px 16px -4px hsl(var(--green)/0.1)',
            transform: 'translateZ(40px)'
          }}>
              <div className="gap-1.5 sm:gap-2 lg:gap-2.5 flex items-start justify-center">
                <div className="bg-gradient-to-br from-green/30 to-green/10 p-1.5 sm:p-2 rounded-full border border-green/25 shadow-inner">
                  <ThumbsUp className="text-green w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-[10px] sm:text-xs lg:text-sm leading-tight">
                    Parents Love It
                  </p>
                  <p className="text-[7px] sm:text-[9px] md:text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                    100% Recommended
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative floating elements - Enhanced */}
            <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-primary/30 rounded-full blur-sm animate-pulse" style={{
            transform: 'translateZ(30px)'
          }} aria-hidden="true" />
            <div className="absolute top-1/4 -right-4 sm:-right-5 w-4 h-4 sm:w-6 sm:h-6 bg-orange/40 rounded-full blur-sm animate-pulse" style={{
            animationDelay: '1s',
            transform: 'translateZ(25px)'
          }} aria-hidden="true" />
            <div className="absolute bottom-1/3 -left-3 sm:-left-4 w-3 h-3 sm:w-5 sm:h-5 bg-blue/35 rounded-full blur-sm animate-pulse" style={{
            animationDelay: '2s',
            transform: 'translateZ(20px)'
          }} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;