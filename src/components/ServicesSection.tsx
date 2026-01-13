// src/components/ServicesSection.tsx
// BULLETPROOF VERSION — all critical bugs fixed
// Key fixes:
// 1. ScrollAreaViewport used for correct scroll ref
// 2. Framer Motion parent variants properly configured
// 3. Swipe-to-close guarded against multiple triggers
// 4. Accessibility: keyboard support + proper roles
// 5. Pathname parsing handles edge cases

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// ---------------- DATA ----------------
const services = [
  {
    id: "math",
    title: "Math Mastery",
    description: "From arithmetic to middle school algebra.",
    color: "blue",
    longDescription: "We build strong math foundations using visual models and real-world problems.",
    approach: "I Do → We Do → You Do with concrete visual tools.",
    outcomes: [
      "90%+ accuracy on grade-level math facts",
      "Independent multi-step problem solving",
      "Increased classroom confidence",
    ],
  },
  {
    id: "english",
    title: "Reading & English",
    description: "Fluent readers and confident writers.",
    color: "purple",
    longDescription: "From phonics to essay writing, we support the full literacy journey.",
    approach: "Guided reading, writing practice, and visual organizers.",
    outcomes: ["Improved reading comprehension", "Clear paragraph writing", "Expanded vocabulary"],
  },
  {
    id: "science",
    title: "Science & STEM",
    description: "Hands-on, curiosity-driven learning.",
    color: "orange",
    longDescription: "Inquiry-based science that encourages exploration and experimentation.",
    approach: "Observe, hypothesize, test, conclude.",
    outcomes: ["Independent experiment design", "Correct scientific vocabulary", "Logical reasoning skills"],
  },
];

const themeConfig: Record<string, { card: string; button: string }> = {
  blue: { card: "border-blue-400", button: "bg-blue-600 hover:bg-blue-700" },
  purple: { card: "border-purple-400", button: "bg-purple-600 hover:bg-purple-700" },
  orange: { card: "border-orange-400", button: "bg-orange-600 hover:bg-orange-700" },
};

// ---------------- ANIMATION ----------------
const containerAnim = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const sectionAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ---------------- MAIN ----------------
const ServicesSection: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // FIX:  Handle empty string edge case
  const activeId = useMemo(() => {
    const id = pathname?.split("/services/")[1];
    return id || null;
  }, [pathname]);

  const service = services.find((s) => s.id === activeId) ?? null;

  // REAL DOM refs (ScrollAreaViewport + swipe target)
  const scrollElRef = useRef<HTMLDivElement | null>(null);
  const swipeElRef = useRef<HTMLDivElement | null>(null);

  const [shadows, setShadows] = useState({ top: false, bottom: false });
  const scrollPositions = useRef<Record<string, number>>({});

  // Scroll shadows
  useEffect(() => {
    const el = scrollElRef.current;
    if (!el) return;

    const update = () => {
      setShadows({
        top: el.scrollTop > 4,
        bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 4,
      });
    };

    update();
    el.addEventListener("scroll", update);
    return () => el.removeEventListener("scroll", update);
  }, [service]);

  // FIX: Swipe to close with guard against multiple triggers
  useEffect(() => {
    const el = swipeElRef.current;
    if (!el) return;

    let startY: number | null = null;
    let triggered = false;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      triggered = false;
    };

    const onMove = (e: TouchEvent) => {
      if (startY == null || triggered) return;
      if (e.touches[0].clientY - startY > 120) {
        triggered = true;
        router.push("/");
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
    };
  }, [router]);

  // Restore scroll position per service
  useEffect(() => {
    const el = scrollElRef.current;
    if (!service || !el) return;

    el.scrollTop = scrollPositions.current[service.id] || 0;

    return () => {
      scrollPositions.current[service.id] = el.scrollTop;
    };
  }, [service]);

  // ARIA announce
  useEffect(() => {
    if (!service) return;
    const live = document.getElementById("aria-live");
    if (live) live.textContent = `${service.title} details opened`;
  }, [service]);

  // FIX: Keyboard handler for accessible cards
  const handleCardActivate = (id: string) => {
    router.push(`/services/${id}`);
  };

  return (
    <>
      <div id="aria-live" className="sr-only" aria-live="polite" />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((s) => {
          const theme = themeConfig[s.color];
          return (
            <article
              key={s.id}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${s.title}`}
              onMouseEnter={() => router.prefetch(`/services/${s.id}`)}
              onClick={() => handleCardActivate(s.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardActivate(s.id);
                }
              }}
              className={`p-6 rounded-xl border-2 bg-card cursor-pointer transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${theme.card}`}
            >
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
              <div className="flex items-center gap-1 text-xs font-bold text-primary">
                More <ArrowRight className="w-3 h-3" />
              </div>
            </article>
          );
        })}
      </div>

      <Sheet open={!!service} onOpenChange={(o) => !o && router.push("/")}>
        <SheetContent side="right" className="h-[100dvh] sm:max-w-md p-0 overflow-hidden rounded-t-xl sm:rounded-none">
          {service && (
            <div ref={swipeElRef} className="relative h-full">
              {/* Top shadow */}
              <div
                className={`pointer-events-none absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-black/10 transition-opacity z-10 ${
                  shadows.top ? "opacity-100" : "opacity-0"
                }`}
              />
              {/* Bottom shadow */}
              <div
                className={`pointer-events-none absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-black/10 transition-opacity z-10 ${
                  shadows.bottom ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* FIX: ScrollAreaViewport for proper scroll ref */}
              <ScrollArea className="h-full">
                <ScrollAreaViewport ref={scrollElRef}>
                  <div className="p-6 space-y-8">
                    {/* FIX: Parent variants for proper stagger */}
                    <motion.div variants={containerAnim} initial="hidden" animate="show">
                      <motion.div variants={sectionAnim}>
                        <SheetHeader>
                          <SheetTitle>{service.title}</SheetTitle>
                          <SheetDescription>{service.longDescription}</SheetDescription>
                        </SheetHeader>
                      </motion.div>

                      <motion.div variants={sectionAnim} className="mt-6">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Our Approach
                        </h4>
                        <p className="text-sm mt-2">{service.approach}</p>
                      </motion.div>

                      <motion.div variants={sectionAnim} className="mt-6">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Expected Outcomes
                        </h4>
                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                          {service.outcomes.map((o) => (
                            <li key={o}>{o}</li>
                          ))}
                        </ul>
                      </motion.div>

                      <motion.div variants={sectionAnim} className="mt-8">
                        <Button
                          className={`w-full text-white ${themeConfig[service.color].button}`}
                          onClick={() => {
                            // Add your booking logic here
                            console.log(`Book trial for ${service.title}`);
                          }}
                        >
                          Book a Trial Session
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </ScrollAreaViewport>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ServicesSection;
