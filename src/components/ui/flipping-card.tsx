import React, { useState } from "react";
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
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    // Only flip on click for touch devices
    if (window.matchMedia("(hover: none)").matches) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className="group/flipping-card [perspective:1000px] w-full cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative rounded-xl border border-border bg-card shadow-lg transition-all duration-500 [transform-style:preserve-3d]",
          // Hover flip for desktop, state-based flip for mobile
          "group-hover/flipping-card:md:[transform:rotateY(180deg)]",
          isFlipped && "[transform:rotateY(180deg)]",
          // Responsive heights - smaller on mobile
          "h-[180px] xs:h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] w-full mx-auto",
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
