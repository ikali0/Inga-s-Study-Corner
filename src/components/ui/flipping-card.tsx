import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface FlippingCardProps {
  className?: string;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
}

// Haptic feedback utility
const triggerHaptic = (pattern: number | number[] = 10) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Vibration API not supported or blocked
    }
  }
};

export function FlippingCard({
  className,
  frontContent,
  backContent,
}: FlippingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const flipCard = useCallback((newFlippedState: boolean) => {
    if (isFlipped !== newFlippedState) {
      setIsFlipped(newFlippedState);
      triggerHaptic(15); // Short vibration on flip
    }
  }, [isFlipped]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isSwipe = Math.abs(distance) > minSwipeDistance;
    
    if (isSwipe) {
      // Swipe left (positive distance) = flip to back
      // Swipe right (negative distance) = flip to front
      if (distance > 0 && !isFlipped) {
        flipCard(true);
      } else if (distance < 0 && isFlipped) {
        flipCard(false);
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleClick = () => {
    // Toggle flip on tap for touch devices
    if (window.matchMedia("(hover: none)").matches) {
      flipCard(!isFlipped);
    }
  };

  return (
    <div 
      className="group/flipping-card [perspective:1000px] w-full cursor-pointer touch-pan-y"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
