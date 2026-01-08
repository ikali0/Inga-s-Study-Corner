import { Smile, Zap, Heart, Star, Users, Clock, MapPin } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" aria-labelledby="about-title" className="relative z-10 py-14 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-secondary p-6 text-secondary-foreground sm:p-8 md:p-12 lg:p-16">
          {/* Background pattern */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative grid items-start gap-10 md:grid-cols-2 md:gap-12">
            {/* Left: Benefits */}
            <div className="min-w-0">
              <h2 id="about-title" className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                Why Parents <span className="text-primary">Love It</span>
              </h2>

              <div className="mt-6 space-y-5 sm:space-y-6">
                {/* Item */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-blue/20 p-3">
                    <Smile className="text-blue" size={22} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold sm:text-lg md:text-xl">Builds Confidence, Not Pressure</h3>
                    <p className="mt-1 text-sm leading-relaxed text-secondary-foreground/80 sm:text-base">
                      A calm, encouraging space to grow. We tackle anxiety before algebra.
                    </p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-purple/20 p-3">
                    <Zap className="text-purple" size={22} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold sm:text-lg md:text-xl">Encourages Thinking, Not Memorization</h3>
                    <p className="mt-1 text-sm leading-relaxed text-secondary-foreground/80 sm:text-base">
                      Visual learner? We draw. Kinesthetic? We build. Adapted to your child.
                    </p>
                  </div>
                </div>

                {/* Item */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-pink/20 p-3">
                    <Heart className="text-pink" size={22} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold sm:text-lg md:text-xl">Supports School Success</h3>
                    <p className="mt-1 text-sm leading-relaxed text-secondary-foreground/80 sm:text-base">
                      A library-based, distraction-free environment supporting success across STEM subjects.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Stats Card */}
            <aside className="min-w-0">
              <div className="rounded-3xl border border-secondary-foreground/20 bg-card/10 p-6 backdrop-blur-md sm:p-7 md:p-8">
                <dl className="grid grid-cols-1 gap-5 text-center sm:grid-cols-2 sm:gap-6 md:gap-8">
                  <div className="rounded-2xl bg-secondary-foreground/5 p-4 sm:bg-transparent sm:p-0">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="text-primary" size={22} aria-hidden="true" />
                      <dt className="sr-only">Ages Welcome</dt>
                      <dd className="text-3xl font-bold text-primary sm:text-4xl">8–14</dd>
                    </div>
                    <p className="mt-1 text-xs font-medium text-secondary-foreground/70 sm:text-sm">Ages Welcome</p>
                  </div>

                  <div className="rounded-2xl bg-secondary-foreground/5 p-4 sm:bg-transparent sm:p-0">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="text-primary" size={22} aria-hidden="true" />
                      <dt className="sr-only">Hours Daily</dt>
                      <dd className="text-3xl font-bold text-primary sm:text-4xl">6</dd>
                    </div>
                    <p className="mt-1 text-xs font-medium text-secondary-foreground/70 sm:text-sm">Hours Daily</p>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="mt-2 border-t border-secondary-foreground/10 pt-6 sm:pt-8">
                      <div className="flex justify-center gap-1" aria-label="5 out of 5 stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-current text-primary sm:h-6 sm:w-6"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-secondary-foreground/80 sm:text-base">
                        “The best investment we’ve made for our son’s education.”
                      </p>
                    </div>
                  </div>
                </dl>

                <div className="mt-6 border-t border-secondary-foreground/10 pt-6">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-secondary-foreground/80">
                    <MapPin size={18} className="text-primary" aria-hidden="true" />
                    <span className="text-sm font-medium">Huntington Valley Library</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
