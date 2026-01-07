import { MessageCircle, Star } from 'lucide-react';

const reviews = [
  {
    quote: "Before working with Inga, math homework was a nightly battle. Now, my daughter actually looks forward to her sessions!",
    parent: "Parent of 5th Grader",
    subject: "Math Support",
    initial: "S"
  },
  {
    quote: "Inga has a gift for making science concepts click. My son's confidence in physics has skyrocketed.",
    parent: "Parent of 7th Grader",
    subject: "Physics & Math",
    initial: "M"
  },
  {
    quote: "Small group setting is perfect. Individual attention without the intimidation of 1-on-1 tutoring.",
    parent: "Parent of 6th Grader",
    subject: "Chemistry Foundations",
    initial: "J"
  }
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-16 md:py-20 bg-primary/5 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-foreground mb-12 md:mb-16">Happy Parents & Kids 💛</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border relative card-hover">
              <MessageCircle className="absolute top-6 right-6 text-primary/20 w-8 h-8 md:w-10 md:h-10" />
              <div className="flex text-primary mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <p className="text-muted-foreground mb-6 italic">"{review.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center font-bold text-muted-foreground">
                  {review.initial}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{review.parent}</p>
                  <p className="text-xs text-muted-foreground">{review.subject}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
