import { BookOpen, CheckCircle, Globe } from "lucide-react";
const services = [
  {
    icon: <span className="font-bold text-2xl">∑</span>,
    title: "Math Mastery",
    description:
      'From basic arithmetic to middle school algebra. We turn "I can\'t" into "I solved it!" using visual aids and real-world examples.',
    color: "blue",
    features: ["Elementary → Middle School", "Homework Help", "Test Prep"],
  },
  {
    icon: <BookOpen size={24} />,
    title: "Reading & English",
    description:
      "Unlocking the magic of stories. We focus on phonics, comprehension, and creative writing to build lifelong readers.",
    color: "purple",
    features: ["Reading Comprehension", "Essay Writing", "Vocabulary"],
  },
  {
    icon: <Globe size={24} />,
    title: "Social Studies",
    description:
      "Exploring history, geography, and civics. Understanding our world and the people who shaped it.",
    color: "green",
    features: ["History & Geography", "Current Events", "Critical Thinking"],
  },
];
const colorClasses = {
  blue: {
    bg: "bg-blue",
    light: "bg-blue-light",
    border: "border-blue-light",
    check: "text-blue",
  },
  purple: {
    bg: "bg-purple",
    light: "bg-purple-light",
    border: "border-purple-light",
    check: "text-purple",
  },
  green: {
    bg: "bg-green",
    light: "bg-green-light",
    border: "border-green-light",
    check: "text-green",
  },
};
const ServicesSection = () => {
  return (
    <section id="services" className="py-16 md:py-20 bg-card/50 backdrop-blur-sm relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What We Offer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Math • Physics • Chemistry • Engineering • English — Patient, age-appropriate guidance in a small-group,
            focused learning environment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => {
            const colors = colorClasses[service.color as keyof typeof colorClasses];
            return (
              <div
                key={index}
                className={`card-hover bg-card p-6 md:p-8 rounded-3xl border-2 ${colors.border} shadow-lg relative overflow-hidden group`}
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 ${colors.light} rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`}
                />
                <div className="relative z-10">
                  <div
                    className={`${colors.bg} w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 text-primary-foreground shadow-lg`}
                  >
                    {service.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 text-sm">{service.description}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle size={14} className={colors.check} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default ServicesSection;
