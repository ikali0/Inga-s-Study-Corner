import React, { useState } from "react";
import { BookOpen, CheckCircle2, Globe, Sigma, Sparkles, FlaskConical, ArrowRight } from "lucide-react";
import QuestionOfTheDay from "./QuestionOfTheDay";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Types & Data ---
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
const services: Service[] = [{
  id: "math",
  icon: <Sigma className="h-[12px] w-[12px]" />,
  title: "Math Mastery",
  description: 'From basic arithmetic to middle school algebra. We turn "I can\'t" into "I solved it!" using visual aids and real-world examples.',
  color: "blue",
  features: ["Elementary → Middle School", "Homework Help", "Test Prep"],
  longDescription: "Our Math Mastery program builds strong foundations from counting and number sense all the way through pre-algebra. We use visual manipulatives, real-world problems, and confidence-building techniques to help students truly understand—not just memorize.",
  detailedFeatures: [{
    title: "K-2 Focus",
    items: ["Number sense and counting strategies", "Addition & subtraction fluency", "Introduction to place value", "Basic geometry and patterns"]
  }, {
    title: "3-5 Focus",
    items: ["Multiplication & division mastery", "Fractions, decimals, and percentages", "Multi-step word problems", "Area, perimeter, and volume"]
  }, {
    title: "6-8 Focus",
    items: ["Pre-algebra and variable expressions", "Ratios, proportions, and rates", "Geometry and coordinate planes", "Data analysis and statistics"]
  }],
  approach: "We use the 'I Do, We Do, You Do' method combined with visual learning tools like number lines, fraction tiles, and graph paper to make abstract concepts concrete.",
  outcomes: ["Master grade-level math facts with 90%+ accuracy", "Solve multi-step word problems independently", "Build confidence to ask questions in class"]
}, {
  id: "english",
  icon: <BookOpen className="w-[12px] h-[12px]" />,
  title: "Reading & English",
  description: "Unlocking the magic of stories. We focus on phonics, comprehension, and creative writing to build lifelong readers.",
  color: "purple",
  features: ["Reading Comprehension", "Essay Writing", "Vocabulary"],
  longDescription: "From learning to read to reading to learn—our English program supports the full journey. We build fluent readers and confident writers through phonics, comprehension strategies, and engaging texts matched to each student's level and interests.",
  detailedFeatures: [{
    title: "K-2 Focus",
    items: ["Phonics and letter-sound relationships", "Sight word mastery", "Blending and decoding strategies", "Early comprehension skills"]
  }, {
    title: "3-5 Focus",
    items: ["Main idea and supporting details", "Paragraph structure and organization", "Vocabulary in context", "Narrative and expository writing"]
  }, {
    title: "6-8 Focus",
    items: ["Literary analysis and theme identification", "Argumentative essay writing", "Advanced grammar and mechanics", "Research skills and citation"]
  }],
  approach: "We use graphic organizers, highlight-coding, and story maps to help students visualize text structure. Every session includes both reading and writing practice.",
  outcomes: ["Read grade-level texts with fluency and comprehension", "Write organized paragraphs with clear topic sentences", "Expand vocabulary by 20+ words per month"]
}, {
  id: "social",
  icon: <Globe className="w-[12px] h-[12px]" />,
  title: "Social Studies",
  description: "Exploring history, geography, and civics. Understanding our world and the people who shaped it.",
  color: "green",
  features: ["History & Geography", "Current Events", "Critical Thinking"],
  longDescription: "Social Studies isn't just about memorizing dates—it's about understanding how the world works. We explore history, geography, civics, and current events through inquiry-based learning that connects the past to the present.",
  detailedFeatures: [{
    title: "K-2 Focus",
    items: ["Community helpers and local government", "Map skills and basic geography", "Holidays and cultural traditions", "Rules and responsibilities"]
  }, {
    title: "3-5 Focus",
    items: ["U.S. history and early civilizations", "States, capitals, and regions", "Primary source introduction", "Government structure basics"]
  }, {
    title: "6-8 Focus",
    items: ["World history and ancient civilizations", "Document analysis and research skills", "Civics and constitutional principles", "Current events and media literacy"]
  }],
  approach: "We use timelines, maps, primary sources, and discussion-based learning to help students think like historians and engaged citizens.",
  outcomes: ["Analyze primary sources and form evidence-based opinions", "Understand how local and federal government works", "Connect historical events to modern issues"]
}, {
  id: "science",
  icon: <FlaskConical className="w-[12px] h-[12px]" />,
  title: "Science & STEM",
  description: "Fostering curiosity through the scientific method. From life cycles to simple machines and coding basics.",
  color: "orange",
  features: ["Scientific Method", "Hands-on Labs", "Digital Literacy"],
  longDescription: "Our STEM program focuses on inquiry-based learning. We don't just memorize facts—we ask 'why' and 'how'. Students engage in virtual labs and hands-on experiments that make abstract concepts tangible and spark lifelong curiosity.",
  detailedFeatures: [{
    title: "Life Science",
    items: ["Ecosystems and food chains", "Human body systems", "Plant and animal life cycles", "Cells and organisms"]
  }, {
    title: "Physical Science",
    items: ["Matter, energy, and states", "Forces, motion, and simple machines", "Sound, light, and electricity", "Chemical reactions (safe demos)"]
  }, {
    title: "Earth & Space",
    items: ["Solar system and astronomy", "Weather patterns and climate", "Geology and natural resources", "Environmental science"]
  }, {
    title: "Digital Literacy",
    items: ["Block-based coding (Scratch)", "Logical sequencing and algorithms", "Intro to robotics thinking", "Science fair project support"]
  }],
  approach: "The Scientific Method guides every lesson: observe, hypothesize, test, and conclude. Students keep lab notebooks and present their findings.",
  outcomes: ["Design and conduct simple experiments independently", "Use scientific vocabulary accurately", "Apply coding logic to solve problems"]
}];

// --- Theme Configuration ---
const themeConfig = {
  blue: {
    card: "border-blue/30 hover:border-blue/50 hover:shadow-lg hover:shadow-blue/10",
    iconBg: "bg-blue/10 text-blue",
    check: "text-blue",
    badge: "bg-blue/10 text-blue",
    button: "bg-blue hover:bg-blue/90"
  },
  purple: {
    card: "border-purple/30 hover:border-purple/50 hover:shadow-lg hover:shadow-purple/10",
    iconBg: "bg-purple/10 text-purple",
    check: "text-purple",
    badge: "bg-purple/10 text-purple",
    button: "bg-purple hover:bg-purple/90"
  },
  green: {
    card: "border-green/30 hover:border-green/50 hover:shadow-lg hover:shadow-green/10",
    iconBg: "bg-green/10 text-green",
    check: "text-green",
    badge: "bg-green/10 text-green",
    button: "bg-green hover:bg-green/90"
  },
  orange: {
    card: "border-orange/30 hover:border-orange/50 hover:shadow-lg hover:shadow-orange/10",
    iconBg: "bg-orange/10 text-orange",
    check: "text-orange",
    badge: "bg-orange/10 text-orange",
    button: "bg-orange hover:bg-orange/90"
  }
};
const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const handleBooking = () => {
    setSelectedService(null);
    document.getElementById('booking')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section id="services" className="py-10 sm:py-16 md:py-20 bg-muted/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02]" style={{
      backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
      backgroundSize: "24px 24px"
    }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header + Quiz Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10 mb-8 lg:mb-12">
          {/* Header */}
          <div className="text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card border border-border text-foreground text-xs font-bold uppercase tracking-wider mb-4 shadow-sm rounded-sm">
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
              </span>.
            </p>
          </div>

          {/* Daily Quiz */}
          <div className="w-full lg:w-80 lg:shrink-0">
            <QuestionOfTheDay />
          </div>
        </div>

        {/* Service Cards - Now 2x2 grid on larger screens */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {services.map(service => {
          const theme = themeConfig[service.color];
          return <article key={service.id} onClick={() => setSelectedService(service)} className={`group cursor-pointer relative p-5 sm:p-6 rounded-xl border-2 bg-card transition-all duration-200 ${theme.card}`}>
                {/* Header */}
                <div className="flex justify-between items-start mb-1.5">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${theme.iconBg}`}>
                    {service.icon}
                  </div>
                  
                </div>

                {/* Content */}
                <h3 className="font-bold text-foreground mb-2 text-base group-hover:text-primary transition-colors sm:text-base">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-3leading-relaxed text-xs line-clamp-3 xsm:text-xs bg-transparent">
                  {service.description}
                </p>

                {/* Divider */}
                <div className="h-px w-full bg-border mb-4" />

                {/* Features */}
                <ul className="space-y-2 mb-2 border-pink-600 border-solid border">
                  {service.features.map((feature, i) => <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${theme.check}`} />
                      <span className="font-medium text-foreground text-xs sm:text-xs">{feature}</span>
                    </li>)}
                </ul>

                {/* Learn More CTA */}
                <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                  <span className="text-xs my-[2px] mx-[2px]">​More  </span>
                  <ArrowRight className="w-[10px] h-[10px] my-[2px]" />
                </div>
              </article>;
        })}
        </div>
      </div>

      {/* --- DETAIL SHEET --- */}
      <Sheet open={!!selectedService} onOpenChange={open => !open && setSelectedService(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          {selectedService && <ScrollArea className="h-full">
              <div className="p-6 sm:p-8">
                <SheetHeader className="mb-6">
                  {/* Icon & Badge */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${themeConfig[selectedService.color].iconBg}`}>
                      {React.cloneElement(selectedService.icon as React.ReactElement, {
                    className: "w-7 h-7"
                  })}
                    </div>
                    <div className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${themeConfig[selectedService.color].badge}`}>
                      Grades K-8
                    </div>
                  </div>

                  <SheetTitle className="text-2xl font-bold text-foreground">
                    {selectedService.title}
                  </SheetTitle>
                  <SheetDescription className="text-muted-foreground leading-relaxed">
                    {selectedService.longDescription}
                  </SheetDescription>
                </SheetHeader>

                {/* Our Approach */}
                <section className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Our Approach
                  </h4>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-foreground leading-relaxed">
                      {selectedService.approach}
                    </p>
                  </div>
                </section>

                {/* Detailed Features by Level */}
                <section className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    What We Cover
                  </h4>
                  <div className="space-y-4">
                    {selectedService.detailedFeatures.map((section, idx) => <div key={idx} className="p-4 rounded-lg bg-card border border-border">
                        <h5 className={`font-bold text-sm mb-3 ${themeConfig[selectedService.color].check}`}>
                          {section.title}
                        </h5>
                        <ul className="space-y-2">
                          {section.items.map((item, i) => <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${themeConfig[selectedService.color].check}`} />
                              <span className="text-sm text-foreground">{item}</span>
                            </li>)}
                        </ul>
                      </div>)}
                  </div>
                </section>

                {/* Learning Outcomes */}
                <section className="mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Expected Outcomes
                  </h4>
                  <ul className="space-y-3">
                    {selectedService.outcomes.map((outcome, i) => <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{i + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{outcome}</span>
                      </li>)}
                  </ul>
                </section>

                {/* CTA Button */}
                <Button onClick={handleBooking} className={`w-full py-6 text-base font-bold ${themeConfig[selectedService.color].button} text-primary-foreground`}>
                  Book a Trial Session
                </Button>
              </div>
            </ScrollArea>}
        </SheetContent>
      </Sheet>
    </section>;
};
export default ServicesSection;