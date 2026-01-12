import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Dna,
  Calculator,
  BookOpen,
  Globe,
  Trophy,
  Sparkles,
  History,
  LayoutDashboard,
} from "lucide-react";

// ==========================================
// 1. TYPES & DATA
// ==========================================

type Subject = "math" | "science" | "english" | "social-studies";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  subject: Subject;
  userResult?: "correct" | "wrong"; // New: Track performance
}

const SUBJECT_THEMES = {
  math: {
    bg: "bg-blue-500",
    border: "border-blue-600",
    light: "bg-blue-50",
    icon: <Calculator className="w-4 h-4" />,
    label: "Math",
  },
  science: {
    bg: "bg-emerald-500",
    border: "border-emerald-600",
    light: "bg-emerald-50",
    icon: <Dna className="w-4 h-4" />,
    label: "Science",
  },
  english: {
    bg: "bg-purple-500",
    border: "border-purple-600",
    light: "bg-purple-50",
    icon: <BookOpen className="w-4 h-4" />,
    label: "English",
  },
  "social-studies": {
    bg: "bg-amber-500",
    border: "border-amber-600",
    light: "bg-amber-50",
    icon: <Globe className="w-4 h-4" />,
    label: "Social Studies",
  },
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function QuestionOfTheDay() {
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [history, setHistory] = useState<Question[]>([]);
  const [view, setView] = useState<"game" | "history">("game");
  const [status, setStatus] = useState<"unanswered" | "correct" | "wrong">("unanswered");
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  // Load persistence
  useEffect(() => {
    const savedHistory = localStorage.getItem("edu-history");
    const savedLevel = localStorage.getItem("edu-level");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedLevel) setLevel(parseInt(savedLevel));
  }, []);

  const generateNew = useCallback(() => {
    const subs: Subject[] = ["math", "science", "english", "social-studies"];
    const sub = subs[Math.floor(Math.random() * subs.length)];
    const seed = Math.floor(Math.random() * 10000);

    // Placeholder question generator logic
    const q: Question = {
      id: `q-${seed}`,
      question: `Example ${sub.toUpperCase()} Question?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0,
      funFact: "Did you know this is a placeholder?",
      subject: sub,
    };

    setActiveQuestion(q);
    setStatus("unanswered");
    setView("game");
  }, [level]);

  useEffect(() => {
    generateNew();
  }, []);

  const handleAnswer = (idx: number) => {
    if (status !== "unanswered" || !activeQuestion) return;

    const isCorrect = idx === activeQuestion.correctIndex;
    const finalStatus = isCorrect ? "correct" : "wrong";

    setStatus(finalStatus);

    // Save to History
    const updatedQuestion = { ...activeQuestion, userResult: finalStatus };
    const newHistory = [updatedQuestion, ...history].slice(0, 20); // Keep last 20
    setHistory(newHistory);
    localStorage.setItem("edu-history", JSON.stringify(newHistory));

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
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-md">
        {/* HEADER & TOGGLE */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setView(view === "game" ? "history" : "game")}
            className="bg-white border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 p-3 rounded-2xl transition-all"
          >
            {view === "game" ? (
              <History className="w-5 h-5 text-slate-600" />
            ) : (
              <LayoutDashboard className="w-5 h-5 text-slate-600" />
            )}
          </button>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-3 w-5 rounded-full border shadow-sm transition-all",
                  i <= level ? "bg-indigo-500 border-indigo-600" : "bg-white border-slate-200",
                )}
              />
            ))}
          </div>

          <div className="bg-white border-b-4 border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange-500" />
            <span className="font-black text-slate-700">{streak}</span>
          </div>
        </div>

        {view === "game" ? (
          /* LIVE GAME CARD */
          <div
            className={cn(
              "rounded-3xl border border-b-[8px] bg-white transition-all overflow-hidden",
              status === "correct" ? "border-green-500" : status === "wrong" ? "border-red-500" : "border-slate-200",
            )}
          >
            <div className={cn("p-4 flex items-center justify-between text-white", theme.bg)}>
              <span className="flex items-center gap-2 font-black uppercase tracking-tighter text-xs">
                {theme.icon} {theme.label}
              </span>
              <Sparkles className="w-4 h-4 opacity-50" />
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 leading-tight">{activeQuestion.question}</h2>
              <div className="grid gap-3">
                {activeQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={status !== "unanswered"}
                    className={cn(
                      "p-4 rounded-2xl border-b-4 text-left font-bold transition-all active:border-b-0 active:translate-y-1",
                      status === "unanswered"
                        ? "bg-white border-slate-200 hover:border-indigo-300"
                        : i === activeQuestion.correctIndex
                          ? "bg-green-100 border-green-500 text-green-700"
                          : "bg-slate-50 border-slate-200 opacity-50",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {status !== "unanswered" && (
                <div className="mt-6 animate-in zoom-in-95">
                  <div className="bg-slate-50 border-l-4 border-indigo-400 p-3 rounded-r-xl mb-4 text-sm">
                    <span className="font-black text-indigo-400 mr-2">FACT:</span> {activeQuestion.funFact}
                  </div>
                  <Button
                    onClick={generateNew}
                    className={cn(
                      "w-full h-14 rounded-2xl text-white font-black border-b-4 active:border-b-0",
                      theme.bg,
                    )}
                  >
                    NEXT <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* PREVIOUS QUESTIONS (HISTORY) */
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest px-2">
              History (Last {history.length})
            </h3>
            {history.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border-b-4 border-slate-200 text-center">
                <p className="text-slate-400 font-bold">No questions answered yet!</p>
              </div>
            ) : (
              history.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-b-4 border-slate-200 p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl text-white", SUBJECT_THEMES[q.subject].bg)}>
                      {SUBJECT_THEMES[q.subject].icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{q.question}</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                        {SUBJECT_THEMES[q.subject].label}
                      </p>
                    </div>
                  </div>
                  {q.userResult === "correct" ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
