import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  textClassName?: string;
  underlineClassName?: string;
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      textClassName,
      underlineClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center", props.className)}
      >
        <div className="relative group">
          <span
            className={cn("font-bold transition-transform duration-200 group-hover:scale-[1.02]", textClassName)}
          >
            {text}
          </span>

          <svg
            width="100%"
            height="6"
            viewBox="0 0 300 20"
            className={cn("absolute -bottom-0.5 left-0 overflow-visible", underlineClassName)}
            preserveAspectRatio="none"
          >
            <path
              d="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="animate-[dash_1.5s_ease-in-out_forwards] [stroke-dasharray:500] [stroke-dashoffset:500]"
              style={{
                animation: "dash 1.5s ease-in-out forwards"
              }}
            />
          </svg>
          
          <style>{`
            @keyframes dash {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}</style>
        </div>
      </div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
