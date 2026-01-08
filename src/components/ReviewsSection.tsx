import { MessageCircle, Star } from 'lucide-react';
const reviews = [{
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
  return <section id="reviews" className="py-12 md:py-20 bg-primary/5 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 md:mb-16">
          Happy Parents & Kids 💛
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((review, i) => <div key={i} className="bg-card p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-border relative card-hover">
              <MessageCircle className="absolute top-4 right-4 sm:top-6 sm:right-6 text-primary/20 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              <div className="flex text-primary mb-3 sm:mb-4">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
              </div>
              <p className="text-muted-foreground mb-4 sm:mb-6 italic text-sm sm:text-sm">"{review.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center font-bold text-muted-foreground text-sm">
                  {review.initial}
                </div>
                <div>
                  <p className="font-bold text-foreground text-xs sm:text-sm">{review.parent}</p>
                  
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default ReviewsSection;