import React, { useState } from "react";
import { BookOpen, CheckCircle2, Globe, Sigma, Sparkles, FlaskConical, ArrowRight } from "lucide-react";
import QuestionOfTheDay from "./QuestionOfTheDay";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Types ---
type ThemeColor = "blue" | "purple" | "green" | "orange";

interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: ThemeColor;
  features: string[];
  longDescription: string;
  detailedFeatures: {
    title: string;
    items: string[];
  }[];
  approach: string;
  outcomes: string[];
}

// --- Theme Config ---
const themeConfig = {
  blue: {
    card: "border-blue/30 hover:border-blue/50 hover:shadow-lg hover:shadow-blue/10",
    iconBg: "bg-blue/10 text-blue",
    check: "text-blue",
    badge: "bg-blue/10 text-blue",
    button: "bg-blue hover:bg-blue/90",
  },
  purple: {
    card: "border-purple/30 hover:border-purple/50 hover:shadow-lg hover:shadow-purple/10",
    iconBg: "bg-purple/10 text-purple",
    check: "text-purple",
    badge: "bg-purple/10 text-purple",
    button: "bg-purple hover:bg-purple/90",
  },
  green: {
    card: "border-green/30 hover:border-green/50 hover:shadow-lg hover:shadow-green/10",
    iconBg: "bg-green/10 text-green",
    check: "text-green",
    badge: "bg-green/10 text-green",
    button: "bg-green hover:bg-green/90",
  },
  orange: {
    card: "border-orange/30 hover:border-orange/50 hover:shadow-lg hover:shadow-orange/10",
    iconBg: "bg-orange/10 text-orange",
    check: "text-orange",
    badge: "bg-orange/10 text-orange",
    button: "bg-orange hover:bg-orange/90",
  },
};

// --- Data (same as before, omitted for brevity) ---
const services: Service[] = [
  /* … all services … */
];

// --- Subcomponents ---
const FeatureList = ({ features, checkClass }: { features: string[]; checkClass: string }) => (
  <ul className="space-y-2 mb-4">
    {features.map((f, i) => (
      <li key={i} className="flex items-center gap-2">
        <CheckCircle2 className={`w-4 h-4 shrink-0 ${checkClass}`} />
        <span className="font-medium text-foreground text-xs sm:text-sm">{f}</span>
      </li>
    ))}
  </ul>
);

const DetailedFeatures = ({ sections, checkClass }: { sections: Service["detailedFeatures"]; checkClass: string }) => (
  <div className="space-y-4">
    {sections.map((section, idx) => (
      <div key={idx} className="p-4 rounded-lg bg-card border border-border">
        <h5 className={`font-bold text-sm mb-3 ${checkClass}`}>{section.title}</h5>
        <ul className="space-y-2">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${checkClass}`} />
              <span className="text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const OutcomesList = ({ outcomes }: { outcomes: string[] }) => (
  <ul className="space-y-3">
    {outcomes.map((outcome, i) => (
      <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-xs font-bold text-primary">{i + 1}</span>
        </div>
        <span className="text-sm font-medium text-foreground">{outcome}</span>
      </li>
    ))}
  </ul>
);

// --- Main Component ---
const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleBooking = () => {
    setSelectedService(null);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="py-10 sm:py-16 md:py-20 bg-muted/30 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header + Quiz */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10 mb-8 lg:mb-12">
          <div className="text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-foreground text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3 h-3 text-primary fill-primary" />
              Our Programs
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-foreground tracking-tight mb-3 lg:mb-4">
              Academic Excellence
              <br />
              <span className="text-primary">For Every Student</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
              Patient, age-appropriate guidance in a focused environment built for{" "}
              <span className="underline decoration-wavy decoration-primary/50 decoration-2 underline-offset-2">
                confidence & mastery
              </span>
              .
            </p>
          </div>
          <div className="w-full lg:w-80 lg:shrink-0">
            <QuestionOfTheDay />
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const theme = themeConfig[service.color];
            return (
              <article
                key={service.id}
                onClick={() => setSelectedService(service)}
                tabIndex={0}
                role="button"
                className={`
                  group cursor-pointer relative p-5 sm:p-6 rounded-xl border-2 bg-card transition-all duration-300
                  transform hover:-translate-y-1 hover:scale-105 ${theme.card}
                `}
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${theme.iconBg}`}
                  >
                    {service.icon}
                  </div>
                  <div className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${theme.badge}`}>Grades K-8</div>
                </div>
                <h3 className="font-bold text-foreground mb-2 text-base sm:text-lg group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-xs sm:text-sm line-clamp-3">
                  {service.description}
                </p>
                <div className="h-px w-full bg-border mb-4" />
                <FeatureList features={service.features} checkClass={theme.check} />
                <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Sheet */}
      <Sheet
        open={!!selectedService}
        onOpenChange={(open) => {
          if (!open) setSelectedService(null);
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          {selectedService && (
            <ScrollArea className="h-screen sm:h-auto">
              <div className="p-6 sm:p-8">
                <SheetHeader className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center ${themeConfig[selectedService.color].iconBg}`}
                    >
                      {selectedService.icon &&
                        React.cloneElement(selectedService.icon as React.ReactElement, { className: "w-7 h-7" })}
                    </div>
                    <div
                      className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${themeConfig[selectedService.color].badge}`}
                    >
                      Grades K-8
                    </div>
                  </div>
                  <SheetTitle className="text-2xl font-bold text-foreground">{selectedService.title}</SheetTitle>
                  <SheetDescription className="text-muted-foreground leading-relaxed">
                    {selectedService.longDescription}
                  </SheetDescription>
                </SheetHeader>

                <section className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Our Approach
                  </h4>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-foreground leading-relaxed">{selectedService.approach}</p>
                  </div>
                </section>

                <section className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    What We Cover
                  </h4>
                  <DetailedFeatures
                    sections={selectedService.detailedFeatures}
                    checkClass={themeConfig[selectedService.color].check}
                  />
                </section>

                <section className="mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Expected Outcomes
                  </h4>
                  <OutcomesList outcomes={selectedService.outcomes} />
                </section>

                <Button
                  onClick={handleBooking}
                  className={`w-full py-6 text-base font-bold ${themeConfig[selectedService.color].button} text-primary-foreground`}
                >
                  Book a Trial Session
                </Button>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default ServicesSection;
