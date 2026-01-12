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
  Trash2,
} from "lucide-react";

// ==========================================
// 1. TYPES & DATA
// ==========================================

type Subject = "math" | "science" | "english" | "social-studies";

// Interface must match exactly what we store in history
interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  subject: Subject;
  userResult?: "correct" | "wrong"; // Union of literal strings
}

const SUBJECT_THEMES = {
  math: { bg: "bg-blue-500", border: "border-blue-600", icon: <Calculator className="w-4 h-4" />, label: "Math" },
  science: { bg: "bg-emerald-500", border: "border-emerald-600", icon: <Dna className="w-4 h-4" />, label: "Science" },
  english: {
    bg: "bg-purple-500",
    border: "border-purple-600",
    icon: <BookOpen className="w-4 h-4" />,
    label: "English",
  },
  "social-studies": {
    bg: "bg-amber-500",
    border: "border-amber-600",
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

    // Logic to generate questions based on subject/level
    const q: Question = {
      id: `q-${seed}`,
      question: sub === "math" ? `Solve: ${seed % 10} + ${level * 5}` : `Is ${sub} fun?`,
      options: sub === "math" ? [`${(seed % 10) + level * 5}`, "10", "15", "20"] : ["Yes", "Maybe", "No", "Always"],
      correctIndex: 0,
      funFact: `Level ${level} ${sub} is great for your brain!`,
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

    // FIX: Explicitly type finalStatus to match the "correct" | "wrong" literal union
    const finalStatus: "correct" | "wrong" = isCorrect ? "correct" : "wrong";

    setStatus(finalStatus);

    // Save to History
    const updatedQuestion: Question = { ...activeQuestion, userResult: finalStatus };
    const newHistory = [updatedQuestion, ...history].slice(0, 20);
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

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("edu-history");
  };

  if (!activeQuestion) return null;
  const theme = SUBJECT_THEMES[activeQuestion.subject];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 flex flex-col items-center font-sans select-none">
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setView(view === "game" ? "history" : "game")}
            className="bg-white border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 p-3 rounded-2xl transition-all shadow-sm"
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

          <div className="bg-white border-b-4 border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
            <Trophy className="w-4 h-4 text-orange-500" />
            <span className="font-black text-slate-700">{streak}</span>
          </div>
        </div>

        {view === "game" ? (
          /* LIVE GAME CARD */
          <div
            className={cn(
              "rounded-[2.5rem] border-x border-t border-b-[10px] bg-white transition-all duration-300 overflow-hidden shadow-xl",
              status === "correct" ? "border-green-500" : status === "wrong" ? "border-red-500" : "border-slate-200",
            )}
          >
            <div className={cn("p-5 flex items-center justify-between text-white", theme.bg)}>
              <span className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
                {theme.icon} {theme.label}
              </span>
              <Sparkles className="w-4 h-4 opacity-40" />
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-8 leading-[1.2]">
                {activeQuestion.question}
              </h2>
              <div className="grid gap-3">
                {activeQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={status !== "unanswered"}
                    className={cn(
                      "p-5 rounded-2xl border-x border-t border-b-4 text-left font-bold text-base transition-all active:border-b-0 active:translate-y-1 active:shadow-inner",
                      status === "unanswered"
                        ? "bg-white border-slate-200 hover:border-indigo-300 text-slate-700 shadow-sm"
                        : i === activeQuestion.correctIndex
                          ? "bg-green-100 border-green-500 text-green-700"
                          : "bg-slate-50 border-slate-100 opacity-40 text-slate-400",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {status !== "unanswered" && (
                <div className="mt-8 animate-in slide-in-from-bottom-2 duration-500">
                  <div className="bg-slate-50 border-l-4 border-indigo-400 p-4 rounded-r-2xl mb-6 text-sm">
                    <p className="text-slate-600 italic font-medium">"{activeQuestion.funFact}"</p>
                  </div>
                  <Button
                    onClick={generateNew}
                    className={cn(
                      "w-full h-16 rounded-2xl text-white font-black text-lg border-b-8 active:border-b-0 active:translate-y-1 transition-all shadow-lg",
                      theme.bg,
                    )}
                  >
                    NEXT CHALLENGE <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* PREVIOUS QUESTIONS (HISTORY) */
          <div className="space-y-4 animate-in fade-in duration-500 pb-10">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Recent Activity</h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-red-400 hover:text-red-500 flex items-center gap-1 text-[10px] font-black uppercase"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] border-b-4 border-slate-200 text-center shadow-sm">
                <p className="text-slate-400 font-bold">Your journey begins here!</p>
              </div>
            ) : (
              history.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-b-4 border-slate-200 p-4 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2.5 rounded-xl text-white shadow-sm", SUBJECT_THEMES[q.subject].bg)}>
                      {SUBJECT_THEMES[q.subject].icon}
                    </div>
                    <div className="max-w-[180px]">
                      <p className="text-sm font-bold text-slate-700 truncate">{q.question}</p>
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                        {SUBJECT_THEMES[q.subject].label}
                      </p>
                    </div>
                  </div>
                  {q.userResult === "correct" ? (
                    <div className="bg-green-100 p-1.5 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ) : (
                    <div className="bg-red-50 p-1.5 rounded-full">
                      <XCircle className="w-5 h-5 text-red-400" />
                    </div>
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
