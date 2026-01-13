import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';

import AIStudyHelper from '@/components/AIStudyHelper';
import ServicesSection from '@/components/ServicesSection';
import AboutSection from '@/components/AboutSection';
import ReviewsSection from '@/components/ReviewsSection';
import BookingSection from '@/components/BookingSection';
import Footer from '@/components/Footer';
const Index = () => {
  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="relative min-h-screen selection:bg-primary/20">
      <Navbar onNavigate={handleNavigate} />
      <main className="px-4 sm:px-6 lg:px-[38px] py-6 sm:py-[38px]">
        <HeroSection onNavigate={handleNavigate} />
        <AIStudyHelper />
        <ServicesSection />
        <AboutSection />
        <ReviewsSection />
        <BookingSection />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>;
};
export default Index;