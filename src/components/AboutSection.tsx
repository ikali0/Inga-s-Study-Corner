import { Smile, Zap, Heart, Star, Users, Clock, MapPin } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-secondary rounded-3xl text-secondary-foreground p-6 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Background patterns */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{
              backgroundImage: "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                Why Parents <span className="text-primary">Love It</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-blue/20 p-3 rounded-xl h-fit shrink-0">
                    <Smile className="text-blue" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold mb-2">Builds Confidence, Not Pressure</h4>
                    <p className="text-secondary-foreground/80">
                      A calm, encouraging space to grow. We tackle anxiety before algebra.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-purple/20 p-3 rounded-xl h-fit shrink-0">
                    <Zap className="text-purple" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold mb-2">Encourages Thinking, Not Memorization</h4>
                    <p className="text-secondary-foreground/80">
                      Visual learner? We draw. Kinesthetic? We build. Adapted to YOUR child.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-pink/20 p-3 rounded-xl h-fit shrink-0">
                    <Heart className="text-pink" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold mb-2">Supports School Success</h4>
                    <p className="text-secondary-foreground/80">
                      Library-based, distraction-free environment supporting success across STEM subjects.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-card/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-secondary-foreground/20">
              <div className="grid grid-cols-2 gap-6 md:gap-8 text-center">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Users className="text-primary" size={24} />
                    <span className="text-3xl md:text-4xl font-bold text-primary">8-14</span>
                  </div>
                  <div className="text-sm font-medium text-secondary-foreground/70">Ages Welcome</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="text-primary" size={24} />
                    <span className="text-3xl md:text-4xl font-bold text-primary">6</span>
                  </div>
                  <div className="text-sm font-medium text-secondary-foreground/70">Hours Daily</div>
                </div>
                <div className="col-span-2 pt-6 md:pt-8 border-t border-secondary-foreground/10">
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="text-primary fill-current w-5 h-5 md:w-6 md:h-6" />
                    ))}
                  </div>
                  <p className="text-secondary-foreground/80 text-sm md:text-base">
                    "The best investment we've made for our son's education."
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-secondary-foreground/10">
                <div className="flex items-center justify-center gap-2 text-secondary-foreground/80">
                  <MapPin size={18} className="text-primary" />
                  <span className="text-sm font-medium">Huntington Valley Library</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
