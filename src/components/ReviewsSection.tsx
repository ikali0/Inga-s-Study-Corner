import { MessageCircle, Star } from "lucide-react";
interface Review {
  quote: string;
  parent: string;
  subject: string;
  initial: string;
}
const reviews: Review[] = [{
  quote: "Before working with Inga, math homework was a nightly battle. Now, my daughter actually looks forward to her sessions!",
  parent: "Parent of 5th Grader",
  subject: "Math Support",
  initial: "S"
}, {
  quote: "Inga has a gift for making science concepts click. My son's confidence in physics has skyrocketed.",
  parent: "Parent of 7th Grader",
  subject: "Physics & Math",
  initial: "M"
}, {
  quote: "Small group setting is perfect. Individual attention without the intimidation of 1-on-1 tutoring.",
  parent: "Parent of 6th Grader",
  subject: "Chemistry Foundations",
  initial: "J"
}];
const ReviewsSection = () => {
  return <section id="reviews" className="py-10 sm:py-12 md:py-16 lg:py-20 relative z-10 bg-purple-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          Happy Parents & Kids 💛
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {reviews.map((review, i) => <article key={i} className="bg-card p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-border relative card-hover">
              <MessageCircle aria-hidden="true" className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 text-primary/20 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:h-[36px] lg:w-[36px]" />
              <div className="flex text-primary mb-2 sm:mb-3 md:mb-4" aria-label="5 star rating">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="sm:w-3.5 sm:h-3.5" fill="currentColor" />)}
              </div>
              <blockquote className="text-muted-foreground mb-3 sm:mb-4 md:mb-5 lg:mb-6 italic text-xs sm:text-sm leading-relaxed">
                "{review.quote}"
              </blockquote>
              <footer className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-muted rounded-full flex items-center justify-center font-bold text-muted-foreground text-xs sm:text-sm">
                  {review.initial}
                </div>
                <div>
                  <p className="font-bold text-foreground text-xs sm:text-sm">
                    {review.parent}
                  </p>
                </div>
              </footer>
            </article>)}
        </div>
      </div>
    </section>;
};
export default ReviewsSection;