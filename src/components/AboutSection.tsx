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
              
              <div className="space-y-4 md:space-y-6">
                <div className="flex gap-3 md:gap-4">
                  <div className="bg-blue/20 p-2.5 md:p-3 rounded-lg md:rounded-xl h-fit shrink-0">
                    <Smile className="text-blue w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg md:text-xl font-bold mb-1 md:mb-2">Builds Confidence, Not Pressure</h4>
                    <p className="text-secondary-foreground/80 text-sm md:text-base">
                      A calm, encouraging space to grow. We tackle anxiety before algebra.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4">
                  <div className="bg-purple/20 p-2.5 md:p-3 rounded-lg md:rounded-xl h-fit shrink-0">
                    <Zap className="text-purple w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg md:text-xl font-bold mb-1 md:mb-2">Encourages Thinking, Not Memorization</h4>
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
                    <h4 className="text-base sm:text-lg md:text-xl font-bold mb-1 md:mb-2">Supports School Success</h4>
                    <p className="text-secondary-foreground/80 text-sm md:text-base">
                      Library-based, distraction-free environment supporting success across STEM subjects.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            
          </div>
        </div>
      </div>
    </section>;
};
export default AboutSection;