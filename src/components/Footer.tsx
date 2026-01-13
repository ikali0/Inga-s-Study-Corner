import { forwardRef } from "react";
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
const Footer = forwardRef<HTMLElement, FooterProps>(({
  onNavigate
}, ref) => {
  return <footer ref={ref} className="relative z-10 overflow-hidden py-6 sm:py-8 md:py-10 bg-muted/60 lg:py-[40px]">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-pink" aria-hidden="true" />

      {/* Main Footer Content - 3D Card Effect */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 p-4 sm:p-5 md:p-6 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transform-gpu hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300 bg-white" style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}>
          {/* Brand & Mission */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-sm sm:text-base mb-2 flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <Rocket className="text-primary w-4 h-4" />
              </div>
              <span className="text-foreground">Inga's Study Corner</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-2 sm:mb-3 text-[11px] sm:text-xs">
              More than just tutoring. We build the confidence and skills your child
              needs to thrive in school and beyond.
            </p>
            
          </div>

          {/* Parent Trust Column - 3D Inner Card */}
          <div className="
              bg-accent/20 
              p-3 sm:p-4 
              rounded-lg sm:rounded-xl 
              border border-accent/30
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]
              transform-gpu hover:scale-[1.02]
              transition-transform duration-200
            ">
            <h4 className="font-bold mb-2 sm:mb-3 text-xs sm:text-sm text-foreground">
              Parent Peace of Mind
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="bg-green/20 p-1 rounded-md">
                  <ShieldCheck className="text-green w-3 h-3" />
                </div>
                <span className="text-muted-foreground text-[10px] sm:text-xs">
                  Safe & Vetted Environment
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-blue/20 p-1 rounded-md">
                  <GraduationCap className="text-blue w-3 h-3" />
                </div>
                <span className="text-muted-foreground text-[10px] sm:text-xs">
                  Patient, Expert Guidance
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-purple/20 p-1 rounded-md">
                  <Clock className="text-purple w-3 h-3" />
                </div>
                <span className="text-muted-foreground text-[10px] sm:text-xs">
                  Flexible After-School Hours
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info - 3D Inner Card */}
          <div id="contact" className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold mb-2 sm:mb-3 text-xs sm:text-sm text-foreground">
              Get in Touch
            </h4>
            <address className="
                not-italic 
                p-3 sm:p-4 
                rounded-lg sm:rounded-xl 
                space-y-2 sm:space-y-2.5
                bg-primary/5 
                border border-primary/15
                shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                transform-gpu
              ">
              <a href={`mailto:${tutorInfo.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                <div className="bg-pink/20 p-1.5 rounded-md group-hover:bg-pink/30 transition-colors">
                  <Mail size={12} className="text-pink" />
                </div>
                <span className="break-all text-[10px] sm:text-xs">{tutorInfo.email}</span>
              </a>
              <a href={`tel:${tutorInfo.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                <div className="bg-green/20 p-1.5 rounded-md group-hover:bg-green/30 transition-colors">
                  <Phone size={12} className="text-green" />
                </div>
                <span className="text-[10px] sm:text-xs">{tutorInfo.phone}</span>
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <div className="bg-blue/20 p-1.5 rounded-md shrink-0">
                  <MapPin size={12} className="text-blue" />
                </div>
                <div className="text-[10px] sm:text-xs leading-relaxed">
                  <span className="font-medium text-foreground">{tutorInfo.location}</span>
                  <br />
                  <span className="text-muted-foreground/80">
                    {tutorInfo.address}
                  </span>
                </div>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 mt-4 sm:mt-6 md:mt-8 pt-3 sm:pt-4 border-t border-border/50 text-center">
        <p className="text-[9px] sm:text-[10px] md:text-xs text-foreground/70">
          &copy; {new Date().getFullYear()} Inga's Study Corner. Passionately
          teaching since 2018. ✨
        </p>
      </div>
    </footer>;
});
Footer.displayName = "Footer";
export default Footer;