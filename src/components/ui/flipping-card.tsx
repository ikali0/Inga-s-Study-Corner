import React, { useState, useRef, useCallback, memo } from "react";
import { cn } from "@/lib/utils";

interface FlippingCardProps {
  className?: string;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
}

// Haptic feedback utility - debounced
const triggerHaptic = (pattern: number | number[] = 10) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Vibration API not supported or blocked
    }
  }
};

export const FlippingCard = memo(function FlippingCard({
  className,
  frontContent,
  backContent
}: FlippingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isTap = useRef(true);
  
  const flipCard = useCallback((newFlippedState: boolean) => {
    setIsFlipped(prev => {
      if (prev !== newFlippedState) {
        triggerHaptic(10);
        return newFlippedState;
      }
      return prev;
    });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isTap.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;
    
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
    
    // If moved more than 10px, it's not a tap
    if (deltaX > 10 || deltaY > 10) {
      isTap.current = false;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (isTap.current) {
      flipCard(!isFlipped);
    }
    touchStartX.current = null;
    touchStartY.current = null;
    isTap.current = true;
  }, [flipCard, isFlipped]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Only handle click on non-touch devices or if touch didn't handle it
    if (window.matchMedia("(hover: hover)").matches) {
      return; // Desktop uses hover, not click
    }
    e.preventDefault();
  }, []);

  return (
    <div 
      className="group/flipping-card [perspective:1000px] w-full cursor-pointer select-none"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className={cn(
          "relative rounded-sm border border-border bg-card shadow-lg",
          "transition-transform duration-300 ease-out will-change-transform",
          "[transform-style:preserve-3d]",
          "group-hover/flipping-card:md:[transform:rotateY(180deg)]",
          "h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] w-full",
          isFlipped && "[transform:rotateY(180deg)]",
          className
        )}
      >
        {/* Front Face */}
        <div className="absolute inset-0 h-full w-full rounded-sm bg-card text-foreground [backface-visibility:hidden] overflow-hidden">
          {frontContent}
        </div>
        {/* Back Face */}
        <div className="absolute inset-0 h-full w-full rounded-sm bg-card text-foreground [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
          {backContent}
        </div>
      </div>
    </div>
  );
});