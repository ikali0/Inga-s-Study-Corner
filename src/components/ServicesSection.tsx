// ADVANCED VERSION: URL-driven drawer + scroll shadows + animations + mobile ergonomics
// Requires: framer-motion, next/navigation (or react-router), shadcn

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

// ---------------- Scroll Shadow Hook ----------------
function useScrollShadows(ref: React.RefObject<HTMLDivElement>) {
  const [state, setState] = useState({ top: false, bottom: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      setState({
        top: el.scrollTop > 4,
        bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 4,
      });
    };

    update();
    el.addEventListener("scroll", update);
    return () => el.removeEventListener("scroll", update);
  }, [ref]);

  return state;
}

// ---------------- Anim Variants ----------------
const sectionAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

// ---------------- Main ----------------
const ServicesSection = () => {
  const router = useRouter();
  const pathname = usePathname();

  const activeId = useMemo(() => {
    const match = pathname?.match(/\/services\/(.+)$/);
    return match?.[1] ?? null;
  }, [pathname]);

  const activeService = services.find((s) => s.id === activeId) ?? null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const shadows = useScrollShadows(scrollRef);

  const close = () => router.push("/");

  return (
    <>
      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {services.map((s) => {
          const theme = themeConfig[s.color];
          return (
            <article
              key={s.id}
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

      {/* URL-driven Drawer */}
      <Sheet open={!!activeService} onOpenChange={(o) => !o && close()}>
        <SheetContent
          side="right"
          className="h-[100dvh] sm:max-w-md p-0 overflow-hidden rounded-t-xl sm:rounded-none"
        >
          {activeService && (
            <>
              {/* Scroll shadows */}
              <div
                className={`pointer-events-none absolute top-0 inset-x-0 h-6 transition-opacity bg-gradient-to-b from-black/10 to-transparent ${
                  shadows.top ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`pointer-events-none absolute bottom-0 inset-x-0 h-6 transition-opacity bg-gradient-to-t from-black/10 to-transparent ${
                  shadows.bottom ? "opacity-100" : "opacity-0"
                }`}
              />

              <ScrollArea ref={scrollRef} className="h-full">
                <motion.div
                  initial="hidden"
                  animate="show"
                  transition={{ staggerChildren: 0.08 }}
                  className="p-6 space-y-8"
                >
                  <motion.div variants={sectionAnim}>
                    <SheetHeader>
                      <SheetTitle>{activeService.title}</SheetTitle>
                      <SheetDescription>{activeService.longDescription}</SheetDescription>
                    </SheetHeader>
                  </motion.div>

                  <motion.section variants={sectionAnim}>
                    <h4 className="text-xs font-bold uppercase">Our Approach</h4>
                    <p className="text-sm">{activeService.approach}</p>
                  </motion.section>

                  <motion.section variants={sectionAnim}>
                    <h4 className="text-xs font-bold uppercase">What We Cover</h4>
                    {/* DetailedFeatures component here */}
                  </motion.section>

                  <motion.section variants={sectionAnim}>
                    <h4 className="text-xs font-bold uppercase">Expected Outcomes</h4>
                    {/* OutcomesList here */}
                  </motion.section>

                  <motion.div variants={sectionAnim}>
                    <Button className={`w-full ${themeConfig[activeService.color].button}`}>
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
