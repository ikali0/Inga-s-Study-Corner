import { Smile, Zap, Heart, Star, Users, Clock, MapPin } from "lucide-react";
const AboutSection = () => {
  return <section id="about" className="py-12 md:py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-secondary rounded-2xl md:rounded-3xl text-secondary-foreground p-5 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Background patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
          backgroundImage: "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 lg:text-2xl">
                Why Parents <span className="text-primary">Love It</span>
              </h2>
              <div className="space-y-4 sm:space-y-4">
                <div className="flex gap-3 md:gap-4">
                  <div className="bg-blue/20 p-2.5 md:p-3 rounded-lg h-fit shrink-0 md:rounded-sm">
                    <Smile className="text-blue w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold mb-1 md:mb-2 md:text-lg">Builds Confidence, Not Pressure</h4>
                    <p className="text-secondary-foreground/80 text-sm md:text-base">
                      A calm, encouraging space to grow. We tackle anxiety before algebra.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4">
                  <div className="bg-purple/20 p-2.5 md:p-3 rounded-lg h-fit shrink-0 md:rounded-sm">
                    <Zap className="text-purple w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold mb-1 md:mb-2 md:text-lg">Encourages Thinking, Not Memorization</h4>
                    <p className="text-secondary-foreground/80 text-sm md:text-base">
                      Visual learner? We draw. Kinesthetic? We build. Adapted to YOUR child.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4">
                  <div className="bg-pink/20 p-2.5 md:p-3 rounded-lg md:rounded-xl h-fit shrink-0">
                    <Heart className="text-pink w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold mb-1 md:mb-2 md:text-lg">Supports School Success</h4>
                    <p className="text-secondary-foreground/80 text-sm md:text-base">
                      Library-based, distraction-free environment supporting success across STEM subjects.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-card/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 border border-secondary-foreground/20 mt-4 md:mt-0">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                    <Users className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">8-14</span>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-secondary-foreground/70">Ages Welcome</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                    <Clock className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">6</span>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-secondary-foreground/70">Hours Daily</div>
                </div>
                <div className="col-span-2 pt-4 sm:pt-6 md:pt-8 border-t border-secondary-foreground/10">
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="text-primary fill-current w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />)}
                  </div>
                  <p className="text-secondary-foreground/80 text-xs sm:text-sm md:text-sm">
                    "The best investment we've made for our son's education."
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default AboutSection;