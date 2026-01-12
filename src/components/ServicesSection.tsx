import { BookOpen, CheckCircle, Globe } from "lucide-react";
interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "purple" | "green";
  features: string[];
}
const services: Service[] = [{
  icon: <span className="font-bold text-xl sm:text-2xl">∑</span>,
  title: "Math Mastery",
  description: 'From basic arithmetic to middle school algebra. We turn "I can\'t" into "I solved it!" using visual aids and real-world examples.',
  color: "blue",
  features: ["Elementary → Middle School", "Homework Help", "Test Prep"]
}, {
  icon: <BookOpen size={22} />,
  title: "Reading & English",
  description: "Unlocking the magic of stories. We focus on phonics, comprehension, and creative writing to build lifelong readers.",
  color: "purple",
  features: ["Reading Comprehension", "Essay Writing", "Vocabulary"]
}, {
  icon: <Globe size={22} />,
  title: "Social Studies",
  description: "Exploring history, geography, and civics. Understanding our world and the people who shaped it.",
  color: "green",
  features: ["History & Geography", "Current Events", "Critical Thinking"]
}];
const colorClasses = {
  blue: {
    bg: "bg-blue",
    light: "bg-blue-light",
    border: "border-blue-light",
    check: "text-blue"
  },
  purple: {
    bg: "bg-purple",
    light: "bg-purple-light",
    border: "border-purple-light",
    check: "text-purple"
  },
  green: {
    bg: "bg-green",
    light: "bg-green-light",
    border: "border-green-light",
    check: "text-green"
  }
} as const;
const ServicesSection = () => {
  return <section id="services" className="py-10 sm:py-12 md:py-16 lg:py-20 bg-card/50 backdrop-blur-sm relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
            What We Offer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
            Patient, age-appropriate guidance in a small-group, focused learning
            environment.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {services.map((service, index) => {
          const colors = colorClasses[service.color];
          return <article key={index} className={`card-hover bg-card p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl border-2 ${colors.border} shadow-lg relative overflow-hidden group`}>
                <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 ${colors.light} rounded-bl-[60px] sm:rounded-bl-[80px] md:rounded-bl-[100px] -mr-4 -mt-4 sm:-mr-6 sm:-mt-6 md:-mr-8 md:-mt-8 transition-transform group-hover:scale-150 duration-500`} aria-hidden="true" />
                <div className="decoration-lime-100">
                  <div className={`${colors.bg} w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-primary-foreground shadow-lg`}>
                    {service.icon}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-1.5 sm:mb-2 md:mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-xs sm:text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-1 sm:space-y-1.5 md:space-y-2 text-xs sm:text-sm text-muted-foreground">
                    {service.features.map((feature, i) => <li key={i} className="flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle size={12} className={`${colors.check} shrink-0`} />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                </div>
              </article>;
        })}
        </div>
      </div>
    </section>;
};
export default ServicesSection;