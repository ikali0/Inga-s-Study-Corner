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
  return <section id="reviews" className="py-10 sm:py-12 md:py-16 lg:py-20 relative z-10 bg-primary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8 md:mb-12">
          Happy Parents & Kids 💛
        </h2>
        
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => <article key={i} className="bg-card p-4 sm:p-5 md:p-6 rounded-xl border relative transition-shadow hover:shadow-md border-pink-700 border-solid">
              <MessageCircle className="absolute top-4 right-4 text-primary/15 w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
              
              {/* Stars */}
              <div className="flex text-primary mb-3" aria-label="5 star rating">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
              </div>
              
              {/* Quote */}
              <blockquote className="text-muted-foreground mb-4 italic text-xs sm:text-sm leading-relaxed">
                "{review.quote}"
              </blockquote>
              
              {/* Author */}
              <footer className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-orange-400 text-purple-100">
                  {review.initial}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs sm:text-xs">
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