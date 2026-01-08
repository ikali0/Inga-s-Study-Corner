import { useState, useEffect } from 'react';
import { Zap, Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-kids-learning.jpg';

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
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-32 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Decorative Blobs */}
      <div className="blob-shape -top-20 -left-20 w-72 h-72 md:w-96 md:h-96 bg-pink-light rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl" />
      <div className="blob-shape bottom-10 -right-10 w-56 h-56 md:w-72 md:h-72 bg-blue-light rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-3xl" />
      <div className="blob-shape top-1/2 left-10 w-40 h-40 md:w-52 md:h-52 bg-green-light rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-3xl" />

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6 md:space-y-8 z-10 order-2 md:order-1">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full font-bold text-sm tracking-wide shadow-sm transform -rotate-1">
            ✨ Interactive Learning for Ages 8–14
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            Build <span className="text-primary underline decoration-wavy decoration-accent">Confidence</span>. Strengthen <span className="text-blue">Skills</span>.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg">
            Inga's Study Corner is a supportive after-school learning space where students strengthen their understanding of <strong className="text-foreground">math and science</strong> through clear explanations, guided practice, and curiosity-driven learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => onNavigate('book')}
              size="lg"
              className="btn-bounce bg-blue hover:bg-blue/90 text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <Zap size={20} className="fill-current" />
              Book Your First Session
            </Button>
            <Button 
              onClick={() => onNavigate('reviews')}
              variant="outline"
              size="lg"
              className="btn-bounce bg-card hover:bg-muted text-foreground border-2 border-border px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
            >
              <Star size={20} className="text-primary fill-current" />
              Read Success Stories
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle size={16} className="text-green" /> Ages 8-14</span>
            <span className="flex items-center gap-1"><CheckCircle size={16} className="text-green" /> Tue-Fri 3-9 PM</span>
            <span className="flex items-center gap-1"><CheckCircle size={16} className="text-green" /> Small Groups</span>
          </div>
        </div>

        <div className="relative z-10 order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-sm md:max-w-md">
            {/* Background accent blob */}
            <div className="absolute inset-0 bg-primary/20 rounded-3xl transform rotate-3 scale-105 z-0"></div>
            
            {/* Main Image Frame */}
            <div className="relative bg-card p-3 rounded-3xl shadow-xl z-10 transform -rotate-1 transition-transform hover:rotate-0 duration-500">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] relative group">
                <img 
                  src={heroImage}
                  alt="Kids learning together at Inga's Study Corner" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary/90 via-secondary/60 to-transparent p-4 md:p-6 text-primary-foreground text-center">
                  <div key={currentQuoteIndex} className="fade-in-text">
                    <p className="font-bold text-base md:text-lg italic leading-snug">"{quotes[currentQuoteIndex]}"</p>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-4 bg-card p-3 rounded-xl shadow-lg animate-bounce-subtle z-20">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-green-light p-2 rounded-full">
                  <ThumbsUp className="text-green w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">Parents Love It</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">100% Recommended</p>
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
