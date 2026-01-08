import { forwardRef } from 'react';
import { Rocket, ShieldCheck, GraduationCap, Clock, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface FooterProps {
  onNavigate: (id: string) => void;
}

const tutorInfo = {
  email: "ingakaltak7@gmail.com",
  phone: "215-791-5906",
  address: "625 Red Lion Rd, Huntingdon Valley, PA 19006",
  location: "Huntington Valley Library"
};

const Footer = forwardRef<HTMLElement, FooterProps>(({ onNavigate }, ref) => {
  return (
    <footer ref={ref} className="bg-secondary text-secondary-foreground relative z-10 overflow-hidden py-10 md:py-14">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-pink"></div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 px-4 sm:px-6">
        
        {/* Brand & Mission */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="font-bold text-lg md:text-xl mb-3 md:mb-4 flex items-center gap-2">
            <Rocket className="text-primary" size={22} />
            Inga's Study Corner
          </h3>
          <p className="text-secondary-foreground/80 leading-relaxed mb-4 text-sm">
            More than just tutoring. We build the confidence and skills your child needs to thrive in school and beyond.
          </p>
          <div className="flex items-center gap-2 text-sm text-secondary-foreground/70">
            <Calendar size={16} className="text-primary" />
            <span className="text-sm">Tue-Fri • 3:00-9:00 PM</span>
          </div>
        </div>

        {/* Parent Trust Column */}
        <div>
          <h4 className="font-bold mb-3 md:mb-4 text-base">Parent Peace of Mind</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <ShieldCheck className="text-green shrink-0" size={18} />
              <span className="text-secondary-foreground/80 text-sm">Safe & Vetted Environment</span>
            </li>
            <li className="flex items-start gap-3">
              <GraduationCap className="text-blue shrink-0" size={18} />
              <span className="text-secondary-foreground/80 text-sm">Patient, Expert Guidance</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="text-purple shrink-0" size={18} />
              <span className="text-secondary-foreground/80 text-sm">Flexible After-School Hours</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold mb-3 md:mb-4 text-base">Explore</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('services')} className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                Tutoring Services
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                Why Parents Love It
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('reviews')} className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                Parent Reviews
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('book')} className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                Book Consultation
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div id="contact">
          <h4 className="font-bold mb-3 md:mb-4 text-base">Get in Touch</h4>
          <div className="bg-secondary-foreground/5 p-3 md:p-4 rounded-xl space-y-3 border border-secondary-foreground/10">
            <a href={`mailto:${tutorInfo.email}`} className="flex items-center gap-3 text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
              <div className="bg-secondary p-2 rounded-lg"><Mail size={16} className="text-pink" /></div>
              <span className="break-all text-sm">{tutorInfo.email}</span>
            </a>
            <a href={`tel:${tutorInfo.phone}`} className="flex items-center gap-3 text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
              <div className="bg-secondary p-2 rounded-lg"><Phone size={16} className="text-green" /></div>
              <span className="text-sm">{tutorInfo.phone}</span>
            </a>
            <div className="flex items-start gap-3 text-secondary-foreground/80">
              <div className="bg-secondary p-2 rounded-lg shrink-0"><MapPin size={16} className="text-blue" /></div>
              <div className="text-sm">
                <span>{tutorInfo.location}</span>
                <br />
                <span className="text-xs text-secondary-foreground/60">{tutorInfo.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-secondary-foreground/10 text-center text-xs text-secondary-foreground/60">
        <p>&copy; {new Date().getFullYear()} Inga's Study Corner. Passionately teaching since 2018. ✨</p>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
