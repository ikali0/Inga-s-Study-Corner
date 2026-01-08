import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import QuestionOfTheDay from '@/components/QuestionOfTheDay';
import AboutSection from '@/components/AboutSection';
import ReviewsSection from '@/components/ReviewsSection';
import BookingSection from '@/components/BookingSection';
import Footer from '@/components/Footer';

const Index = () => {
  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-primary/20">
      <Navbar onNavigate={handleNavigate} />
      <main>
        <HeroSection onNavigate={handleNavigate} />
        <ServicesSection />
        <QuestionOfTheDay />
        <AboutSection />
        <ReviewsSection />
        <BookingSection />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default Index;
