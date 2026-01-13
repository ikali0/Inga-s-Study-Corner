import { Smile, Zap, Heart } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Smile className="text-blue w-5 h-5" />,
    iconBg: "bg-blue/15",
    title: "Builds Confidence, Not Pressure",
    description: "A calm, encouraging space to grow. We tackle anxiety before algebra."
  },
  {
    icon: <Zap className="text-purple w-5 h-5" />,
    iconBg: "bg-purple/15",
    title: "Encourages Thinking, Not Memorization",
    description: "Visual learner? We draw. Kinesthetic? We build. Adapted to YOUR child."
  },
  {
    icon: <Heart className="text-pink w-5 h-5" />,
    iconBg: "bg-pink/15",
    title: "Supports School Success",
    description: "Library-based, distraction-free environment supporting success across STEM subjects."
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-8 sm:py-12 md:py-16 lg:py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-secondary rounded-xl sm:rounded-2xl text-secondary-foreground p-5 sm:p-6 md:p-10 lg:p-12 relative overflow-hidden">
          {/* Background pattern */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
            aria-hidden="true" 
          />

          <div className="relative z-10">
            {/* Header */}
            <header className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                Why Parents Choose Us
              </h2>
              <p className="text-secondary-foreground/80 text-sm max-w-xl mx-auto">
                A learning environment designed with care, patience, and proven results.
              </p>
            </header>

            {/* Features Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <article 
                  key={index} 
                  className="flex gap-3 p-4 rounded-lg bg-card/90 border border-border/50 backdrop-blur-sm transition-shadow hover:shadow-md"
                >
                  <div className={`${feature.iconBg} p-2.5 rounded-lg h-fit shrink-0`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold mb-1 text-card-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
