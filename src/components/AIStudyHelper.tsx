import { useState } from "react";
import { Sparkles, Brain, BookOpen, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIInput } from "@/components/ui/ai-input";
import { supabase } from "@/integrations/supabase/client";

type AIMode = "explain" | "practice" | "quiz";

interface ModeConfig {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  description: string;
  color: string;
}

const modeConfigs: Record<AIMode, ModeConfig> = {
  explain: {
    label: "Explain",
    icon: <Brain className="w-4 h-4" />,
    placeholder: "e.g., How do fractions work? What is photosynthesis?",
    description: "Get simple explanations for tricky topics",
    color: "from-primary/20 to-primary/5",
  },
  practice: {
    label: "Practice",
    icon: <BookOpen className="w-4 h-4" />,
    placeholder: "e.g., Give me 3 multiplication problems for a 4th grader",
    description: "Generate practice problems with answers",
    color: "from-secondary/20 to-secondary/5",
  },
  quiz: {
    label: "Quiz Me",
    icon: <HelpCircle className="w-4 h-4" />,
    placeholder: "e.g., Quiz me on the solar system",
    description: "Test your knowledge with fun quizzes",
    color: "from-accent/20 to-accent/5",
  },
};

const gradeOptions = ["K-2", "3-5", "6-8", "9-12"] as const;

const AIStudyHelper = () => {
  const [mode, setMode] = useState<AIMode>("explain");
  const [input, setInput] = useState("");
  const [grade, setGrade] = useState<string>("3-5");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (value?: string) => {
    const trimmedInput = (value ?? input).trim();

    if (!trimmedInput) {
      setError("Please enter a question or topic.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-study-helper", {
        body: {
          mode,
          input: trimmedInput,
          grade,
        },
      });

      if (fnError) {
        throw new Error(fnError.message || "Failed to get AI response");
      }

      if (!data?.result) {
        throw new Error("No response received from AI");
      }

      setResult(data.result);
      setInput(""); // Clear input on success
    } catch (err) {
      console.error("AI Helper Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: AIMode) => {
    setMode(newMode);
    setError("");
    setResult("");
  };

  const config = modeConfigs[mode];

  return (
    <section className="py-8 sm:py-12 md:py-16 relative z-10" id="tools">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/15 to-secondary/10 text-primary text-xs font-bold mb-3 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Learning
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
            Study Helper
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Get instant help with any topic. Ask questions, practice problems, or test yourself!
          </p>
        </div>

        {/* Main Card */}
        <div className="card-3d rounded-2xl overflow-hidden">
          {/* Mode Tabs */}
          <div className="flex border-b border-border/50 bg-muted/20">
            {(Object.keys(modeConfigs) as AIMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                disabled={isLoading}
                className={`flex-1 py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                  mode === m
                    ? "bg-card text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                }`}
                aria-label={`${modeConfigs[m].label} mode`}
                aria-current={mode === m ? "page" : undefined}
              >
                {modeConfigs[m].icon}
                <span className="hidden sm:inline">{modeConfigs[m].label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className={`p-4 sm:p-6 space-y-4 bg-gradient-to-b ${config.color}`}>
            {/* Mode Description */}
            <p className="text-xs text-muted-foreground italic text-center">
              {config.description}
            </p>

            {/* Grade Selector */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs font-medium text-muted-foreground">Grade:</span>
              <div className="flex gap-1.5">
                {gradeOptions.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    disabled={isLoading}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      grade === g
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                    }`}
                    aria-label={`Grade ${g}`}
                    aria-pressed={grade === g}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Input */}
            <AIInput
              id="study-input"
              placeholder={config.placeholder}
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              minHeight={60}
              maxHeight={150}
              maxLength={500}
            />

            {/* Submit Button */}
            <Button
              onClick={() => handleSubmit()}
              disabled={isLoading || !input.trim()}
              className="w-full h-10 text-sm font-semibold btn-3d"
              aria-label="Get AI help"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Help
                </>
              )}
            </Button>

            {/* Error */}
            {error && (
              <div
                className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive"
                role="alert"
                aria-live="polite"
              >
                <strong className="font-semibold">Oops!</strong> {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div
                className="p-4 bg-card rounded-xl border border-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
                role="region"
                aria-label="AI response"
              >
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">AI Response</span>
                </div>
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {result}
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
