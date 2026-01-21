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
  icon: <Smile className="w-5 h-5" />,
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
  return <section ref={ref} id="about" className="py-8 sm:py-12 md:py-16 lg:py-20 relative z-10" aria-labelledby="about-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-secondary rounded-xl sm:rounded-2xl text-secondary-foreground p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden shadow-sm px-[28px] py-[28px] border border-fuchsia-600 border-solid">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 sm:opacity-10 pointer-events-none" style={{
          backgroundImage: "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }} aria-hidden="true" />

          <div className="relative z-10">
            {/* Header */}
            <header className="text-center mb-6 sm:mb-8 md:mb-10">
              <h2 id="about-heading" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                Why Parents Choose Us
              </h2>
              <p className="text-secondary-foreground/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                A learning environment designed with care, patience, and proven results.
              </p>
            </header>

            {/* Features Grid - Mobile First */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {features.map((feature, index) => <article key={index} className="flex gap-3 p-4 sm:p-5 rounded-lg sm:rounded-xl border backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 bg-card border-solid border-blue-600 sm:gap-[12px]">
                  {/* Icon Container */}
                  <div className={`${feature.iconBg} ${feature.iconColor} p-2 sm:p-2.5 rounded-lg h-fit shrink-0 transition-transform duration-200 group-hover:scale-110`} aria-hidden="true">
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold mb-1 sm:mb-1.5 text-card-foreground leading-snug sm:text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed sm:text-xs">{feature.description}</p>
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