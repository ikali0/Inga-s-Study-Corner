import React from "react";
import { BookOpen, CheckCircle2, Globe, Sigma, Sparkles } from "lucide-react";

// --- Types & Data ---

type ThemeColor = "blue" | "purple" | "green";
interface Service {
  id: string; // Added ID for better React keys
  icon: React.ReactNode;
  title: string;
  description: string;
  color: ThemeColor;
  features: string[];
}
const services: Service[] = [{
  id: "math",
  // Fixed: Swapped text character for Lucide icon for visual consistency
  icon: <Sigma className="w-6 h-6 sm:h-[20px] sm:w-[20px]" />,
  title: "Math Mastery",
  description: 'From basic arithmetic to middle school algebra. We turn "I can\'t" into "I solved it!" using visual aids and real-world examples.',
  color: "blue",
  features: ["Elementary → Middle School", "Homework Help", "Test Prep"]
}, {
  id: "english",
  icon: <BookOpen className="w-6 h-6 sm:h-[20px] sm:w-[20px]" />,
  title: "Reading & English",
  description: "Unlocking the magic of stories. We focus on phonics, comprehension, and creative writing to build lifelong readers.",
  color: "purple",
  features: ["Reading Comprehension", "Essay Writing", "Vocabulary"]
}, {
  id: "social",
  icon: <Globe className="w-6 h-6 sm:h-[20px] sm:w-[20px]" />,
  title: "Social Studies",
  description: "Exploring history, geography, and civics. Understanding our world and the people who shaped it.",
  color: "green",
  features: ["History & Geography", "Current Events", "Critical Thinking"]
}];

// --- Theme Configuration ---
// Fixed: Used standard Tailwind shades (50, 100, 500, 600) to guarantee rendering
const themeStyles: Record<ThemeColor, string> = {
  blue: "bg-blue-50 border-blue-100 text-blue-900 group-hover:border-blue-300",
  purple: "bg-purple-50 border-purple-100 text-purple-900 group-hover:border-purple-300",
  green: "bg-green-50 border-green-100 text-green-900 group-hover:border-green-300"
};
const iconStyles: Record<ThemeColor, string> = {
  blue: "bg-blue-500 text-white shadow-blue-200",
  purple: "bg-purple-500 text-white shadow-purple-200",
  green: "bg-green-500 text-white shadow-green-200"
};
const featureStyles: Record<ThemeColor, string> = {
  blue: "text-blue-600",
  purple: "text-purple-600",
  green: "text-green-600"
};

// --- Main Component ---

const ServicesSection = () => {
  return <section id="services" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      {/* Background Decor (Optional Subtle Gradient) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3 h-3 text-orange-500 fill-orange-500" />
            Our Programs
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Academic Excellence for Every Student
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We provide patient, age-appropriate guidance in a focused learning
            environment designed to build confidence and mastery.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => {
          const cardTheme = themeStyles[service.color];
          const iconTheme = iconStyles[service.color];
          const checkTheme = featureStyles[service.color];
          return <article key={service.id} className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardTheme}`}>
                {/* Icon Box */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110 ${iconTheme}`}>
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {service.features.map((feature, i) => <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${checkTheme}`} />
                      <span className="text-sm font-medium text-slate-700">
                        {feature}
                      </span>
                    </li>)}
                </ul>
              </article>;
        })}
        </div>
        
        

      </div>
    </section>;
};
export default ServicesSection;