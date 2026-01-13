import { useState, useCallback, memo, useRef } from "react";
import { Sparkles, Brain, BookOpen, HelpCircle, Loader2, Lightbulb, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIInput } from "@/components/ui/ai-input";
import { toast } from "sonner";

type AIMode = "explain" | "practice" | "quiz";

interface ModeConfig {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  description: string;
  gradient: string;
  suggestions: string[];
}

const modeConfigs: Record<AIMode, ModeConfig> = {
  explain: {
    label: "Explain",
    icon: <Brain className="w-3.5 h-3.5" />,
    placeholder: "How do fractions work?",
    description: "Simple explanations for tricky topics",
    gradient: "from-blue/15 to-blue/5",
    suggestions: ["Photosynthesis", "Gravity", "Fractions"],
  },
  practice: {
    label: "Practice",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    placeholder: "Multiplication for 4th graders",
    description: "Fun problems with answers",
    gradient: "from-green/15 to-green/5",
    suggestions: ["Long division", "Algebra basics", "Word problems"],
  },
  quiz: {
    label: "Quiz",
    icon: <HelpCircle className="w-3.5 h-3.5" />,
    placeholder: "Quiz me on the solar system",
    description: "Test your knowledge",
    gradient: "from-orange/15 to-orange/5",
    suggestions: ["US States", "Animal kingdom", "Chemistry"],
  },
};

const gradeOptions = ["K-2", "3-5", "6-8", "9-12"] as const;

// Memoized suggestion chip
const SuggestionChip = memo(({ 
  text, 
  onClick, 
  disabled 
}: { 
  text: string; 
  onClick: () => void; 
  disabled: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="px-2 py-1 text-[10px] font-medium bg-card border border-border/50 rounded-full text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
  >
    {text}
  </button>
));
SuggestionChip.displayName = "SuggestionChip";

const AIStudyHelper = () => {
  const [mode, setMode] = useState<AIMode>("explain");
  const [input, setInput] = useState("");
  const [grade, setGrade] = useState<string>("3-5");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = useCallback(async (value?: string) => {
    const trimmedInput = (value ?? input).trim();

    if (!trimmedInput) {
      toast.error("Please enter a question or topic");
      return;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-study-helper`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ mode, input: trimmedInput, grade, stream: true }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast.error("Too many requests! Please wait a moment.");
        } else if (response.status === 402) {
          toast.error("AI service limit reached. Try again later.");
        } else {
          toast.error(errorData.error || "Something went wrong");
        }
        setIsLoading(false);
        return;
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullResult = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE lines
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullResult += content;
              setResult(fullResult);
            }
          } catch {
            // Incomplete JSON, put back and wait
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw || raw.startsWith(":") || !raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResult += content;
              setResult(fullResult);
            }
          } catch { /* ignore */ }
        }
      }

      setInput("");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Request aborted");
        return;
      }
      console.error("AI Helper Error:", err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [input, mode, grade]);

  const handleModeChange = useCallback((newMode: AIMode) => {
    setMode(newMode);
    setResult("");
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [result]);

  const config = modeConfigs[mode];

  return (
    <section className="py-6 sm:py-10 md:py-14 relative z-10" id="tools">
      <div className="max-w-md sm:max-w-lg mx-auto px-3 sm:px-4">
        {/* Compact Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/15 to-secondary/10 text-primary text-[10px] font-bold mb-2 border border-primary/20">
            <Sparkles className="w-3 h-3" />
            AI Study Helper
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            Get Instant Help
          </h2>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-xl sm:rounded-2xl border border-border/60 shadow-lg overflow-hidden">
          {/* Mode Tabs */}
          <div className="flex border-b border-border/40 bg-muted/30">
            {(Object.keys(modeConfigs) as AIMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                disabled={isLoading}
                className={`flex-1 py-2.5 px-1 text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1 disabled:opacity-50 ${
                  mode === m
                    ? "bg-card text-primary border-b-2 border-primary -mb-px"
                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                }`}
                aria-current={mode === m ? "page" : undefined}
              >
                {modeConfigs[m].icon}
                {modeConfigs[m].label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className={`p-3 sm:p-4 space-y-3 bg-gradient-to-b ${config.gradient}`}>
            {/* Description + Grade Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-[10px] sm:text-xs text-muted-foreground italic flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                {config.description}
              </p>
              
              <div className="flex items-center gap-1">
                {gradeOptions.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    disabled={isLoading}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-full transition-all disabled:opacity-50 ${
                      grade === g
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] text-muted-foreground mr-1">Try:</span>
              {config.suggestions.map((s) => (
                <SuggestionChip 
                  key={s} 
                  text={s} 
                  onClick={() => handleSuggestionClick(s)}
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* AI Input */}
            <AIInput
              id="study-input"
              placeholder={config.placeholder}
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              minHeight={48}
              maxHeight={120}
              maxLength={400}
            />

            {/* Submit Button */}
            <Button
              onClick={() => handleSubmit()}
              disabled={isLoading || !input.trim()}
              size="sm"
              className="w-full h-9 text-xs font-semibold shadow-[0_3px_0_0_hsl(var(--primary)/0.4)] active:shadow-none active:translate-y-0.5 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Get Help
                </>
              )}
            </Button>

            {/* Result with streaming effect */}
            {result && (
              <div
                className="p-3 bg-card rounded-xl border border-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
                role="region"
                aria-label="AI response"
              >
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/30">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded-md bg-primary/10">
                      <Brain className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-[10px] font-semibold text-foreground">AI Response</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                    aria-label="Copy response"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {result}
                  {isLoading && (
                    <span className="inline-block w-1.5 h-4 bg-primary/60 animate-pulse ml-0.5 align-middle" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIStudyHelper;
