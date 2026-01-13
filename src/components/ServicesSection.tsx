// FULLY ENHANCED VERSION
// Adds:
// 1. Swipe-to-close (mobile)
// 2. Scroll position restore per service
// 3. Route prefetch on hover
// 4. ARIA announcements
// 5. Section-level analytics hooks (pluggable)

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { services } from "./services.data";
import { themeConfig } from "./themeConfig";

// ---------------- Scroll Shadows ----------------
function useScrollShadows(ref) {
  const [s, set] = useState({ top: false, bottom: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = () =>
      set({
        top: el.scrollTop > 4,
        bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 4,
      });
    fn();
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);
  return s;
}

// ---------------- Swipe to Close ----------------
function useSwipeToClose(ref, onClose) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startY = null;
    const start = (e) => (startY = e.touches[0].clientY);
    const move = (e) => {
      if (startY && e.touches[0].clientY - startY > 120) onClose();
    };
    el.addEventListener("touchstart", start);
    el.addEventListener("touchmove", move);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
    };
  }, [onClose]);
}

// ---------------- Anim ----------------
const sectionAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

// ---------------- Analytics Hook (stub) ----------------
const track = (event, data) => {
  // plug analytics here (PostHog, GA, etc)
  console.log("track", event, data);
};

// ---------------- Main ----------------
const ServicesSection = () => {
  const router = useRouter();
  const pathname = usePathname();

  const activeId = useMemo(() => pathname?.split("/services/")[1] ?? null, [pathname]);
  const service = services.find((s) => s.id === activeId) ?? null;

  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const shadows = useScrollShadows(scrollRef);

  const scrollPositions = useRef({});

  useSwipeToClose(containerRef, () => router.push("/"));

  // Restore scroll position
  useEffect(() => {
    if (!service || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollPositions.current[service.id] || 0;
    return () => {
      scrollPositions.current[service.id] = scrollRef.current.scrollTop;
    };
  }, [service]);

  // ARIA announce
  useEffect(() => {
    if (service) {
      const live = document.getElementById("aria-live");
      if (live) live.textContent = `${service.title} details opened`;
    }
  }, [service]);

  return (
    <>
      <div id="aria-live" className="sr-only" aria-live="polite" />

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {services.map((s) => {
          const theme = themeConfig[s.color];
          return (
            <article
              key={s.id}
              onMouseEnter={() => router.prefetch(`/services/${s.id}`)}
              onClick={() => router.push(`/services/${s.id}`)}
              className={`p-6 rounded-xl border-2 bg-card cursor-pointer ${theme.card}`}
            >
              <div className="font-bold">{s.title}</div>
              <p className="text-sm text-muted-foreground line-clamp-3">{s.description}</p>
              <div className="flex items-center gap-1 text-xs font-bold text-primary">
                More <ArrowRight className="w-3 h-3" />
              </div>
            </article>
          );
        })}
      </div>

      {/* Drawer */}
      <Sheet open={!!service} onOpenChange={(o) => !o && router.push("/")}
      >
        <SheetContent
          ref={containerRef}
          side="right"
          className="h-[100dvh] sm:max-w-md p-0 overflow-hidden rounded-t-xl sm:rounded-none"
        >
          {service && (
            <>
              <div className={`absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-black/10 ${shadows.top ? "opacity-100" : "opacity-0"}`} />
              <div className={`absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-black/10 ${shadows.bottom ? "opacity-100" : "opacity-0"}`} />

              <ScrollArea ref={scrollRef} className="h-full">
                <motion.div
                  initial="hidden"
                  animate="show"
                  transition={{ staggerChildren: 0.08 }}
                  className="p-6 space-y-8"
                >
                  <motion.div variants={sectionAnim} onViewportEnter={() => track("section", "header")}>
                    <SheetHeader>
                      <SheetTitle>{service.title}</SheetTitle>
                      <SheetDescription>{service.longDescription}</SheetDescription>
                    </SheetHeader>
                  </motion.div>

                  <motion.section variants={sectionAnim} onViewportEnter={() => track("section", "approach")}>
                    <h4 className="text-xs font-bold uppercase">Our Approach</h4>
                    <p className="text-sm">{service.approach}</p>
                  </motion.section>

                  <motion.section variants={sectionAnim} onViewportEnter={() => track("section", "coverage")}>
                    <h4 className="text-xs font-bold uppercase">What We Cover</h4>
                  </motion.section>

                  <motion.section variants={sectionAnim} onViewportEnter={() => track("section", "outcomes")}>
                    <h4 className="text-xs font-bold uppercase">Expected Outcomes</h4>
                  </motion.section>

                  <motion.div variants={sectionAnim}>
                    <Button className={`w-full ${themeConfig[service.color].button}`}>
                      Book a Trial Session
                    </Button>
                  </motion.div>
                </motion.div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ServicesSection;
