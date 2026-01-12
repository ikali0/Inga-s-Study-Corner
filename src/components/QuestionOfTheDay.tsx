import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, Dna, Calculator, BookOpen, Globe, Trophy, Sparkles } from "lucide-react";

// ==========================================
// 1. TYPES & DATA GENERATORS
// ==========================================

type Subject = "math" | "science" | "english" | "social-studies";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  subject: Subject;
}

const SUBJECT_THEMES = {
  math: {
    bg: "bg-blue-500",
    card: "border-blue-200 bg-blue-50",
    btn: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200",
    icon: <Calculator className="w-4 h-4" />,
    label: "Math",
  },
  science: {
    bg: "bg-emerald-500",
    card: "border-emerald-200 bg-emerald-50",
    btn: "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200",
    icon: <Dna className="w-4 h-4" />,
    label: "Science",
  },
  english: {
    bg: "bg-purple-500",
    card: "border-purple-200 bg-purple-50",
    btn: "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200",
    icon: <BookOpen className="w-4 h-4" />,
    label: "English",
  },
  "social-studies": {
    bg: "bg-amber-500",
    card: "border-amber-200 bg-amber-50",
    btn: "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200",
    icon: <Globe className="w-4 h-4" />,
    label: "Social Studies",
  },
};

// ... (Internal generators remain the same as previous stable version)
function createQuestionObj(
  id: string,
  q: string,
  a: string,
  meta: [string, Subject],
  level: number,
  distractors?: string[],
): Question {
  const options = distractors
    ? [a, ...distractors]
    : [a, (parseFloat(a) + 2).toString(), (parseFloat(a) - 1).toString(), (parseFloat(a) * 2).toString()];
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  return { id, question: q, options: shuffled, correctIndex: shuffled.indexOf(a), funFact: meta[0], subject: meta[1] };
}

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function QuestionOfTheDay() {
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [status, setStatus] = useState<"unanswered" | "correct" | "wrong">("unanswered");
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  const generateNew = useCallback(() => {
    const subs: Subject[] = ["math", "science", "english", "social-studies"];
    const sub = subs[Math.floor(Math.random() * subs.length)];
    const seed = Math.floor(Math.random() * 10000);

    // Simple mock logic for questions (replace with your specific generators)
    const q = createQuestionObj(`q-${seed}`, "Which is correct?", "Correct", ["Fact", sub], level, [
      "Wrong 1",
      "Wrong 2",
      "Wrong 3",
    ]);
    setActiveQuestion(q);
    setStatus("unanswered");
  }, [level]);

  useEffect(() => {
    generateNew();
  }, []);

  const handleAnswer = (idx: number) => {
    if (status !== "unanswered") return;
    const isCorrect = idx === activeQuestion?.correctIndex;
    setStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setStreak((s) => s + 1);
      setLevel((l) => Math.min(l + 1, 5));
    } else {
      setStreak(0);
      setLevel((l) => Math.max(1, l - 1));
    }
  };

  if (!activeQuestion) return null;
  const theme = SUBJECT_THEMES[activeQuestion.subject];

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-md">
        {/* TOP STATUS BAR (3D STICKY) */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-3 w-6 rounded-full border shadow-sm transition-all",
                  i <= level ? theme.bg : "bg-white border-slate-200",
                )}
              />
            ))}
          </div>
          <div className="bg-white border border-b-4 border-slate-200 px-3 py-1 rounded-2xl flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange-500" />
            <span className="font-black text-slate-700">{streak}</span>
          </div>
        </div>

        {/* MAIN QUESTION CARD */}
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-b-[8px] transition-all duration-300",
            status === "correct"
              ? "border-green-500 bg-white"
              : status === "wrong"
                ? "border-red-500 bg-white"
                : "border-slate-200 bg-white",
          )}
        >
          {/* VIBRANT SUBJECT HEADER */}
          <div className={cn("p-4 flex items-center justify-between text-white", theme.bg)}>
            <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-sm">
              {theme.icon} {theme.label}
            </div>
            <Sparkles className="w-4 h-4 opacity-50" />
          </div>

          <div className="p-5 sm:p-7">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 leading-tight">
              {activeQuestion.question}
            </h2>

            {/* 3D OPTIONS LIST */}
            <div className="grid gap-3">
              {activeQuestion.options.map((opt, i) => {
                const isCorrect = i === activeQuestion.correctIndex;
                const isSelected = status !== "unanswered" && i === activeQuestion.correctIndex;

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={status !== "unanswered"}
                    className={cn(
                      "relative p-4 rounded-2xl border text-left font-bold transition-all transform active:translate-y-1 active:border-b-0",
                      status === "unanswered"
                        ? "bg-white border-slate-200 border-b-4 hover:border-indigo-400 text-slate-700"
                        : isCorrect
                          ? "bg-green-100 border-green-500 border-b-4 text-green-700"
                          : "bg-slate-50 border-slate-200 opacity-50 text-slate-400",
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg">{opt}</span>
                      {status !== "unanswered" && isCorrect && <CheckCircle className="w-5 h-5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* FEEDBACK & ACTION */}
            {status !== "unanswered" && (
              <div className="mt-6 space-y-4 animate-in zoom-in-95">
                <div className={cn("p-4 rounded-2xl border-l-4", theme.card)}>
                  <p className="text-xs font-black uppercase text-slate-400 mb-1">Quick Fact</p>
                  <p className="text-sm font-medium text-slate-700">{activeQuestion.funFact}</p>
                </div>

                <Button
                  onClick={generateNew}
                  className={cn(
                    "w-full h-14 rounded-2xl text-white font-black text-lg border-b-4 active:border-b-0 transition-all",
                    theme.bg,
                    "hover:brightness-110",
                  )}
                >
                  NEXT CHALLENGE <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
