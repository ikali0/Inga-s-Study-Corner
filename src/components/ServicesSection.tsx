// src/components/ServicesSection.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ScrollArea,
  ScrollAreaViewport,
} from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/* ---------------- DATA ---------------- */

const services = [
  {
    id: "math",
    title: "Math Mastery",
    description: "From arithmetic to middle school algebra.",
    color: "blue",
    longDescription:
      "We build strong math foundations using visual models and real-world problems.",
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
    longDescription:
      "From phonics to essay writing, we support the full literacy journey.",
    approach: "Guided reading, writing practice, and visual organizers.",
    outcomes: [
      "Improved reading comprehension",
      "Clear paragraph writing",
      "Expanded vocabulary",
    ],
  },
  {
    id: "science",
    title: "Science & STEM",
    description: "Hands-on, curiosity-driven learning.",
    color: "orange",
    longDescription:
      "Inquiry-based science that encourages exploration and experimentation.",
    approach: "Observe, hypothesize, test, conclude.",
    outcomes: [
      "Independent experiment design",
      "Correct scientific vocabulary",
      "Logical reasoning skills",
    ],
  },
];

const themeConfig = {
  blue: { card: "border-blue-400", button: "bg-blue-600 hover:bg-blue-700" },
  purple: { card: "border-purple-400", button: "bg-purple-600 hover:bg-purple-700" },
  orange: { card: "border-orange-400", button: "bg-orange-600 hover:bg-orange-700" },
} as const;

/* ---------------- ANIMATION ---------------- */

const sectionAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/* ---------------- MAIN ---------------- */

const ServicesSection: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const activeId = useMemo(() => {
    const id = pathname?.split("/services/")[1];
    return id || null;
  }, [pathname]);

  const service = services.find((s) => s.id === activeId) ?? null;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const swipeRef = useRef<HTMLDivElement | null>(null);
  const scrollPositions = useRef<Record<string, number>>({});
  const [shadows, setShadows] = useState({ top: false, bottom: false });

  /* ----- Scroll shadows + restore ----- */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !service) return;

    el.scrollTop = scrollPositions.current[service.id] || 0;

    const update = () => {
      setShadows({
        top: el.scrollTop > 4,
        bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 4,
      });
    };

    update();
    el.addEventListener("scroll", update);

    return () => {
      scrollPositions.current[service.id] = el.scrollTop;
      el.removeEventListener("scroll", update);
    };
  }, [service]);

  /* ----- Swipe to close (mobile, single-fire) ----- */
  useEffect(() => {
    const el = swipeRef.current;
    if (!el) return;

    let startY: number | null = null;
    let fired = false;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onMove = (e: TouchEvent) => {
      if (startY == null || fired) return;
      if (e.touches[0].clientY - startY > 120) {
        fired = true;
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

  /* ----- ARIA live ----- */
  useEffect(() => {
    if (!service) return;
    const live = document.getElementById("aria-live");
    if (live) live.textContent = `${service.title} details opened`;
  }, [service]);

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
              onMouseEnter={() => router.prefetch(`/services/${s.id}`)}
              onClick={() => router.push(`/services/${s.id}`)}
              onKeyDown={(e) =>
                e.key === "Enter" && router.push(`/services/${s.id}`)
              }
              className={`p-6 rounded-xl border-2 bg-card cursor-pointer ${theme.card}`}
            >
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {s.description}
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-primary">
                More <ArrowRight className="w-3 h-3" />
              </div>
            </article>
          );
        })}
      </div>

      <Sheet open={!!service} onOpenChange={(o) => !o && router.push("/")}>
        <SheetContent
          side="right"
          className="h-[100dvh] sm:max-w-md p-0 overflow-hidden"
        >
          {service && (
            <div ref={swipeRef} className="relative h-full">
              {/* Shadows */}
              <div
                className={`pointer-events-none absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-black/10 transition-opacity ${
                  shadows.top ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`pointer-events-none absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-black/10 transition-opacity ${
                  shadows.bottom ? "opacity-100" : "opacity-0"
                }`}
              />

              <ScrollArea className="h-full">
                <ScrollAreaViewport ref={scrollRef}>
                  <div className="p-6 space-y-8">
                    <motion.div
                      variants={{}}
                      initial="hidden"
                      animate="show"
                      transition={{ staggerChildren: 0.08 }}
                    >
                      <motion.div variants={sectionAnim}>
                        <SheetHeader>
                          <SheetTitle>{service.title}</SheetTitle>
                          <SheetDescription>
                            {service.longDescription}
                          </SheetDescription>
                        </SheetHeader>
                      </motion.div>

                      <motion.div variants={sectionAnim} className="mt-6">
                        <h4 className="text-xs font-bold uppercase">
                          Our Approach
                        </h4>
                        <p className="text-sm">{service.approach}</p>
                      </motion.div>

                      <motion.div variants={sectionAnim} className="mt-6">
                        <h4 className="text-xs font-bold uppercase">
                          Expected Outcomes
                        </h4>
                        <ul className="list-disc pl-5 text-sm">
                          {service.outcomes.map((o) => (
                            <li key={o}>{o}</li>
                          ))}
                        </ul>
                      </motion.div>

                      <motion.div variants={sectionAnim} className="mt-8">
                        <Button
                          className={`w-full text-white ${
                            themeConfig[service.color].button
                          }`}
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
