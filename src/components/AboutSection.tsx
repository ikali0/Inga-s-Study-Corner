import { Smile, Zap, Heart } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Smile className="w-5 h-5" />,
    iconBg: "bg-blue-500/10 dark:bg-blue-400/15",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "Builds Confidence, Not Pressure",
    description: "A calm, encouraging space to grow. We tackle anxiety before algebra.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    iconBg: "bg-purple-500/10 dark:bg-purple-400/15",
    iconColor: "text-purple-600 dark:text-purple-400",
    title: "Encourages Thinking, Not Memorization",
    description: "Visual learner? We draw. Kinesthetic? We build. Adapted to YOUR child.",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    iconBg: "bg-pink-500/10 dark:bg-pink-400/15",
    iconColor: "text-pink-600 dark:text-pink-400",
    title: "Supports School Success",
    description: "Library-based, distraction-free environment supporting success across STEM subjects.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-8 sm:py-12 md:py-16 lg:py-20 relative z-10" aria-labelledby="about-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-secondary rounded-xl sm:rounded-2xl text-secondary-foreground p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden shadow-sm">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-5 sm:opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            {/* Header */}
            <header className="text-center mb-6 sm:mb-8 md:mb-10">
              <h2 id="about-heading" className="text-xl sm: text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                Why Parents Choose Us
              </h2>
              <p className="text-secondary-foreground/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                A learning environment designed with care, patience, and proven results.
              </p>
            </header>

            {/* Features Grid - Mobile First */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {features.map((feature, index) => (
                <article
                  key={index}
                  className="flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg sm:rounded-xl bg-card/95 border border-border/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-border hover:-translate-y-0.5 active:translate-y-0"
                >
                  {/* Icon Container */}
                  <div
                    className={`${feature.iconBg} ${feature.iconColor} p-2 sm:p-2.5 rounded-lg h-fit shrink-0 transition-transform duration-200 group-hover:scale-110`}
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-1.5 text-card-foreground leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
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
