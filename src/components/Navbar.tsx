import { useState } from 'react';
import { Rocket, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onNavigate: (id: string) => void;
}

const Navbar = ({ onNavigate }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  const navItems = ['About', 'Services', 'Reviews', 'Contact'];

  return (
    <nav className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('hero')}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="bg-primary p-2 rounded-xl rotate-3 shadow-lg">
              <Rocket className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-xl md:text-2xl font-bold gradient-text">
              Inga's Study Corner
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button 
                key={item}
                onClick={() => handleNavClick(item.toLowerCase())}
                className="text-muted-foreground hover:text-primary font-semibold transition-colors"
              >
                {item}
              </button>
            ))}
            <Button 
              onClick={() => handleNavClick('book')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Book a Free Trial
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-foreground p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-b border-border p-4 absolute w-full shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button 
                key={item}
                onClick={() => handleNavClick(item.toLowerCase())}
                className="text-foreground font-semibold text-lg text-left py-2 hover:text-primary transition-colors"
              >
                {item}
              </button>
            ))}
            <Button 
              onClick={() => handleNavClick('book')}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-center shadow-md w-full"
            >
              Start Your Adventure ✨
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
