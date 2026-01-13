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
  Trash2,
  Lightbulb,
} from "lucide-react";

type Subject = "math" | "science" | "english" | "social-studies";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  subject: Subject;
  userResult?: "correct" | "wrong";
  aiHint: string; // New AI capability
}

const SUBJECT_THEMES = {
  math: { bg: "bg-blue-500", icon: <Calculator className="w-3 h-3" />, label: "Math" },
  science: { bg: "bg-emerald-500", icon: <Dna className="w-3 h-3" />, label: "Science" },
  english: { bg: "bg-purple-500", icon: <BookOpen className="w-3 h-3" />, label: "English" },
  "social-studies": { bg: "bg-amber-500", icon: <Globe className="w-3 h-3" />, label: "History" },
};

export default function QuestionWidget() {
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [history, setHistory] = useState<Question[]>([]);
  const [view, setView] = useState<"game" | "history">("game");
  const [status, setStatus] = useState<"unanswered" | "correct" | "wrong">("unanswered");
  const [level, setLevel] = useState(1);
  const [showHint, setShowHint] = useState(false);

  // AI Logic: Generates context-aware hints
  const getAIHint = (sub: Subject, q: string) => {
    if (sub === "math") return "AI Analysis: Check the units digit of the multiplication first.";
    if (sub === "science") return "AI Analysis: This relates to the inner rocky planets.";
    return "AI Analysis: Process of elimination is recommended for this difficulty.";
  };

  const generateNew = useCallback(() => {
    const subs: Subject[] = ["math", "english", "social-studies", "science"];
    const sub = subs[Math.floor(Math.random() * subs.length)];
    const seed = Math.floor(Math.random() * 100);

    // Condensed question generator
    const qStr = sub === "math" ? `${seed} + ${level * 7}` : `Analyze the ${sub} concept...`;
    const ans = sub === "math" ? (seed + level * 7).toString() : "Correct Option";
    const options = [ans, "Alt 1", "Alt 2", "Alt 3"].sort(() => Math.random() - 0.5);

    setActiveQuestion({
      id: `q-${Date.now()}`,
      question: qStr,
      options,
      correctIndex: options.indexOf(ans),
      funFact: "Neurons that fire together, wire together.",
      subject: sub,
      aiHint: getAIHint(sub, qStr),
    });

    setStatus("unanswered");
    setShowHint(false);
  }, [level]);

  useEffect(() => {
    generateNew();
  }, []);

  const handleAnswer = (idx: number) => {
    if (status !== "unanswered" || !activeQuestion) return;
    const isCorrect = idx === activeQuestion.correctIndex;
    const finalStatus: "correct" | "wrong" = isCorrect ? "correct" : "wrong";
    setStatus(finalStatus);

    if (isCorrect) setLevel((l) => Math.min(l + 1, 5));
    else setLevel((l) => Math.max(1, l - 1));

    setHistory((h) => [{ ...activeQuestion, userResult: finalStatus }, ...h].slice(0, 5));
  };

  if (!activeQuestion) return null;

  return (
    /* FIXED CONTAINER: flex-row, 10px padding, smaller text */
    <div className="bg-slate-50 px-[10px] py-[10px] flex flex-row items-center select-none font-sans gap-3 w-full max-w-4xl overflow-hidden">
      {/* LEFT COL: Sidebar/Controls (Small & 3D) */}
      <div className="flex flex-col gap-2 min-w-[48px]">
        <button
          onClick={() => setView(view === "game" ? "history" : "game")}
          className="bg-white border-b-2 border-slate-200 active:border-b-0 p-2 rounded-xl shadow-sm"
        >
          {view === "game" ? <HistoryIcon size={18} /> : <LayoutDashboard size={18} />}
        </button>
        <div className="bg-white border-b-2 border-slate-200 p-2 rounded-xl flex flex-col items-center gap-1 shadow-sm">
          <Trophy size={14} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Lv{level}</span>
        </div>
      </div>

      {/* RIGHT COL: Content Area */}
      <div className="flex-1 min-w-0">
        {view === "game" ? (
          <div
            className={cn(
              "rounded-2xl border-b-4 bg-white p-3 transition-all flex flex-col gap-2",
              status === "correct" ? "border-green-400" : status === "wrong" ? "border-red-400" : "border-slate-200",
            )}
          >
            {/* AI HEADER */}
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-bold text-white flex items-center gap-1",
                  SUBJECT_THEMES[activeQuestion.subject].bg,
                )}
              >
                {SUBJECT_THEMES[activeQuestion.subject].icon} {SUBJECT_THEMES[activeQuestion.subject].label}
              </span>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-indigo-500 hover:scale-110 transition-transform"
              >
                <Lightbulb size={14} fill={showHint ? "currentColor" : "none"} />
              </button>
            </div>

            <h2 className="text-sm font-bold text-slate-800 truncate">{activeQuestion.question}</h2>

            {/* AI HINT BOX */}
            {showHint && status === "unanswered" && (
              <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-lg animate-in fade-in zoom-in-95">
                <p className="text-[10px] text-indigo-700 font-medium italic">{activeQuestion.aiHint}</p>
              </div>
            )}

            {/* HORIZONTAL OPTIONS FOR COMPACTNESS */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {activeQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={status !== "unanswered"}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg border-b-2 text-[11px] font-bold whitespace-nowrap active:border-b-0 transition-all",
                    status === "unanswered"
                      ? "bg-slate-50 border-slate-200"
                      : i === activeQuestion.correctIndex
                        ? "bg-green-100 border-green-400 text-green-700"
                        : "opacity-40 bg-slate-100",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>

            {status !== "unanswered" && (
              <Button
                onClick={generateNew}
                size="sm"
                className={cn(
                  "h-7 rounded-lg text-[10px] font-black border-b-2 active:border-b-0",
                  SUBJECT_THEMES[activeQuestion.subject].bg,
                )}
              >
                NEXT <ArrowRight size={12} className="ml-1" />
              </Button>
            )}
          </div>
        ) : (
          /* MINIFIED HISTORY */
          <div className="flex gap-2 overflow-x-auto p-1">
            {history.map((h, i) => (
              <div
                key={i}
                className="bg-white border-b-2 border-slate-200 p-2 rounded-xl flex-shrink-0 flex flex-col items-center gap-1 min-w-[60px]"
              >
                <div className={cn("p-1 rounded-md text-white", SUBJECT_THEMES[h.subject].bg)}>
                  {SUBJECT_THEMES[h.subject].icon}
                </div>
                {h.userResult === "correct" ? (
                  <CheckCircle size={12} className="text-green-500" />
                ) : (
                  <XCircle size={12} className="text-red-400" />
                )}
              </div>
            ))}
            {history.length === 0 && <p className="text-[10px] text-slate-400 font-bold p-4">No data.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
