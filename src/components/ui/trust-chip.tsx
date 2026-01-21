import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ShieldCheck, Award, CheckCircle, Lock, Star } from "lucide-react";

const trustChipVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
  {
    variants: {
      variant: {
        success: "bg-success-muted text-success border border-success/20",
        info: "bg-info-muted text-info border border-info/20",
        warning: "bg-warning-muted text-warning border border-warning/20",
        primary: "bg-primary/10 text-primary border border-primary/20",
        muted: "bg-muted/20 text-muted-foreground border border-border/30",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);

export interface TrustChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof trustChipVariants> {
  icon?: "shield" | "award" | "check" | "lock" | "star" | "none";
}

const iconMap = {
  shield: ShieldCheck,
  award: Award,
  check: CheckCircle,
  lock: Lock,
  star: Star,
  none: null,
};

const TrustChip = forwardRef<HTMLDivElement, TrustChipProps>(
  ({ className, variant, icon = "check", children, ...props }, ref) => {
    const IconComponent = icon !== "none" ? iconMap[icon] : null;
    
    return (
      <div
        ref={ref}
        className={cn(trustChipVariants({ variant }), className)}
        {...props}
      >
        {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
        {children}
      </div>
    );
  }
);

TrustChip.displayName = "TrustChip";

export { TrustChip, trustChipVariants };
