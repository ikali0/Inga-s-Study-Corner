import React from "react";
import { cn } from "@/lib/utils";

interface FlippingCardProps {
  className?: string;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
}

export function FlippingCard({
  className,
  frontContent,
  backContent,
}: FlippingCardProps) {
  return (
    <div className="group/flipping-card [perspective:1000px] w-full">
      <div
        className={cn(
          "relative rounded-xl border border-border bg-card shadow-lg transition-all duration-700 [transform-style:preserve-3d] group-hover/flipping-card:[transform:rotateY(180deg)]",
          "h-[240px] sm:h-[260px] w-full mx-auto",
          className
        )}
      >
        {/* Front Face */}
        <div className="absolute inset-0 h-full w-full rounded-[inherit] bg-card text-foreground [backface-visibility:hidden] overflow-hidden">
          {frontContent}
        </div>
        {/* Back Face */}
        <div className="absolute inset-0 h-full w-full rounded-[inherit] bg-card text-foreground [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
          {backContent}
        </div>
      </div>
    </div>
  );
}
