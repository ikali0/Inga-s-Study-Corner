import { forwardRef, useRef } from "react";
import { MessageCircle, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
interface Review {
  quote: string;
  parent: string;
  subject: string;
  initial: string;
  outcome?: string;
}
const reviews: Review[] = [{
  quote: "Before working with Inga, math homework was a nightly battle. Now, my daughter actually looks forward to her sessions and her grade went from a C to an A-!",
  parent: "Sarah M.",
  subject: "Parent of 5th Grader",
  initial: "S",
  outcome: "C → A- in 3 months"
}, {
  quote: "Inga has a gift for making science concepts click. My son's confidence in physics has skyrocketed and he's now considering a STEM career.",
  parent: "David K.",
  subject: "Parent of 8th Grader",
  initial: "D",
  outcome: "Now loves science"
}, {
  quote: "The small group setting is perfect. Individual attention without the intimidation of 1-on-1 tutoring. My daughter's reading level jumped two grades!",
  parent: "Jennifer L.",
  subject: "Parent of 6th Grader",
  initial: "J",
  outcome: "+2 grade levels"
}, {
  quote: "After just 6 weeks of test prep, my son improved his standardized test scores by 15 percentile points. Worth every penny!",
  parent: "Marcus T.",
  subject: "Parent of 7th Grader",
  initial: "M",
  outcome: "+15 percentile points"
}, {
  quote: "Homework time used to end in tears. Now my daughter finishes independently and even helps her younger brother. Inga taught her HOW to learn.",
  parent: "Lisa R.",
  subject: "Parent of 4th Grader",
  initial: "L",
  outcome: "Independent learner"
}, {
  quote: "We tried 3 other tutors before finding Inga. The difference? She actually makes learning fun. My son asks when his next session is!",
  parent: "Anthony W.",
  subject: "Parent of 6th Grader",
  initial: "A",
  outcome: "Loves learning now"
}, {
  quote: "The online sessions work perfectly with our busy schedule. Inga is patient, encouraging, and knows exactly how to explain difficult concepts.",
  parent: "Michelle C.",
  subject: "Parent of 8th Grader",
  initial: "M",
  outcome: "Flexible & effective"
}, {
  quote: "My shy son now raises his hand in class and helps other students. Inga didn't just teach him math—she built his confidence.",
  parent: "Robert H.",
  subject: "Parent of 5th Grader",
  initial: "R",
  outcome: "Confident in class"
}];
const avatarColors = ["bg-primary text-primary-foreground", "bg-blue text-primary-foreground", "bg-green text-primary-foreground", "bg-purple text-primary-foreground", "bg-orange text-primary-foreground", "bg-primary text-primary-foreground", "bg-blue text-primary-foreground", "bg-green text-primary-foreground"];
const ReviewsSection = forwardRef<HTMLElement>((_, ref) => {
  const plugin = useRef(Autoplay({
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: true
  }));

  return (
    <section
      ref={ref}
      id="reviews"
      className="py-10 sm:py-12 md:py-16 lg:py-20 relative z-10 bg-primary/5 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8 md:mb-12">
          Happy Parents & Kids 💛
        </h2>

        <Carousel plugins={[plugin.current]} opts={{
        align: "start",
        loop: true
      }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {reviews.map((review, i) => <CarouselItem key={i} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <article className="p-4 sm:p-5 md:p-6 rounded-xl border border-border relative transition-all hover:shadow-lg h-full flex flex-col bg-card">
                  <MessageCircle aria-hidden="true" className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/30" />

                  {/* Stars */}
                  <div className="flex text-primary mb-2 sm:mb-3" aria-label="5 star rating">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" />)}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-muted-foreground mb-3 sm:mb-4 italic text-xs sm:text-sm leading-relaxed flex-grow">
                    "{review.quote}"
                  </blockquote>

                  {/* Outcome Badge */}
                  {review.outcome && <div className="mb-3">
                      <span className="inline-block bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                        ✓ {review.outcome}
                      </span>
                    </div>}

                  {/* Author */}
                  <footer className="flex items-center gap-2 sm:gap-2.5 mt-auto">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${avatarColors[i % avatarColors.length]}`}>
                      {review.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-xs sm:text-sm">
                        {review.parent}
                      </p>
                      <p className="text-muted-foreground text-[10px] sm:text-xs">
                        {review.subject}
                      </p>
                    </div>
                  </footer>
                </article>
              </CarouselItem>)}
          </CarouselContent>
        </Carousel>

        {/* Carousel indicator dots */}
        <div className="flex justify-center gap-1.5 mt-4 sm:mt-6">
          {[0, 1, 2].map((_, i) => <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/30" />)}
        </div>
      </div>
    </section>
  );
});

ReviewsSection.displayName = "ReviewsSection";

export default ReviewsSection;