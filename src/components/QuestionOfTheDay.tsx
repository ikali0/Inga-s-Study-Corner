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
  History as HistoryIcon,
  LayoutDashboard,
  Trash2,
} from "lucide-react";

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
  userResult?: "correct" | "wrong";
}

const SUBJECT_THEMES = {
  math: { bg: "bg-blue-500", icon: <Calculator className="w-4 h-4" />, label: "Math" },
  science: { bg: "bg-emerald-500", icon: <Dna className="w-4 h-4" />, label: "Science" },
  english: { bg: "bg-purple-500", icon: <BookOpen className="w-4 h-4" />, label: "English" },
  "social-studies": { bg: "bg-amber-500", icon: <Globe className="w-4 h-4" />, label: "History & Civics" },
};

// --- DATA BANKS ---

const generateMath = (seed: number, level: number) => {
  const range = level * 12;
  const a = (seed % range) + 2;
  const b = (seed % 10) + 2;

  if (level > 3 && seed % 2 === 0) {
    const pct = [10, 20, 25, 50][seed % 4];
    const val = a * 10;
    return {
      q: `What is ${pct}% of ${val}?`,
      a: ((val * pct) / 100).toString(),
      d: [(val / 2).toString(), (val / 4).toString(), (val / 10).toString()],
      f: "Percent means 'per hundred' in Latin!",
    };
  }

  return {
    q: `Solve: ${a} × ${b} + ${level}`,
    a: (a * b + level).toString(),
    d: [(a * b).toString(), (a + b).toString(), (a * b - level).toString()],
    f: "The equals sign (=) was invented in 1557.",
  };
};

const getEnglish = (seed: number, level: number) => {
  const bank = [
    { q: "Which is a NOUN?", a: "Happiness", d: ["Quickly", "Run", "Blue"], lv: 1 },
    { q: "Antonym of 'Vivid'?", a: "Dull", d: ["Bright", "Shiny", "Detailed"], lv: 3 },
    {
      q: "Identify the 'Metaphor'.",
      a: "Time is a thief",
      d: ["Quiet as a mouse", "The sun is hot", "I am tired"],
      lv: 4,
    },
  ];
  const filtered = bank.filter((i) => i.lv <= level) || [bank[0]];
  return filtered[seed % filtered.length];
};

const getSocial = (seed: number, level: number) => {
  const bank = [
    { q: "Smallest continent?", a: "Australia", d: ["Europe", "Antarctica", "Asia"], lv: 1 },
    { q: "Year of the Magna Carta?", a: "1215", d: ["1776", "1066", "1492"], lv: 5 },
    {
      q: "Who wrote the Declaration of Independence?",
      a: "Thomas Jefferson",
      d: ["George Washington", "Ben Franklin", "Abraham Lincoln"],
      lv: 3,
    },
  ];
  const filtered = bank.filter((i) => i.lv <= level) || [bank[0]];
  return filtered[seed % filtered.length];
};

const getScience = (seed: number, level: number) => {
  const bank = [
    { q: "Closest planet to the Sun?", a: "Mercury", d: ["Venus", "Mars", "Earth"], lv: 1 },
    { q: "Chemical symbol for Gold?", a: "Au", d: ["Ag", "Fe", "Gd"], lv: 4 },
    { q: "Main gas in Earth's atmosphere?", a: "Nitrogen", d: ["Oxygen", "Carbon", "Hydrogen"], lv: 3 },
  ];
  const filtered = bank.filter((i) => i.lv <= level) || [bank[0]];
  return filtered[seed % filtered.length];
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

  const generateNew = useCallback(() => {
    const subjects: Subject[] = ["math", "english", "social-studies", "science"];
    const sub = subjects[Math.floor(Math.random() * subjects.length)];
    const seed = Math.floor(Math.random() * 1000);

    let data: any;
    if (sub === "math") data = generateMath(seed, level);
    else if (sub === "english") data = getEnglish(seed, level);
    else if (sub === "social-studies") data = getSocial(seed, level);
    else data = getScience(seed, level);

    const options = [data.a, ...data.d].sort(() => Math.random() - 0.5);

    setActiveQuestion({
      id: `q-${Date.now()}`,
      question: data.q,
      options,
      correctIndex: options.indexOf(data.a),
      funFact: data.f || "Learning new things creates new connections in your brain!",
      subject: sub,
    });

    setStatus("unanswered");
    setView("game");
  }, [level]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("edu-history");
    const savedLevel = localStorage.getItem("edu-level");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedLevel) setLevel(parseInt(savedLevel));
    generateNew();
  }, []);

  const handleAnswer = (idx: number) => {
    if (status !== "unanswered" || !activeQuestion) return;
    const isCorrect = idx === activeQuestion.correctIndex;
    const finalStatus: "correct" | "wrong" = isCorrect ? "correct" : "wrong";

    setStatus(finalStatus);

    const updated: Question = { ...activeQuestion, userResult: finalStatus };
    const newHistory = [updated, ...history].slice(0, 15);
    setHistory(newHistory);
    localStorage.setItem("edu-history", JSON.stringify(newHistory));

    if (isCorrect) {
      setStreak((s) => s + 1);
      if (streak % 2 === 1) setLevel((l) => Math.min(l + 1, 5));
    } else {
      setStreak(0);
      setLevel((l) => Math.max(1, l - 1));
    }
  };

  if (!activeQuestion) return null;
  const theme = SUBJECT_THEMES[activeQuestion.subject];

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center select-none font-sans">
      <div className="w-full max-w-md">
        {/* NAV & LEVEL */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setView(view === "game" ? "history" : "game")}
            className="bg-white border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 p-3 rounded-2xl shadow-sm"
          >
            {view === "game" ? (
              <HistoryIcon className="w-5 h-5 text-slate-600" />
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
          <div className="bg-white border-b-4 border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm font-black text-slate-700">
            <Trophy className="w-4 h-4 text-orange-500" /> {streak}
          </div>
        </div>

        {view === "game" ? (
          <div
            className={cn(
              "rounded-[2.5rem] border-t border-x border-b-[10px] bg-white transition-all overflow-hidden shadow-xl",
              status === "correct" ? "border-green-500" : status === "wrong" ? "border-red-500" : "border-slate-200",
            )}
          >
            <div
              className={cn(
                "p-5 flex items-center justify-between text-white font-black uppercase tracking-widest text-[10px]",
                theme.bg,
              )}
            >
              <span className="flex items-center gap-2">
                {theme.icon} {theme.label}
              </span>
              <Sparkles className="w-4 h-4 opacity-40" />
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-8 leading-tight">
                {activeQuestion.question}
              </h2>
              <div className="grid gap-3">
                {activeQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={status !== "unanswered"}
                    className={cn(
                      "p-5 rounded-2xl border-x border-t border-b-4 text-left font-bold transition-all active:border-b-0 active:translate-y-1",
                      status === "unanswered"
                        ? "bg-white border-slate-200 hover:border-indigo-300 shadow-sm"
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
                  <div className="bg-slate-50 border-l-4 border-indigo-400 p-4 rounded-r-2xl mb-6 text-sm text-slate-600 italic font-medium">
                    "{activeQuestion.funFact}"
                  </div>
                  <Button
                    onClick={generateNew}
                    className={cn(
                      "w-full h-16 rounded-2xl text-white font-black text-lg border-b-8 active:border-b-0 active:translate-y-1 shadow-lg",
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
          /* HISTORY VIEW */
          <div className="space-y-4 animate-in fade-in pb-10">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Recent Progress</h3>
              <button
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem("edu-history");
                }}
                className="text-red-400 font-black uppercase text-[10px] flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            {history.map((q, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-b-4 border-slate-200 p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-2.5 rounded-xl text-white shadow-sm", SUBJECT_THEMES[q.subject].bg)}>
                    {SUBJECT_THEMES[q.subject].icon}
                  </div>
                  <div className="max-w-[180px]">
                    <p className="text-sm font-bold text-slate-700 truncate">{q.question}</p>
                    <p className="text-[9px] font-black uppercase text-slate-400">{SUBJECT_THEMES[q.subject].label}</p>
                  </div>
                </div>
                {q.userResult === "correct" ? (
                  <CheckCircle className="text-green-500 w-6 h-6" />
                ) : (
                  <XCircle className="text-red-400 w-6 h-6" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
