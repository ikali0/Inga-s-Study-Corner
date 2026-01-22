import { forwardRef } from "react";
import { Smile, Zap, Heart } from "lucide-react";
interface Feature {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}
const features: Feature[] = [{
  icon: <Smile className="h-[18px] w-[18px]" />,
  iconBg: "bg-blue/10",
  iconColor: "text-blue",
  title: "Confidence First",
  description: "Students learn best when relaxed. We create calm before curriculum."
}, {
  icon: <Zap className="w-5 h-5" />,
  iconBg: "bg-purple/10",
  iconColor: "text-purple",
  title: "Personalized Methods",
  description: "Each student learns differently. Sessions adapt to their style."
}, {
  icon: <Heart className="w-5 h-5" />,
  iconBg: "bg-primary/10",
  iconColor: "text-primary",
  title: "Focused Environment",
  description: "Library-based sessions. Quiet, structured, results-driven."
}];
const AboutSection = forwardRef<HTMLElement>((_, ref) => {
  return <section ref={ref} id="about" className="py-6 sm:py-10 md:py-14 lg:py-18 relative z-10" aria-labelledby="about-heading">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="bg-secondary rounded-lg sm:rounded-xl text-secondary-foreground p-3 sm:p-5 md:p-6 lg:p-10 relative overflow-hidden shadow-sm border border-fuchsia-600 border-solid">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 sm:opacity-10 pointer-events-none" style={{
          backgroundImage: "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }} aria-hidden="true" />

          <div className="relative z-10">
            {/* Header */}
            <header className="text-center mb-4 sm:mb-6 md:mb-8">
              <h2 id="about-heading" className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1.5 sm:mb-2">
                Why Parents Choose Us
              </h2>
              <p className="text-secondary-foreground/80 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                A learning environment designed with care, patience, and proven results.
              </p>
            </header>

            {/* Features Grid - Mobile First */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {features.map((feature, index) => <article key={index} className="group flex gap-2 p-2.5 sm:p-3.5 rounded-lg border backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 bg-card border-solid border-blue-600">
                  {/* Icon Container */}
                  <div className={`${feature.iconBg} ${feature.iconColor} p-1.5 sm:p-2 rounded-md h-fit shrink-0 icon-hover`} aria-hidden="true">
                    <div className="icon-bounce">{feature.icon}</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold mb-0.5 sm:mb-1 text-card-foreground leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </article>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
});
AboutSection.displayName = "AboutSection";
export default AboutSection;