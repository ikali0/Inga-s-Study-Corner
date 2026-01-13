"use client";

import { CornerRightUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
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
  minHeight = 52,
  maxHeight = 200,
  maxLength = 500,
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

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || disabled || isLoading) return;
    onSubmit?.(inputValue);
    if (!isControlled) {
      setInternalValue("");
    }
    adjustHeight(true);
  };

  // Adjust height when value changes
  useEffect(() => {
    adjustHeight();
  }, [inputValue, adjustHeight]);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative w-full">
        <Textarea
          id={id}
          placeholder={placeholder}
          className={cn(
            "w-full bg-muted/50 rounded-2xl pl-4 pr-14",
            "placeholder:text-muted-foreground/60",
            "border border-border/50 hover:border-primary/30 focus:border-primary/50",
            "text-foreground text-wrap",
            "overflow-y-auto resize-none",
            "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0",
            "transition-all duration-200 ease-out",
            "leading-relaxed py-3",
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
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          type="button"
          disabled={!inputValue.trim() || disabled || isLoading}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 right-2",
            "rounded-xl bg-primary p-2",
            "transition-all duration-200",
            "hover:bg-primary/90 active:scale-95",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary"
          )}
          aria-label="Submit"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
          ) : (
            <CornerRightUp className="w-4 h-4 text-primary-foreground" />
          )}
        </button>
      </div>
      
      {/* Character count hint */}
      <p className="text-[10px] text-muted-foreground mt-1.5 text-right">
        <span className="hidden sm:inline">Press Ctrl+Enter to submit • </span>
        {inputValue.length}/{maxLength}
      </p>
    </div>
  );
}
