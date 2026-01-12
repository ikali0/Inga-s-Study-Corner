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
  return <footer className="text-secondary-foreground relative z-10 overflow-hidden py-8 sm:py-10 md:py-12 bg-lime-50 border-pink-500 border-solid border lg:py-[38px]">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-pink" aria-hidden="true" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 px-4 sm:px-0">
        {/* Brand & Mission */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
            <Rocket size={20} className="bg-orange-300 text-pink-600 border rounded-sm shadow-sm opacity-70 border-solid border-pink-600" />
            <span className="text-sm font-serif text-center font-semibold">Inga's Study Corner</span>
          </h3>
          <p className="text-secondary-foreground/80 leading-relaxed mb-3 sm:mb-4 text-xs sm:text-xs font-serif font-normal">
            More than just tutoring. We build the confidence and skills your child
            needs to thrive in school and beyond.
          </p>
          <div className="flex items-center gap-2 text-secondary-foreground/70">
            <Calendar size={14} className="shrink-0 text-purple-500 bg-blue-100 border-orange-300 border border-solid" />
            <span className="text-xs sm:text-xs font-medium text-pink-600 font-serif">Tue-Fri • 3:00-9:00 PM</span>
          </div>
        </div>

        {/* Parent Trust Column */}
        <div>
          
          <ul className="space-y-2 sm:space-y-3">
            <li className="flex items-start gap-2 sm:gap-3">
              <ShieldCheck className="text-green shrink-0" size={16} />
              <span className="text-secondary-foreground/80 text-xs sm:text-xs font-serif text-center">
                Safe & Vetted Environment
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <GraduationCap className="text-blue shrink-0" size={16} />
              <span className="text-secondary-foreground/80 text-xs sm:text-xs font-serif">
                Patient, Expert Guidance
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Clock className="text-purple shrink-0" size={16} />
              <span className="text-secondary-foreground/80 text-xs sm:text-xs font-serif text-right">
                Flexible After-School Hours
              </span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        

        {/* Contact Info */}
        <div id="contact">
          <h4 className="font-bold mb-2 sm:mb-3 md:mb-4 text-sm sm:text-sm">
            Get in Touch
          </h4>
          <address className="p-3 md:p-4 rounded-lg space-y-2 sm:space-y-3 border not-italic border-solid sm:rounded border-pink-500 sm-orange-100">
            <a href={`mailto:${tutorInfo.email}`} className="flex items-center gap-2 sm:gap-3 text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
              <div className="bg-secondary p-1.5 sm:p-2 shrink-0 rounded-sm">
                <Mail size={14} className="text-pink border-blue-300 border-solid border" />
              </div>
              <span className="break-all text-xs sm:text-xs">{tutorInfo.email}</span>
            </a>
            <a href={`tel:${tutorInfo.phone}`} className="flex items-center gap-2 sm:gap-3 text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
              <div className="bg-secondary p-1.5 sm:p-2 shrink-0 rounded-sm">
                <Phone size={14} className="text-green bg-orange-300 border-blue-200 border border-solid" />
              </div>
              <span className="text-xs sm:text-xs">{tutorInfo.phone}</span>
            </a>
            <div className="flex items-start gap-2 sm:gap-3 text-secondary-foreground/80">
              <div className="bg-secondary p-1.5 sm:p-2 rounded-lg shrink-0">
                <MapPin size={14} className="text-blue bg-lime-100 border-solid border-blue-200 border" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="text-xs">{tutorInfo.location}</span>
                <br />
                <span className="text-[10px] sm:text-xs text-secondary-foreground/60">
                  {tutorInfo.address}
                </span>
              </div>
            </div>
          </address>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8 md:mt-10 lg:mt-12 pt-4 sm:pt-6 md:pt-8 border-t border-secondary-foreground/10 text-center text-[10px] sm:text-xs text-secondary-foreground/60">
        <p className="text-orange-950 font-serif">
          &copy; {new Date().getFullYear()} Inga's Study Corner. Passionately
          teaching since 2018. ✨
        </p>
      </div>
    </footer>;
};
export default Footer;