import { Rocket, ShieldCheck, GraduationCap, Clock, Mail, Phone, MapPin, Calendar } from "lucide-react";
interface FooterProps {
  onNavigate: (id: string) => void;
}
const tutorInfo = {
  email: "ingakaltak7@gmail.com",
  phone: "215-791-5906",
  address: "625 Red Lion Rd, Huntingdon Valley, PA 19006",
  location: "Huntington Valley Library"
};
const Footer = ({
  onNavigate
}: FooterProps) => {
  return <footer className="text-secondary-foreground relative z-10 overflow-hidden py-8 sm:py-10 md:py-12 lg:py-[40px] bg-purple-100">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-pink" aria-hidden="true" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 px-4 border-purple-600 bg-pink-400 sm:px-[14px] py-[14px] border-solid border rounded-sm shadow-sm opacity-85">
        {/* Brand & Mission */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
            <Rocket className="text-primary" size={20} />
            <span className="text-white">Inga's Study Corner</span>
          </h3>
          <p className="text-secondary-foreground/80 leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm">
            More than just tutoring. We build the confidence and skills your child
            needs to thrive in school and beyond.
          </p>
          <div className="flex items-center gap-2 text-secondary-foreground/70 border-blue-500 border border-dashed">
            <Calendar size={14} className="text-primary shrink-0" />
            <span className="text-xs sm:text-xs">Tue-Fri • 3:00-9:00 PM</span>
          </div>
        </div>

        {/* Parent Trust Column */}
        <div>
          <h4 className="font-bold mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base">
            Parent Peace of Mind
          </h4>
          <ul className="space-y-2 sm:space-y-3 border border-blue-500 border-dashed">
            <li className="flex items-start gap-2 sm:gap-3">
              <ShieldCheck className="text-green shrink-0" size={16} />
              <span className="text-secondary-foreground/80 text-xs sm:text-sm">
                Safe & Vetted Environment
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <GraduationCap className="text-blue shrink-0" size={16} />
              <span className="text-secondary-foreground/80 text-xs sm:text-sm">
                Patient, Expert Guidance
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Clock className="text-purple shrink-0" size={16} />
              <span className="text-secondary-foreground/80 text-xs sm:text-sm">
                Flexible After-School Hours
              </span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        

        {/* Contact Info */}
        <div id="contact">
          <h4 className="font-bold mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base">
            Get in Touch
          </h4>
          <address className="p-3 md:p-4 rounded-lg sm:rounded-xl space-y-2 sm:space-y-3 border not-italic border-blue-300 border-solid py-[10px] px-[10px] bg-orange-200">
            <a href={`mailto:${tutorInfo.email}`} className="flex items-center gap-2 sm:gap-3 text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
              <div className="bg-secondary p-1.5 sm:p-2 rounded-lg shrink-0">
                <Mail size={14} className="text-pink border-blue-300 border-solid border" />
              </div>
              <span className="break-all text-xs text-black sm:text-xs">{tutorInfo.email}</span>
            </a>
            <a href={`tel:${tutorInfo.phone}`} className="flex items-center gap-2 sm:gap-3 text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
              <div className="bg-secondary p-1.5 sm:p-2 rounded-lg shrink-0">
                <Phone size={14} className="text-green bg-orange-300 border-blue-200 border border-solid" />
              </div>
              <span className="text-xs text-black sm:text-xs">{tutorInfo.phone}</span>
            </a>
            
          </address>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8 md:mt-10 lg:mt-12 pt-4 sm:pt-6 md:pt-8 border-t border-secondary-foreground/10 text-center text-[10px] sm:text-xs text-purple-950">
        <p>
          &copy; {new Date().getFullYear()} Inga's Study Corner. Passionately
          teaching since 2018. ✨
        </p>
      </div>
    </footer>;
};
export default Footer;