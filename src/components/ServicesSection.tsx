// src/components/ServicesSection.tsx
import React, { useState } from "react";
import { Sigma, BookOpen, Globe, FlaskConical, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import QuestionOfTheDay from "./QuestionOfTheDay";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

type ThemeColor = "blue" | "purple" | "green" | "orange";

interface Service {
  id: string;
  icon: React.ReactElement;
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

// --- Services Data ---
const services: Service[] = [
  {
    id: "math",
    icon: <Sigma className="w-5 h-5" />,
    title: "Math Mastery",
    description: "From arithmetic to pre-algebra with real-world examples.",
    color: "blue",
    features: ["Elementary → Middle School", "Homework Help", "Test Prep"],
    longDescription:
      "Build strong math foundations with visual manipulatives, real-world problems, and confidence-building techniques.",
    detailedFeatures: [
      { title: "K-2 Focus", items: ["Number sense", "Addition & subtraction", "Basic geometry"] },
      { title: "3-5 Focus", items: ["Multiplication & division", "Fractions", "Word problems"] },
      { title: "6-8 Focus", items: ["Pre-algebra", "Ratios", "Geometry", "Data analysis"] },
    ],
    approach: "I Do, We Do, You Do method with visual learning tools.",
    outcomes: ["Master grade-level math facts", "Solve multi-step problems independently", "Build confidence in class"],
  },
  {
    id: "english",
    icon: <BookOpen className="w-5 h-5" />,
    title: "Reading & English",
    description: "Fluent readers and confident writers from phonics to essays.",
    color: "purple",
    features: ["Reading Comprehension", "Essay Writing", "Vocabulary"],
    longDescription:
      "Supports full journey from learning to read to reading to learn, building fluent readers and confident writers.",
    detailedFeatures: [
      { title: "K-2 Focus", items: ["Phonics", "Sight words", "Early comprehension"] },
      { title: "3-5 Focus", items: ["Main idea", "Paragraph structure", "Vocabulary in context"] },
      { title: "6-8 Focus", items: ["Literary analysis", "Argumentative essays", "Research skills"] },
    ],
    approach: "Graphic organizers, story maps, and guided reading/writing practice.",
    outcomes: ["Read grade-level texts fluently", "Write organized paragraphs", "Expand vocabulary monthly"],
  },
  {
    id: "social",
    icon: <Globe className="w-5 h-5" />,
    title: "Social Studies",
    description: "History, geography, civics – understanding our world.",
    color: "green",
    features: ["History & Geography", "Current Events", "Critical Thinking"],
    longDescription: "Explore history, geography, civics, and current events through inquiry-based learning.",
    detailedFeatures: [
      { title: "K-2 Focus", items: ["Community helpers", "Map skills", "Holidays"] },
      { title: "3-5 Focus", items: ["U.S. history", "States & capitals", "Primary sources"] },
      { title: "6-8 Focus", items: ["World history", "Document analysis", "Civics"] },
    ],
    approach: "Timelines, maps, primary sources, and discussion-based learning.",
    outcomes: [
      "Analyze primary sources",
      "Understand local and federal government",
      "Connect history to modern issues",
    ],
  },
  {
    id: "science",
    icon: <FlaskConical className="w-5 h-5" />,
    title: "Science & STEM",
    description: "Curiosity through experiments and coding basics.",
    color: "orange",
    features: ["Scientific Method", "Hands-on Labs", "Digital Literacy"],
    longDescription: "Inquiry-based STEM program with virtual labs and hands-on experiments.",
    detailedFeatures: [
      { title: "Life Science", items: ["Ecosystems", "Human body systems", "Plant & animal cycles"] },
      { title: "Physical Science", items: ["Matter & energy", "Forces & motion", "Light & sound"] },
      { title: "Earth & Space", items: ["Solar system", "Weather patterns", "Geology"] },
      { title: "Digital Literacy", items: ["Scratch coding", "Logical sequencing", "Robotics intro"] },
    ],
    approach: "Scientific Method: observe, hypothesize, test, conclude.",
    outcomes: ["Design and conduct experiments", "Use scientific vocabulary", "Apply coding logic to solve problems"],
  },
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
const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleBooking = () => {
    setSelectedService(null);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-muted/30 relative overflow-hidden" id="services">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10 mb-8 lg:mb-12">
          <div className="text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-foreground text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3 h-3 text-primary fill-primary" /> Our Programs
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-foreground tracking-tight mb-3 lg:mb-4">
              Academic Excellence
              <br />
              <span className="text-primary">For Every Student</span>
            </h2>
          </div>
          <div className="w-full lg:w-80 lg:shrink-0">
            <QuestionOfTheDay />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const theme = themeConfig[service.color];
            return (
              <article
                key={service.id}
                onClick={() => setSelectedService(service)}
                tabIndex={0}
                role="button"
                className={`group cursor-pointer relative p-5 sm:p-6 rounded-xl border-2 bg-card transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${theme.card}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${theme.iconBg}`}>
                    {service.icon}
                  </div>
                </div>
                <h3 className="font-bold text-foreground mb-2 text-base sm:text-lg group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-xs sm:text-sm line-clamp-3">
                  {service.description}
                </p>
                <FeatureList features={service.features} checkClass={theme.check} />
                <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                  <span>​More</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Sheet open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 h-[100dvh] flex flex-col">
          {selectedService && (
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-6 sm:p-8">
                <SheetHeader className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center ${themeConfig[selectedService.color].iconBg}`}
                    >
                      {React.cloneElement(selectedService.icon, { className: "w-7 h-7" })}
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
                  className={`w-full py-6 text-base font-bold ${themeConfig[selectedService.color].button} text-white`}
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
