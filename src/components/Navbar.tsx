import { useState, useCallback } from "react";
import { Rocket, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedText } from "@/components/ui/animated-underline-text";
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
  return <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-12 sm:h-14 flex items-center justify-between">
          {/* Logo */}
          <button type="button" onClick={() => handleNavClick("hero")} className="flex items-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg" aria-label="Go to homepage">
            <div className="p-1 rotate-3 shadow-[0_2px_0_0_hsl(var(--orange)/0.6)] bg-gradient-to-br from-orange to-primary rounded-md px-[3px] py-[3px]">
              <Rocket className="text-primary-foreground w-3.5 h-3.5 sm:h-[11px] sm:w-[11px]" />
            </div>
            <AnimatedText text="Inga's Study Corner" textClassName="text-xs sm:text-sm text-foreground" underlineClassName="text-primary" />
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6" aria-label="Main navigation">
            {navItems.map(item => <button type="button" key={item} onClick={() => handleNavClick(item.toLowerCase())} className="relative text-muted-foreground hover:text-foreground font-semibold transition-colors text-xs lg:text-sm focus:outline-none focus-visible:text-primary group">
                {item}
                <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </button>)}
            <Button onClick={() => handleNavClick("book")} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 lg:px-4 py-1.5 rounded-full font-bold text-[10px] lg:text-xs shadow-[0_3px_0_0_hsl(var(--primary)/0.5)] hover:shadow-[0_1px_0_0_hsl(var(--primary)/0.5)] hover:translate-y-0.5 active:shadow-none active:translate-y-1 transition-all">
              Book a Call
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-foreground p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg" aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && <div className="md:hidden bg-card border-b border-border p-3 absolute w-full shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map(item => <button type="button" key={item} onClick={() => handleNavClick(item.toLowerCase())} className="relative text-foreground font-semibold text-left py-2 px-2 text-sm hover:text-primary hover:bg-primary/5 rounded-lg transition-colors group">
                {item}
                <span className="absolute bottom-1.5 left-2 w-[calc(100%-16px)] h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </button>)}
            <Button onClick={() => handleNavClick("book")} size="sm" className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-center text-xs shadow-[0_3px_0_0_hsl(var(--primary)/0.5)] w-full mt-2 active:shadow-none active:translate-y-1 transition-all">
              Book a Call ✨
            </Button>
          </nav>
        </div>}
    </nav>;
};
export default Navbar;