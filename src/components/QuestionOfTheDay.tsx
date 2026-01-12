import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle, XCircle, Sparkles, RotateCcw, Brain, ArrowRight, Dna, Calculator, BookOpen, Globe, Trophy } from "lucide-react";

// ==========================================
// 1. TYPES & CONFIGURATION
// ==========================================

type Subject = "math" | "science" | "english" | "social-studies";

// This interface fixes the TS2304 error
interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  funFact: string;
  subject: Subject;
}
const SUBJECT_CONFIG = {
  math: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Calculator className="w-4 h-4" />,
    label: "Math"
  },
  science: {
    badge: "bg-green-100 text-green-700 border-green-200",
    icon: <Dna className="w-4 h-4" />,
    label: "Science"
  },
  english: {
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <BookOpen className="w-4 h-4" />,
    label: "English"
  },
  "social-studies": {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <Globe className="w-4 h-4" />,
    label: "Social Studies"
  }
};

// ==========================================
// 2. ADAPTIVE GENERATORS
// ==========================================

// Helper to format question objects with proper typing
function createQuestionObj(id: string, q: string, a: string, meta: [string, Subject], level: number, distractors?: string[]): Question {
  const options = distractors ? [a, ...distractors] : [a, (parseFloat(a) + 2).toString(), (parseFloat(a) - 1).toString(), (parseFloat(a) * 2).toString()];
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  return {
    id,
    question: q,
    options: shuffled,
    correctIndex: shuffled.indexOf(a),
    funFact: meta[0],
    subject: meta[1],
    hint: "Think carefully about the options!"
  };
}
const generateMath = (seed: number, level: number): Question => {
  const type = seed % 2;
  const range = level * 10;
  let a = seed % range + 2;
  let b = seed % (level + 5) + 2;
  const question = type === 0 ? `Solve: ${a} × ${b} + ${level}` : `What is ${level * 5}% of ${a * 20}?`;
  const answer = type === 0 ? a * b + level : a * 20 * (level * 5) / 100;
  return createQuestionObj(`math-${seed}`, question, answer.toString(), ["Zero is the only number that cannot be represented by Roman numerals.", "math"], level);
};
const generateEnglish = (seed: number, level: number): Question => {
  const bank = [{
    q: "Which is a NOUN?",
    a: "Happiness",
    d: ["Quickly", "Beautiful", "Run"]
  }, {
    q: "Antonym of 'Vivid'?",
    a: "Dull",
    d: ["Bright", "Shiny", "Clear"]
  }, {
    q: "Identify the 'Oxymoron'.",
    a: "Deafening Silence",
    d: ["Big House", "Fast Car", "Sweet Jam"]
  }];
  const item = bank[seed % bank.length];
  return createQuestionObj(`eng-${seed}`, item.q, item.a, ["The word 'set' has the most definitions in English.", "english"], level, item.d);
};
const generateScience = (seed: number, level: number): Question => {
  const bank = [{
    q: "Planet closest to the Sun?",
    a: "Mercury",
    d: ["Venus", "Mars", "Earth"]
  }, {
    q: "Symbol for Gold?",
    a: "Au",
    d: ["Ag", "Fe", "Gd"]
  }, {
    q: "Powerhouse of the cell?",
    a: "Mitochondria",
    d: ["Nucleus", "Ribosome", "Vacuole"]
  }];
  const item = bank[seed % bank.length];
  return createQuestionObj(`sci-${seed}`, item.q, item.a, ["Bananas are slightly radioactive!", "science"], level, item.d);
};
const generateSocialStudies = (seed: number, level: number): Question => {
  const bank = [{
    q: "Largest continent?",
    a: "Asia",
    d: ["Africa", "Europe", "NA"]
  }, {
    q: "Year of Magna Carta?",
    a: "1215",
    d: ["1066", "1492", "1776"]
  }, {
    q: "Smallest country?",
    a: "Vatican City",
    d: ["Monaco", "Malta", "San Marino"]
  }];
  const item = bank[seed % bank.length];
  return createQuestionObj(`ss-${seed}`, item.q, item.a, ["Russia has more surface area than Pluto.", "social-studies"], level, item.d);
};
const generateQuestion = (seed: number, level: number, subject: Subject): Question => {
  const hash = Math.abs(seed);
  switch (subject) {
    case "math":
      return generateMath(hash, level);
    case "english":
      return generateEnglish(hash, level);
    case "science":
      return generateScience(hash, level);
    case "social-studies":
      return generateSocialStudies(hash, level);
    default:
      return generateMath(hash, level);
  }
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function QuestionOfTheDay() {
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [status, setStatus] = useState<"unanswered" | "correct" | "wrong">("unanswered");
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const loadQuestion = useCallback((isNew = false) => {
    const subjects: Subject[] = ["math", "science", "english", "social-studies"];
    const randomSub = subjects[Math.floor(Math.random() * subjects.length)];
    const seed = isNew ? Math.floor(Math.random() * 100000) : new Date().getDate();
    setActiveQuestion(generateQuestion(seed, level, randomSub));
    setStatus("unanswered");
  }, [level]);
  useEffect(() => {
    const savedLevel = localStorage.getItem("edu-level");
    if (savedLevel) setLevel(parseInt(savedLevel));
    loadQuestion();
  }, [loadQuestion]);
  const handleAnswer = (idx: number) => {
    if (status !== "unanswered" || !activeQuestion) return;
    const isCorrect = idx === activeQuestion.correctIndex;
    setStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      const newLevel = Math.min(level + 1, 5);
      setLevel(newLevel);
      setStreak(s => s + 1);
      localStorage.setItem("edu-level", newLevel.toString());
    } else {
      setLevel(l => Math.max(1, l - 1));
      setStreak(0);
    }
  };
  if (!activeQuestion) return null;
  return <div className="max-w-2xl mx-auto p-6 space-y-6 py-[20px] px-[20px] bg-purple-200 border border-solid border-orange-400">
      {/* Level Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skill Level</span>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className={cn("h-2 w-8 rounded-full transition-all", i <= level ? "bg-indigo-500" : "bg-slate-100")} />)}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
          <Trophy className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-orange-700">{streak}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className={cn("bg-white rounded-3xl border-2 p-8 shadow-xl transition-all duration-300", status === "correct" ? "border-green-500" : status === "wrong" ? "border-red-500" : "border-slate-100")}>
        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 border", SUBJECT_CONFIG[activeQuestion.subject].badge)}>
          {SUBJECT_CONFIG[activeQuestion.subject].icon}
          {SUBJECT_CONFIG[activeQuestion.subject].label}
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-tight">{activeQuestion.question}</h2>

        <div className="grid grid-cols-1 gap-3">
          {activeQuestion.options.map((opt, i) => <button key={i} onClick={() => handleAnswer(i)} disabled={status !== "unanswered"} className={cn("p-4 rounded-xl border-2 text-left font-semibold transition-all flex justify-between items-center", status === "unanswered" ? "hover:border-indigo-500 bg-slate-50 border-transparent active:scale-[0.98]" : i === activeQuestion.correctIndex ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-200 text-red-400 opacity-60")}>
              {opt}
              {status !== "unanswered" && i === activeQuestion.correctIndex && <CheckCircle className="w-5 h-5" />}
            </button>)}
        </div>

        {status !== "unanswered" && <div className="mt-8 pt-8 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-indigo-50 p-4 rounded-2xl mb-6">
              <p className="text-sm text-indigo-900">
                <span className="font-bold mr-2">Did you know?</span> {activeQuestion.funFact}
              </p>
            </div>
            <Button onClick={() => loadQuestion(true)} className="w-full bg-slate-900 text-white h-12 rounded-xl hover:bg-slate-800">
              Next Challenge <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>}
      </div>
    </div>;
}