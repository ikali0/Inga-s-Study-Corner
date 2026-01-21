import * as React from "react";
import { cn } from "@/lib/utils";
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({
  className,
  type,
  ...props
}, ref) => {
  return <input type={type} className={cn("flex h-8 w-full rounded-md border border-input sm-background py-2 text-base ring-offset-background file:border-0 file:md-transparent file:text-sm file:font-small file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm px-[8px]", className)} ref={ref} {...props} />;
});
Input.displayName = "Input";
export { Input };