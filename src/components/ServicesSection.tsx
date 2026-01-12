import React from "react";
import { BookOpen, CheckCircle2, Globe, Sigma, Sparkles, ArrowRight } from "lucide-react";

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
const services: Service[] = [{
  id: "math",
  icon: <Sigma className="w-6 h-6" />,
  title: "Math Mastery",
  description: 'From basic arithmetic to middle school algebra. We turn "I can\'t" into "I solved it!" using visual aids and real-world examples.',
  color: "blue",
  features: ["Elementary → Middle School", "Homework Help", "Test Prep"]
}, {
  id: "english",
  icon: <BookOpen className="w-6 h-6" />,
  title: "Reading & English",
  description: "Unlocking the magic of stories. We focus on phonics, comprehension, and creative writing to build lifelong readers.",
  color: "purple",
  features: ["Reading Comprehension", "Essay Writing", "Vocabulary"]
}, {
  id: "social",
  icon: <Globe className="w-6 h-6" />,
  title: "Social Studies",
  description: "Exploring history, geography, and civics. Understanding our world and the people who shaped it.",
  color: "green",
  features: ["History & Geography", "Current Events", "Critical Thinking"]
}];

// --- Theme Configuration (3D Style) ---
// We use hard shadows and borders to create the pop effect.
const themeConfig = {
  blue: {
    card: "border-blue-900 shadow-[8px_8px_0px_0px_#1e3a8a] hover:shadow-[4px_4px_0px_0px_#1e3a8a]",
    iconBg: "bg-blue-100 text-blue-900 border-2 border-blue-900",
    check: "text-blue-700",
    badge: "bg-blue-100 text-blue-900 border-blue-900"
  },
  purple: {
    card: "border-purple-900 shadow-[8px_8px_0px_0px_#581c87] hover:shadow-[4px_4px_0px_0px_#581c87]",
    iconBg: "bg-purple-100 text-purple-900 border-2 border-purple-900",
    check: "text-purple-700",
    badge: "bg-purple-100 text-purple-900 border-purple-900"
  },
  green: {
    card: "border-green-900 shadow-[8px_8px_0px_0px_#14532d] hover:shadow-[4px_4px_0px_0px_#14532d]",
    iconBg: "bg-green-100 text-green-900 border-2 border-green-900",
    check: "text-green-700",
    badge: "bg-green-100 text-green-900 border-green-900"
  }
};

// --- Main Component ---

const ServicesSection = () => {
  return <section id="services" className="py-16 sm:py-24 bg-[#fffdf5] relative overflow-hidden font-sans">
      {/* Background Decor: A simple grid pattern adds to the technical/academic feel */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
      backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-slate-900 text-slate-900 text-xs font-bold uppercase tracking-wider mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-3 h-3 text-orange-500 fill-orange-500" />
            Our Programs
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Academic Excellence
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">
              For Every Student
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed font-medium sm:text-lg">
            We provide patient, age-appropriate guidance in a focused learning
            environment designed to build <span className="underline decoration-wavy decoration-orange-400 decoration-2">confidence</span> and mastery.
          </p>
          
          {/* Instructive value: Visualizing the educational goals */}
          
        </div>

        {/* 3D Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {services.map(service => {
          const theme = themeConfig[service.color];
          return <article key={service.id} className={`
                  group relative p-8 rounded-2xl border-2 bg-white 
                  transition-all duration-200 ease-out
                  hover:translate-x-[4px] hover:translate-y-[4px]
                  ${theme.card}
                `}>
                {/* Header: Icon & Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${theme.iconBg}`}>
                    {service.icon}
                  </div>
                  {/* Decorative corner tag */}
                  <div className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${theme.badge}`}>
                    Grades K-8
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-extrabold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors text-xl">
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed font-medium text-xs">
                  {service.description}
                </p>

                {/* Divider */}
                <div className="h-0.5 w-full bg-slate-100 mb-6" />

                {/* Features List */}
                <ul className="space-y-3">
                  {service.features.map((feature, i) => <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${theme.check}`} />
                      <span className="font-bold text-slate-700 text-xs">
                        {feature}
                      </span>
                    </li>)}
                </ul>

                {/* Hover Call to Action Indicator */}
                <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>
              </article>;
        })}
        </div>
      </div>
    </section>;
};
export default ServicesSection;