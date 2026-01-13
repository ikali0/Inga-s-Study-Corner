import React from "react";
import { BookOpen, CheckCircle2, Globe, Sigma, Sparkles, ArrowRight } from "lucide-react";
import QuestionOfTheDay from "./QuestionOfTheDay";

// --- Types & Data ---
type ThemeColor = "blue" | "purple" | "green";

interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: ThemeColor;
  features: string[];
}

const services: Service[] = [
  {
    id: "math",
    icon: <Sigma className="w-5 h-5" />,
    title: "Math Mastery",
    description: 'From basic arithmetic to middle school algebra. We turn "I can\'t" into "I solved it!" using visual aids and real-world examples.',
    color: "blue",
    features: ["Elementary → Middle School", "Homework Help", "Test Prep"],
  },
  {
    id: "english",
    icon: <BookOpen className="w-5 h-5" />,
    title: "Reading & English",
    description: "Unlocking the magic of stories. We focus on phonics, comprehension, and creative writing to build lifelong readers.",
    color: "purple",
    features: ["Reading Comprehension", "Essay Writing", "Vocabulary"],
  },
  {
    id: "social",
    icon: <Globe className="w-5 h-5" />,
    title: "Social Studies",
    description: "Exploring history, geography, and civics. Understanding our world and the people who shaped it.",
    color: "green",
    features: ["History & Geography", "Current Events", "Critical Thinking"],
  },
];

// --- Theme Configuration ---
const themeConfig = {
  blue: {
    card: "border-blue/30 hover:border-blue/50 hover:shadow-lg hover:shadow-blue/10",
    iconBg: "bg-blue/10 text-blue",
    check: "text-blue",
    badge: "bg-blue/10 text-blue",
  },
  purple: {
    card: "border-purple/30 hover:border-purple/50 hover:shadow-lg hover:shadow-purple/10",
    iconBg: "bg-purple/10 text-purple",
    check: "text-purple",
    badge: "bg-purple/10 text-purple",
  },
  green: {
    card: "border-green/30 hover:border-green/50 hover:shadow-lg hover:shadow-green/10",
    iconBg: "bg-green/10 text-green",
    check: "text-green",
    badge: "bg-green/10 text-green",
  },
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-10 sm:py-16 md:py-20 bg-muted/30 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header + Quiz Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10 mb-8 lg:mb-12">
          {/* Header */}
          <div className="text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-foreground text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3 h-3 text-primary fill-primary" />
              Our Programs
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-3 lg:mb-4">
              Academic Excellence
              <br />
              <span className="text-primary">For Every Student</span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              Patient, age-appropriate guidance in a focused environment built for{" "}
              <span className="underline decoration-wavy decoration-primary/50 decoration-2 underline-offset-2">
                confidence
              </span>{" "}
              and mastery.
            </p>
          </div>

          {/* Daily Quiz */}
          <div className="w-full lg:w-80 lg:shrink-0">
            <QuestionOfTheDay />
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const theme = themeConfig[service.color];
            return (
              <article
                key={service.id}
                className={`group relative p-5 sm:p-6 rounded-xl border-2 bg-card transition-all duration-200 ${theme.card}`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${theme.iconBg}`}>
                    {service.icon}
                  </div>
                  <div className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${theme.badge}`}>
                    Grades K-8
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-foreground mb-2 text-base sm:text-lg group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-xs sm:text-sm">
                  {service.description}
                </p>

                {/* Divider */}
                <div className="h-px w-full bg-border mb-4" />

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${theme.check}`} />
                      <span className="font-medium text-foreground text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover indicator */}
                <div className="absolute bottom-5 right-5 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
