import React, { useState, forwardRef } from "react";
import { Sigma, BookOpen, Globe, FlaskConical, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import QuestionOfTheDay from "./QuestionOfTheDay";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { FlippingCard } from "./ui/flipping-card";

type ThemeColor = "blue" | "purple" | "green" | "orange";

interface Service {
  id: string;
  icon: React.ReactElement;
  title: string;
  shortTitle: string;
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
    card: "border-blue/30",
    iconBg: "bg-blue/10 text-blue",
    check: "text-blue",
    badge: "bg-blue/10 text-blue",
    button: "bg-blue hover:bg-blue/90",
    gradient: "from-blue/20 to-blue/5",
  },
  purple: {
    card: "border-purple/30",
    iconBg: "bg-purple/10 text-purple",
    check: "text-purple",
    badge: "bg-purple/10 text-purple",
    button: "bg-purple hover:bg-purple/90",
    gradient: "from-purple/20 to-purple/5",
  },
  green: {
    card: "border-green/30",
    iconBg: "bg-green/10 text-green",
    check: "text-green",
    badge: "bg-green/10 text-green",
    button: "bg-green hover:bg-green/90",
    gradient: "from-green/20 to-green/5",
  },
  orange: {
    card: "border-orange/30",
    iconBg: "bg-orange/10 text-orange",
    check: "text-orange",
    badge: "bg-orange/10 text-orange",
    button: "bg-orange hover:bg-orange/90",
    gradient: "from-orange/20 to-orange/5",
  },
};

const services: Service[] = [
  {
    id: "math",
    icon: <Sigma className="w-6 h-6" />,
    title: "Math Mastery",
    shortTitle: "Math",
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
    icon: <BookOpen className="w-6 h-6" />,
    title: "Reading & English",
    shortTitle: "English",
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
    icon: <Globe className="w-6 h-6" />,
    title: "Social Studies",
    shortTitle: "Social",
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
    icon: <FlaskConical className="w-6 h-6" />,
    title: "Science & STEM",
    shortTitle: "Science",
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

// --- Card Front Content ---
interface CardFrontProps {
  service: Service;
  theme: typeof themeConfig.blue;
}

const CardFront = ({ service, theme }: CardFrontProps) => (
  <div className="flex flex-col h-full p-3 sm:p-4">
    {/* Header with icon */}
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center ${theme.iconBg} shrink-0`}>
        {React.cloneElement(service.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
      </div>
      <span className={`px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase rounded-sm ${theme.badge}`}>
        K-8
      </span>
    </div>
    
    {/* Title & Description */}
    <h3 className="font-display font-bold text-foreground text-sm sm:text-base mb-1 leading-tight line-clamp-1">
      {service.shortTitle}
    </h3>
    <p className="font-body text-muted-foreground text-[10px] sm:text-xs leading-snug mb-2 line-clamp-2">
      {service.description}
    </p>
    
    {/* Features */}
    <ul className="space-y-0.5 sm:space-y-1 mb-2 flex-grow min-h-0 overflow-hidden">
      {service.features.slice(0, 3).map((f, i) => (
        <li key={i} className="flex items-center gap-1.5">
          <CheckCircle2 className={`w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 ${theme.check}`} />
          <span className="font-body text-foreground text-[9px] sm:text-[11px] font-medium truncate">{f}</span>
        </li>
      ))}
    </ul>
    
    {/* Learn more hint - desktop only */}
    <div className="hidden sm:flex items-center justify-center gap-1 text-[10px] text-muted-foreground mt-auto pt-1.5 border-t border-border/50">
      <span className="font-body">Hover for more</span>
      <ArrowRight className="w-2.5 h-2.5" />
    </div>
  </div>
);

// --- Card Back Content ---
interface CardBackProps {
  service: Service;
  theme: typeof themeConfig.blue;
  onLearnMore: () => void;
}

const CardBack = ({ service, theme, onLearnMore }: CardBackProps) => (
  <div className={`flex flex-col items-center justify-center h-full p-3 sm:p-4 bg-gradient-to-br ${theme.gradient}`}>
    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center ${theme.iconBg} mb-2`}>
      {React.cloneElement(service.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
    </div>
    
    <h4 className="font-display font-bold text-foreground text-center mb-1.5 text-sm sm:text-base line-clamp-1">
      {service.shortTitle}
    </h4>
    
    <p className="font-body text-muted-foreground text-[9px] sm:text-[11px] text-center leading-snug mb-2 line-clamp-2 px-1">
      {service.longDescription}
    </p>
    
    <div className="text-center mb-2 hidden sm:block">
      <p className="font-display text-[9px] sm:text-[10px] font-semibold text-foreground mb-0.5">Our Approach:</p>
      <p className="font-body text-[9px] sm:text-[10px] text-muted-foreground line-clamp-2 px-1">{service.approach}</p>
    </div>
    
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onLearnMore();
      }}
      className={`${theme.button} text-primary-foreground font-display font-bold text-[10px] sm:text-xs px-3 py-1 h-6 sm:h-7 rounded-sm`}
    >
      View Details
    </Button>
  </div>
);

// --- Detailed Features (Sheet) ---
const DetailedFeatures = ({ sections, checkClass }: { sections: Service["detailedFeatures"]; checkClass: string }) => (
  <div className="space-y-3 sm:space-y-4">
    {sections.map((section, idx) => (
      <div key={idx} className="p-3 sm:p-4 rounded-lg bg-card border border-border">
        <h5 className={`font-bold text-xs sm:text-sm mb-2 sm:mb-3 ${checkClass}`}>{section.title}</h5>
        <ul className="space-y-1.5 sm:space-y-2">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5 ${checkClass}`} />
              <span className="text-xs sm:text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const OutcomesList = ({ outcomes }: { outcomes: string[] }) => (
  <ul className="space-y-2 sm:space-y-3">
    {outcomes.map((outcome, i) => (
      <li key={i} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-primary/5 border border-primary/20">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[10px] sm:text-xs font-bold text-primary">{i + 1}</span>
        </div>
        <span className="text-xs sm:text-sm font-medium text-foreground">{outcome}</span>
      </li>
    ))}
  </ul>
);

// --- Main Component ---
const ServicesSection = forwardRef<HTMLElement>((_, ref) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [gradientPhase, setGradientPhase] = useState(0);

  // Animated gradient effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setGradientPhase((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const gradientClasses = [
    "from-primary/10 via-blue/5 to-purple/10",
    "from-purple/10 via-primary/5 to-orange/10",
    "from-orange/10 via-green/5 to-blue/10",
    "from-blue/10 via-purple/5 to-primary/10",
  ];

  const handleBooking = () => {
    setSelectedService(null);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden" id="services">
      {/* Animated gradient background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradientPhase]} transition-all duration-[2000ms] ease-in-out`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 sm:w-64 sm:h-64 bg-purple/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Centered with quiz below on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8 lg:gap-16 mb-8 sm:mb-10 lg:mb-14">
          {/* Title section - Always centered on mobile */}
          <div className="text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 text-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5 shadow-lg">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary fill-primary" /> 
              Our Programs
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
              Academic Excellence
              <br />
              <span className="text-primary bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
                For Every Student
              </span>
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-md mx-auto lg:mx-0">
              Personalized learning paths designed to unlock your child's full potential.
            </p>
          </div>
          
          {/* Quiz section - Centered on mobile, right-aligned on desktop */}
          <div className="w-full max-w-sm lg:w-[340px] lg:shrink-0 mx-auto lg:mx-0">
            <QuestionOfTheDay />
          </div>
        </div>

        {/* Flipping Cards Grid - Responsive: 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {services.map((service) => {
            const theme = themeConfig[service.color];
            return (
              <FlippingCard
                key={service.id}
                className={`${theme.card} shadow-lg hover:shadow-xl transition-shadow duration-300`}
                frontContent={<CardFront service={service} theme={theme} />}
                backContent={
                  <CardBack
                    service={service}
                    theme={theme}
                    onLearnMore={() => setSelectedService(service)}
                  />
                }
              />
            );
          })}
        </div>
        
      </div>

      {/* Detail Sheet - Full width on mobile */}
      <Sheet open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 h-[100dvh] flex flex-col">
          {selectedService && (
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 md:p-8">
                <SheetHeader className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div
                      className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${themeConfig[selectedService.color].iconBg}`}
                    >
                      {React.cloneElement(selectedService.icon, { className: "w-5 h-5 sm:w-7 sm:h-7" })}
                    </div>
                    <div
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase rounded-full ${themeConfig[selectedService.color].badge}`}
                    >
                      Grades K-8
                    </div>
                  </div>
                  <SheetTitle className="text-xl sm:text-2xl font-bold text-foreground">{selectedService.title}</SheetTitle>
                  <SheetDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {selectedService.longDescription}
                  </SheetDescription>
                </SheetHeader>

                <section className="mb-4 sm:mb-6">
                  <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 sm:mb-3">
                    Our Approach
                  </h4>
                  <div className="p-3 sm:p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">{selectedService.approach}</p>
                  </div>
                </section>

                <section className="mb-4 sm:mb-6">
                  <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
                    What We Cover
                  </h4>
                  <DetailedFeatures
                    sections={selectedService.detailedFeatures}
                    checkClass={themeConfig[selectedService.color].check}
                  />
                </section>

                <section className="mb-6 sm:mb-8">
                  <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
                    Expected Outcomes
                  </h4>
                  <OutcomesList outcomes={selectedService.outcomes} />
                </section>

                <Button
                  onClick={handleBooking}
                  className={`w-full py-5 sm:py-6 text-sm sm:text-base font-bold ${themeConfig[selectedService.color].button} text-primary-foreground`}
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
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;
