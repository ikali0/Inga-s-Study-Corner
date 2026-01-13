import { CornerRightUp, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

interface AIInputProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  maxLength?: number;
  onSubmit?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function AIInput({
  id = "ai-input",
  placeholder = "Type your message...",
  minHeight = 48,
  maxHeight = 150,
  maxLength = 400,
  onSubmit,
  className,
  disabled = false,
  isLoading = false,
  value: controlledValue,
  onChange,
}: AIInputProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });
  
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const inputValue = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback((newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [isControlled, onChange]);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim() || disabled || isLoading) return;
    onSubmit?.(inputValue);
    if (!isControlled) {
      setInternalValue("");
    }
    adjustHeight(true);
  }, [inputValue, disabled, isLoading, onSubmit, isControlled, adjustHeight]);

  // Adjust height when value changes
  useEffect(() => {
    adjustHeight();
  }, [inputValue, adjustHeight]);

  const charCount = inputValue.length;
  const isNearLimit = charCount > maxLength * 0.8;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative w-full">
        <Textarea
          id={id}
          placeholder={placeholder}
          className={cn(
            "w-full bg-muted/40 rounded-xl pl-3 pr-12 text-sm",
            "placeholder:text-muted-foreground/50",
            "border border-border/50 hover:border-primary/30 focus:border-primary/50",
            "text-foreground",
            "overflow-y-auto resize-none",
            "focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-0",
            "transition-all duration-150",
            "leading-relaxed py-2.5",
            "[&::-webkit-resizer]:hidden",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
          }}
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => {
            const newValue = e.target.value.slice(0, maxLength);
            handleChange(newValue);
            adjustHeight();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={disabled || isLoading}
          maxLength={maxLength}
          aria-label="AI input"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          type="button"
          disabled={!inputValue.trim() || disabled || isLoading}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 right-1.5",
            "rounded-lg bg-primary p-1.5",
            "transition-all duration-150",
            "hover:bg-primary/90 active:scale-90",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-primary"
          )}
          aria-label="Submit"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 text-primary-foreground animate-spin" />
          ) : (
            <CornerRightUp className="w-3.5 h-3.5 text-primary-foreground" />
          )}
        </button>
      </div>
      
      {/* Character count - compact */}
      <p className={cn(
        "text-[9px] mt-1 text-right transition-colors",
        isNearLimit ? "text-orange" : "text-muted-foreground/60"
      )}>
        {charCount}/{maxLength}
      </p>
    </div>
  );
}
