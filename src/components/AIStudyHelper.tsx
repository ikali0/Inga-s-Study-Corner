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
  color?: string; // optional color for tabs
}

const modeConfigs: Record<AIMode, ModeConfig> = {
  explain: {
    label: "Explain",
    icon: <Brain className="w-4 h-4" />,
    placeholder: "e.g., How do fractions work? What is photosynthesis?",
    description: "Get simple explanations for tricky topics",
    color: "bg-blue-100/80",
  },
  practice: {
    label: "Practice",
    icon: <Sparkles className="w-4 h-4" />,
    placeholder: "e.g., Give me 3 multiplication problems for a 4th grader",
    description: "Generate practice problems with answers",
    color: "bg-green-100/80",
  },
  quiz: {
    label: "Quiz Me",
    icon: <Send className="w-4 h-4" />,
    placeholder: "e.g., Quiz me on the solar system",
    description: "Test your knowledge with fun quizzes",
    color: "bg-purple-100/80",
  },
};

const gradeOptions = ["K-2", "3-5", "6-8"];

const AIStudyHelper: React.FC = () => {
  const [mode, setMode] = useState<AIMode>("explain");
  const [input, setInput] = useState("");
  const [grade, setGrade] = useState("3-5");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError("");
    setResult("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-study-helper", {
        body: { mode, input: input.trim(), grade },
      });
      if (fnError) throw fnError;
      setResult(data?.result || "No response received.");
    } catch (err) {
      console.error("AI Helper Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const config = modeConfigs[mode];

  return (
    <section className="py-8 sm:py-12 md:py-16 relative z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <Sparkles className="w-3 h-3" />
            AI-Powered Learning
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Study Helper</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Get instant help with any topic. Ask questions, practice problems, or test yourself!
          </p>
        </div>

        {/* Card */}
        <div className="border rounded-xl sm:rounded-2xl shadow-sm overflow-hidden bg-white border-border">
          {/* Mode Tabs */}
          <div className="flex border-b border-border">
            {(Object.keys(modeConfigs) as AIMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setMode(m);
                }}
                className={`flex-1 py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  mode === m
                    ? `bg-primary/10 text-primary border-b-2 border-primary`
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
                aria-label={`Switch to ${modeConfigs[m].label} mode`}
              >
                {modeConfigs[m].icon}
                <span className="hidden sm:inline">{modeConfigs[m].label}</span>
              </button>
            ))}
          </div>

          {/* Body */}
          <div className={`p-4 sm:p-6 space-y-4 ${config.color || "bg-blue-50/50"}`}>
            {/* Grade Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground">Grade:</span>
              {gradeOptions.map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    grade === g
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  aria-label={`Select grade ${g}`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Input */}
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={config.placeholder}
              className="min-h-[80px] resize-none text-sm"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              aria-label="Ask a question or request practice/quiz"
            />

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="w-full h-10 text-sm font-semibold flex items-center justify-center"
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
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
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
