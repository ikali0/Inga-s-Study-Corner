import { useState } from "react";
import { Sparkles, Brain, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type AIMode = "explain" | "practice" | "quiz";

interface ModeConfig {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  description: string;
}

const modeConfigs: Record<AIMode, ModeConfig> = {
  explain: {
    label: "Explain",
    icon: <Brain className="w-4 h-4" />,
    placeholder: "e.g., How do fractions work? What is photosynthesis?",
    description: "Get simple explanations for tricky topics",
  },
  practice: {
    label: "Practice",
    icon: <Sparkles className="w-4 h-4" />,
    placeholder: "e.g., Give me 3 multiplication problems for a 4th grader",
    description: "Generate practice problems with answers",
  },
  quiz: {
    label: "Quiz Me",
    icon: <Send className="w-4 h-4" />,
    placeholder: "e.g., Quiz me on the solar system",
    description: "Test your knowledge with fun quizzes",
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

  const handleSubmit = async () => {
    const trimmedInput = input.trim();

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
    } catch (err) {
      console.error("AI Helper Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleModeChange = (newMode: AIMode) => {
    setMode(newMode);
    setError("");
    setResult("");
  };

  const config = modeConfigs[mode];

  return (
    <section className="py-8 sm:py-12 md: py-16 relative z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm: mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <Sparkles className="w-3 h-3" />
            AI-Powered Learning
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Study Helper</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Get instant help with any topic. Ask questions, practice problems, or test yourself!
          </p>
        </div>

        {/* Main Card */}
        <div className="border rounded-xl sm:rounded-2xl shadow-sm overflow-hidden bg-card border-border">
          {/* Mode Tabs */}
          <div className="flex border-b border-border bg-muted/30">
            {(Object.keys(modeConfigs) as AIMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                disabled={isLoading}
                className={`flex-1 py-3 px-2 sm: px-4 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                  mode === m
                    ? "bg-card text-primary border-b-2 border-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
                aria-label={`${modeConfigs[m].label} mode`}
                aria-current={mode === m ? "page" : undefined}
              >
                {modeConfigs[m].icon}
                <span className="hidden sm:inline">{modeConfigs[m].label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6 space-y-4 bg-card">
            {/* Mode Description */}
            <p className="text-xs text-muted-foreground italic">{config.description}</p>

            {/* Grade Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground">Grade Level:</span>
              {gradeOptions.map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  disabled={isLoading}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    grade === g
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                  aria-label={`Grade ${g}`}
                  aria-pressed={grade === g}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Input */}
            <div>
              <label htmlFor="study-input" className="sr-only">
                {config.label} input
              </label>
              <Textarea
                id="study-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={config.placeholder}
                className="min-h-[80px] resize-none text-sm"
                disabled={isLoading}
                aria-describedby="input-hint"
                maxLength={500}
              />
              <p id="input-hint" className="text-xs text-muted-foreground mt-1">
                Press Ctrl+Enter to submit • {input.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="w-full h-10 text-sm font-semibold"
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
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive"
                role="alert"
                aria-live="polite"
              >
                <strong className="font-semibold">Error:</strong> {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div
                className="p-4 bg-muted/50 rounded-lg border border-border animate-in fade-in slide-in-from-bottom-2 duration-300"
                role="region"
                aria-label="AI response"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">AI Response</span>
                </div>
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{result}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIStudyHelper;
