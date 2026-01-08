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
const Footer = ({
  onNavigate
}: FooterProps) => {
  return <footer className="med-secondary text-secondary-foreground py-12 relative z-10 overflow-hidden md:py-[58px]">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-pink"></div>
      
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 px-[10px] bg-lime-200 text-blue-900 border-blue-400">
        
        {/* Brand & Mission */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2 md:text-base text-purple-800">
            <Rocket className="text-primary" size={24} />
            Inga's Study Corner
          </h3>
          <p className="leading-relaxed mb-4 text-xs bg-transparent text-black">
            More than just tutoring. We build the confidence and skills your child needs to thrive in school and beyond.
          </p>
          <div className="flex items-center gap-2 text-sm text-secondary-foreground/70">
            <Calendar size={16} className="text-primary" />
            <span className="text-xs text-black">Tue-Fri • 3:00-9:00 PM</span>
          </div>
        </div>

        {/* Parent Trust Column */}
        <div className="lg:col-span-1">
          <h4 className="font-bold mb-4 text-base text-purple-900">Parent Peace of Mind</h4>
          <ul className="space-y-3 bg-purple-600 border-black border">
            <li className="flex items-start gap-3">
              <ShieldCheck className="text-green shrink-0" size={20} />
              <span className="text-secondary-foreground/80 text-xs">Safe & Vetted Environment</span>
            </li>
            <li className="flex items-start gap-3">
              <GraduationCap className="text-blue shrink-0" size={20} />
              <span className="text-secondary-foreground/80 text-xs">Patient, Expert Guidance</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="text-purple shrink-0" size={20} />
              <span className="text-secondary-foreground/80 text-xs">Flexible After-School Hours</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-1 text-purple-800">
          <h4 className="font-bold mb-4 text-base text-purple-800">Explore</h4>
          <ul className="space-y-2 text-sm bg-purple-600 border-black border">
            <li className="text-xs">
              <button onClick={() => onNavigate('services')} className="text-secondary-foreground/70 hover:text-primary transition-colors">
                Tutoring Services
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="text-secondary-foreground/70 hover:text-primary transition-colors text-xs">
                Why Parents Love It
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('reviews')} className="text-secondary-foreground/70 hover:text-primary transition-colors text-xs">
                Parent Reviews
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('book')} className="text-secondary-foreground/70 hover:text-primary transition-colors text-xs border-black border">
                Book Consultation
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="lg:col-span-1" id="contact">
          <h4 className="font-bold mb-4 text-purple-800 text-base">Get in Touch</h4>
          <div className="p-4 space-y-3 border py-[10px] px-[10px] rounded-none bg-transparent border-blue-300">
            <a href={`mailto:${tutorInfo.email}`} className="flex items-center gap-3 text-sm transition-colors text-black">
              <div className="bg-secondary p-2 rounded-lg"><Mail size={16} className="text-pink" /></div>
              <span className="break-all text-xs">{tutorInfo.email}</span>
            </a>
            <a href={`tel:${tutorInfo.phone}`} className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
              <div className="bg-secondary p-2 rounded-lg"><Phone size={16} className="text-green" /></div>
              <span className="text-xs text-black/[0.93]">{tutorInfo.phone}</span>
            </a>
            <div className="flex items-start gap-3 text-sm text-secondary-foreground/80">
              <div className="bg-secondary p-2 rounded-lg shrink-0"><MapPin size={16} className="text-blue" /></div>
              <span className="text-xs text-black">{tutorInfo.location}<br /><span className="text-xs text-secondary-foreground/60">{tutorInfo.address}</span></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="max-w-6xl mx-auto px-4 mt-10 md:mt-12 pt-6 md:pt-8 border-t border-secondary-foreground/10 text-center text-xs text-secondary-foreground/50">
        <p>&copy; {new Date().getFullYear()} Inga's Study Corner. Passionately teaching since 2018. ✨</p>
      </div>
    </footer>;
};
export default Footer;