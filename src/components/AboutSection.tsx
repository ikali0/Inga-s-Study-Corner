import { Smile, Zap, Heart } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Smile className="text-blue w-5 h-5 md:w-6 md:h-6" />,
    iconBg: "bg-blue/20",
    title: "Builds Confidence, Not Pressure",
    description: "A calm, encouraging space to grow. We tackle anxiety before algebra.",
  },
  {
    icon: <Zap className="text-purple w-5 h-5 md:w-6 md:h-6" />,
    iconBg: "bg-purple/20",
    title: "Encourages Thinking, Not Memorization",
    description: "Visual learner? We draw. Kinesthetic? We build. Adapted to YOUR child.",
  },
  {
    icon: <Heart className="text-pink w-5 h-5 md:w-6 md:h-6" />,
    iconBg: "bg-pink/20",
    title: "Supports School Success",
    description: "Library-based, distraction-free environment supporting success across STEM subjects.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-10 sm:py-12 md:py-16 lg:py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-secondary rounded-xl sm:rounded-2xl md:rounded-3xl text-secondary-foreground p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 relative overflow-hidden">
          {/* Background patterns */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            <header className="text-center mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                Why Parents Choose Us
              </h2>
              <p className="text-secondary-foreground/80 text-sm sm:text-base max-w-2xl mx-auto">
                A learning environment designed with care, patience, and proven results.
              </p>
            </header>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {features.map((feature, index) => (
                <article
                  key={index}
                  className="flex gap-3 md:gap-4 p-3 sm:p-4 bg-secondary-foreground/5 rounded-lg sm:rounded-xl border border-secondary-foreground/10"
                >
                  <div
                    className={`${feature.iconBg} p-2 sm:p-2.5 md:p-3 rounded-lg md:rounded-xl h-fit shrink-0`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 md:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-foreground/80 text-xs sm:text-sm md:text-base leading-relaxed">
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