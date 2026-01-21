import { forwardRef, useRef } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
interface Review {
  quote: string;
  parent: string;
  subject: string;
  initial: string;
  outcome?: string;
  date: string;
}
const reviews: Review[] = [{
  quote: "Math homework used to be a struggle. After working with Inga, my daughter now completes assignments independently and her grades have improved significantly.",
  parent: "Sarah M.",
  subject: "Parent of 5th Grader",
  initial: "S",
  outcome: "Grade improvement",
  date: "Jan 2026"
}, {
  quote: "Inga explains science concepts in a way that really clicks. My son's understanding and confidence in the subject have grown considerably.",
  parent: "David K.",
  subject: "Parent of 8th Grader",
  initial: "D",
  outcome: "Stronger foundation",
  date: "Dec 2025"
}, {
  quote: "The small group format provides individual attention in a supportive environment. My daughter's reading comprehension has improved noticeably.",
  parent: "Jennifer L.",
  subject: "Parent of 6th Grader",
  initial: "J",
  outcome: "Better comprehension",
  date: "Nov 2025"
}, {
  quote: "After focused test prep sessions, my son showed measurable improvement in his standardized test scores. Very pleased with the results.",
  parent: "Marcus T.",
  subject: "Parent of 7th Grader",
  initial: "M",
  outcome: "Improved test scores",
  date: "Oct 2025"
}, {
  quote: "My daughter now approaches homework with confidence and works through problems on her own. She's developed better study habits overall.",
  parent: "Lisa R.",
  subject: "Parent of 4th Grader",
  initial: "L",
  outcome: "Independent learner",
  date: "Sep 2025"
}, {
  quote: "Inga makes learning engaging and accessible. My son looks forward to his sessions, which has made a real difference in his attitude toward school.",
  parent: "Anthony W.",
  subject: "Parent of 6th Grader",
  initial: "A",
  outcome: "Positive attitude",
  date: "Aug 2025"
}, {
  quote: "Online sessions fit our schedule perfectly. Inga is patient and explains concepts clearly, adapting to my child's learning pace.",
  parent: "Michelle C.",
  subject: "Parent of 8th Grader",
  initial: "M",
  outcome: "Flexible scheduling",
  date: "Jul 2025"
}, {
  quote: "My son has become more confident participating in class. The tutoring has helped both his academic skills and self-assurance.",
  parent: "Robert H.",
  subject: "Parent of 5th Grader",
  initial: "R",
  outcome: "Increased confidence",
  date: "Jun 2025"
}];
const avatarColors = ["bg-primary text-primary-foreground", "bg-blue text-primary-foreground", "bg-green text-primary-foreground", "bg-purple text-primary-foreground", "bg-orange text-primary-foreground", "bg-primary text-primary-foreground", "bg-blue text-primary-foreground", "bg-green text-primary-foreground"];
const ReviewsSection = forwardRef<HTMLElement>((_, ref) => {
  const plugin = useRef(Autoplay({
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: true
  }));
  return <section ref={ref} id="reviews" className="py-10 sm:py-12 md:py-16 lg:py-20 relative z-10 bg-primary/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-[22px]">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8 md:mb-12">
          What Parents Are Saying
        </h2>

        <Carousel plugins={[plugin.current]} opts={{
        align: "start",
        loop: true
      }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {reviews.map((review, i) => <CarouselItem key={i} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <article className="p-4 sm:p-5 md:p-6 rounded-xl border border-border relative transition-all hover:shadow-lg h-full flex flex-col bg-card">
                  {/* Verified badge & date */}
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="text-green text-[10px] sm:text-xs font-medium gap-[2px] flex items-start justify-center border-0">
                      <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Verified</span>
                    </div>
                    <span className="text-[8px] sm:text-xs text-white text-center bg-pink-700">{review.date}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex text-primary mb-2 sm:mb-2" aria-label="5 star rating">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" />)}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-muted-foreground mb-3 sm:mb-4 italic text-xs sm:text-sm leading-relaxed flex-grow">
                    "{review.quote}"
                  </blockquote>

                  {/* Outcome Badge */}
                  {review.outcome && <div className="mb-3">
                      <span className="inline-block bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold py-0.5 rounded-full px-[6px]">
                        ✓ {review.outcome}
                      </span>
                    </div>}

                  {/* Author */}
                  <footer className="flex items-center gap-2 mt-auto sm:gap-[8px]">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${avatarColors[i % avatarColors.length]}`}>
                      {review.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-xs sm:text-xs">{review.parent}</p>
                      <p className="text-muted-foreground text-[10px] sm:text-xs">{review.subject}</p>
                    </div>
                  </footer>
                </article>
              </CarouselItem>)}
          </CarouselContent>
        </Carousel>

        {/* Carousel indicator dots */}
        <div className="flex justify-center gap-1.5 mt-4 sm:mt-6 my-[22px]">
          {[0, 1, 2].map((_, i) => <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-600" />)}
        </div>
      </div>
    </section>;
});
ReviewsSection.displayName = "ReviewsSection";
export default ReviewsSection;