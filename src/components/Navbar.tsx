import { useState, useCallback } from "react";
import { Rocket, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
interface NavbarProps {
  onNavigate: (id: string) => void;
}
const Navbar = ({
  onNavigate
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleNavClick = useCallback((id: string) => {
    onNavigate(id);
    setIsMenuOpen(false);
  }, [onNavigate]);
  const navItems = ["About", "Services", "Reviews", "Contact"];
  return <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b med-lime-100 bg-lime-100 border-pink-600 border-dashed border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <button type="button" onClick={() => handleNavClick("hero")} className="flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg" aria-label="Go to homepage">
            <div className="p-1.5 sm:p-2 rotate-3 rounded shadow-sm bg-orange-300 border-purple-400 border border-solid py-[6px] px-[6px]">
              <Rocket className="text-primary-foreground w-5 h-5 sm:w-6 sm:h-6 bg-pink-500" />
            </div>
            <span className="text-base font-bold text-foreground sm:text-base">
              Inga's Study Corner
            </span>
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            {navItems.map(item => <button type="button" key={item} onClick={() => handleNavClick(item.toLowerCase())} className="text-muted-foreground hover:text-primary font-semibold transition-colors text-sm lg:text-base focus:outline-none focus-visible:text-primary">
                {item}
              </button>)}
            <Button onClick={() => handleNavClick("book")} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 lg:px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm lg:text-base">
              Book a Free Trial
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-foreground p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg" aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && <div className="md:hidden bg-card border-b border-border p-4 absolute w-full shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            {navItems.map(item => <button type="button" key={item} onClick={() => handleNavClick(item.toLowerCase())} className="text-foreground font-semibold text-left py-3 px-2 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                {item}
              </button>)}
            <Button onClick={() => handleNavClick("book")} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-center shadow-md w-full mt-2">
              Start Your Adventure ✨
            </Button>
          </nav>
        </div>}
    </nav>;
};
export default Navbar;