import { useState, useCallback, memo, useRef, useEffect } from "react";
import { Sparkles, Brain, BookOpen, HelpCircle, Loader2, Lightbulb, Copy, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIInput } from "@/components/ui/ai-input";
import { toast } from "sonner";
type AIMode = "explain" | "practice" | "quiz";
interface ModeConfig {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  description: string;
  color: string;
  iconBg: string;
  activeBorder: string;
  suggestions: string[];
}
const modeConfigs: Record<AIMode, ModeConfig> = {
  explain: {
    label: "Explain",
    icon: <Brain className="w-3.5 h-3.5" />,
    placeholder: "How do fractions work?",
    description: "Simple explanations for tricky topics",
    color: "text-blue",
    iconBg: "bg-blue/10",
    activeBorder: "border-blue",
    suggestions: ["Photosynthesis", "Gravity", "Fractions"]
  },
  practice: {
    label: "Practice",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    placeholder: "Multiplication for 4th graders",
    description: "Fun problems with answers",
    color: "text-green",
    iconBg: "bg-green/10",
    activeBorder: "border-green",
    suggestions: ["Long division", "Algebra basics", "Word problems"]
  },
  quiz: {
    label: "Quiz",
    icon: <HelpCircle className="w-3.5 h-3.5" />,
    placeholder: "Quiz me on the solar system",
    description: "Test your knowledge",
    color: "text-orange",
    iconBg: "bg-orange/10",
    activeBorder: "border-orange",
    suggestions: ["US States", "Animal kingdom", "Chemistry"]
  }
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
}) => <button type="button" onClick={onClick} disabled={disabled} className="px-2.5 py-1 text-[10px] sm:text-[11px] font-medium bg-card/80 backdrop-blur-sm border border-border/50 rounded-full text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">
    {text}
  </button>);
SuggestionChip.displayName = "SuggestionChip";
const AIStudyHelper = () => {
  const [mode, setMode] = useState<AIMode>("explain");
  const [input, setInput] = useState("");
  const [grade, setGrade] = useState<string>("3-5");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [gradientPhase, setGradientPhase] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Animated gradient effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const gradientClasses = ["from-primary/10 via-blue/5 to-purple/10", "from-purple/10 via-primary/5 to-green/10", "from-green/10 via-orange/5 to-blue/10", "from-blue/10 via-primary/5 to-orange/10"];
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
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-study-helper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          mode,
          input: trimmedInput,
          grade,
          stream: true
        }),
        signal: abortControllerRef.current.signal
      });
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
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, {
          stream: true
        });

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
          } catch {/* ignore */}
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
  return <section className="py-10 sm:py-14 md:py-20 lg:py-24 relative overflow-hidden" id="tools">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradientPhase]} transition-all duration-[2000ms] ease-in-out`} />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/40" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-5 sm:left-20 w-24 h-24 sm:w-40 sm:h-40 bg-primary/8 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-5 sm:right-20 w-32 h-32 sm:w-56 sm:h-56 bg-purple/8 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-blue/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Two-column layout on desktop */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          
          {/* Left side - Header content */}
          <div className="text-center lg:text-left lg:flex-1 lg:pt-8 mb-6 sm:mb-8 lg:mb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-primary/20 text-primary text-[10px] sm:text-xs font-bold mb-3 sm:mb-4 shadow-lg">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-primary" />
              AI Study Helper
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3 sm:mb-4">
              Get <span className="text-primary bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">Instant Help</span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="text-foreground">With AI</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto lg:mx-0 mb-4 lg:mb-6">Ask questions, practice problems, or take quick quizzes — our other focus is helping students integrate with AI.</p>
            
            {/* Feature badges - visible on larger screens */}
            <div className="hidden lg:flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue/10 border border-blue/20 rounded-full text-[11px] font-medium text-blue">
                <Brain className="w-3.5 h-3.5" /> Smart Explanations
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green/10 border border-green/20 rounded-full text-[11px] font-medium text-green">
                <Zap className="w-3.5 h-3.5" /> Instant Answers
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange/10 border border-orange/20 rounded-full text-[11px] font-medium text-orange">
                <HelpCircle className="w-3.5 h-3.5" /> Interactive Quizzes
              </div>
            </div>
          </div>

          {/* Right side - Main Card */}
          <div className="w-full max-w-md sm:max-w-lg lg:w-[480px] xl:w-[520px] mx-auto lg:mx-0 lg:shrink-0">
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border/60 shadow-xl overflow-hidden">
              {/* Mode Tabs */}
              <div className="flex border-b border-border/40 bg-muted/20">
                {(Object.keys(modeConfigs) as AIMode[]).map(m => {
                const modeConfig = modeConfigs[m];
                return <button key={m} onClick={() => handleModeChange(m)} disabled={isLoading} className={`flex-1 py-3 sm:py-3.5 px-2 text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 ${mode === m ? `bg-card ${modeConfig.color} border-b-2 ${modeConfig.activeBorder} -mb-px` : "text-muted-foreground hover:bg-card/50 hover:text-foreground"}`} aria-current={mode === m ? "page" : undefined}>
                      <span className={mode === m ? modeConfig.iconBg + " p-1 rounded-md" : ""}>
                        {modeConfig.icon}
                      </span>
                      {modeConfig.label}
                    </button>;
              })}
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6 space-y-4 bg-gradient-to-b from-card to-muted/20">
                {/* Description + Grade Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className={`text-[11px] sm:text-xs font-medium flex items-center gap-1.5 ${config.color}`}>
                    <span className={`p-1 rounded-md ${config.iconBg}`}>
                      <Lightbulb className="w-3 h-3" />
                    </span>
                    {config.description}
                  </p>
                  
                  <div className="flex items-center gap-1 bg-muted/40 rounded-full p-0.5">
                    {gradeOptions.map(g => <button key={g} onClick={() => setGrade(g)} disabled={isLoading} className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-medium rounded-full transition-all disabled:opacity-50 ${grade === g ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                        {g}
                      </button>)}
                  </div>
                </div>

                {/* Quick Suggestions */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-medium">Try:</span>
                  {config.suggestions.map(s => <SuggestionChip key={s} text={s} onClick={() => handleSuggestionClick(s)} disabled={isLoading} />)}
                </div>

                {/* AI Input */}
                <AIInput id="study-input" placeholder={config.placeholder} value={input} onChange={setInput} onSubmit={handleSubmit} isLoading={isLoading} minHeight={52} maxHeight={140} maxLength={400} />

                {/* Submit Button */}
                <Button onClick={() => handleSubmit()} disabled={isLoading || !input.trim()} size="default" className="w-full h-10 sm:h-11 text-xs sm:text-sm font-bold shadow-[0_4px_0_0_hsl(var(--primary)/0.3)] active:shadow-none active:translate-y-0.5 transition-all">
                  {isLoading ? <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Thinking...
                    </> : <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get Help
                    </>}
                </Button>

                {/* Result with streaming effect */}
                {result && <div className="p-4 bg-card rounded-xl border border-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300" role="region" aria-label="AI response">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/30">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Brain className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">AI Response</span>
                      </div>
                      <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="Copy response">
                        {copied ? <Check className="w-4 h-4 text-green" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                      </button>
                    </div>
                    <div className="text-sm sm:text-base text-foreground whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                      {result}
                      {isLoading && <span className="inline-block w-2 h-5 bg-primary/60 animate-pulse ml-0.5 align-middle rounded-sm" />}
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default AIStudyHelper;