import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  CheckCircle,
  XCircle,
  Sparkles,
  RotateCcw,
  Brain,
  ArrowRight,
  Dna,
  Calculator,
  BookOpen,
  Trophy,
} from "lucide-react";

// ==========================================
// 1. TYPES & CONSTANTS
// ==========================================

type Subject = "math" | "science" | "english";

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
    label: "Math",
  },
  science: {
    badge: "bg-green-100 text-green-700 border-green-200",
    icon: <Dna className="w-4 h-4" />,
    label: "Science",
  },
  english: {
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <BookOpen className="w-4 h-4" />,
    label: "English",
  },
};

const STATIC_QUESTIONS: Omit<Question, "id">[] = [
  {
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Saturn", "Jupiter", "Neptune"],
    correctIndex: 2,
    hint: "It's named after the king of Roman gods! 👑",
    funFact: "Jupiter is so big that over 1,300 Earths could fit inside it!",
    subject: "science",
  },
  {
    question: "Which word is a noun in: 'The happy dog barked'?",
    options: ["happy", "dog", "barked", "The"],
    correctIndex: 1,
    hint: "A noun is a person, place, or thing! 🐕",
    funFact: "The word 'noun' comes from the Latin word 'nomen', meaning name.",
    subject: "english",
  },
];

// ==========================================
// 2. PROCEDURAL GENERATORS
// ==========================================

const generateMathQuestion = (seed: number): Question => {
  const type = seed % 3;
  let question = "";
  let answer = 0;
  let hint = "";

  if (type === 0) {
    const a = (seed % 12) + 2;
    const b = (seed % 9) + 3;
    const c = (seed % 20) + 5;
    answer = a * b + c;
    question = `Solve: (${a} × ${b}) + ${c} = ?`;
    hint = "Remember PEMDAS: Multiply before you add!";
  } else if (type === 1) {
    const w = (seed % 7) + 4;
    const l = (seed % 10) + 5;
    answer = w * l;
    question = `A rectangle has width ${w}m and length ${l}m. What is its area?`;
    hint = "Area = Length × Width 📐";
  } else {
    const pct = [10, 20, 25, 50][seed % 4];
    const whole = ((seed % 10) + 1) * 40;
    answer = (whole * pct) / 100;
    question = `What is ${pct}% of ${whole}?`;
    hint = `Think: ${pct}% is the same as ${pct / 100} in decimals.`;
  }

  // AI Logic: Generate Distractors and ensure uniqueness
  const optionsSet = new Set<string>();
  optionsSet.add(answer.toString());

  while (optionsSet.size < 4) {
    const offset = Math.floor(Math.random() * 10) + 1;
    const distractor = Math.random() > 0.5 ? answer + offset : Math.max(0, answer - offset);
    optionsSet.add(distractor.toString());
  }

  const shuffledOptions = Array.from(optionsSet).sort(() => (seed % 7 > 3 ? 1 : -1));

  return {
    id: `math-${seed}`,
    question,
    options: shuffledOptions,
    correctIndex: shuffledOptions.indexOf(answer.toString()),
    hint,
    funFact: "The symbol for division (÷) is called an obelus.",
    subject: "math",
  };
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function QuestionOfTheDay() {
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [status, setStatus] = useState<"unanswered" | "correct" | "wrong">("unanswered");
  const [showHint, setShowHint] = useState(false);
  const [isDaily, setIsDaily] = useState(true);
  const [streak, setStreak] = useState(0);

  // Helper: Create stable hash for the date
  const dateSeed = useMemo(() => {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }, []);

  const fetchDailyQuestion = useCallback(() => {
    if (dateSeed % 2 === 0) {
      return generateMathQuestion(dateSeed);
    }
    const idx = dateSeed % STATIC_QUESTIONS.length;
    return { ...STATIC_QUESTIONS[idx], id: `static-${dateSeed}` };
  }, [dateSeed]);

  // Initialization
  useEffect(() => {
    const dailyQ = fetchDailyQuestion();
    setActiveQuestion(dailyQ);

    // Restore Streak
    const savedStreak = localStorage.getItem("qotd-streak");
    if (savedStreak) setStreak(parseInt(savedStreak));

    // Restore Daily Answer
    const saved = localStorage.getItem("qotd-save");
    if (saved) {
      const { id, answer, date } = JSON.parse(saved);
      if (date === new Date().toDateString() && id === dailyQ.id) {
        setSelectedAnswer(answer);
        setStatus(answer === dailyQ.correctIndex ? "correct" : "wrong");
      }
    }
  }, [fetchDailyQuestion]);

  // Keyboard Listeners (A11y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== "unanswered") return;
      const key = parseInt(e.key);
      if (key >= 1 && key <= 4) handleAnswerSelect(key - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, activeQuestion]);

  const handleAnswerSelect = (index: number) => {
    if (!activeQuestion || status !== "unanswered") return;

    setSelectedAnswer(index);
    const isCorrect = index === activeQuestion.correctIndex;
    setStatus(isCorrect ? "correct" : "wrong");

    if (isDaily) {
      localStorage.setItem(
        "qotd-save",
        JSON.stringify({
          id: activeQuestion.id,
          answer: index,
          date: new Date().toDateString(),
        }),
      );

      if (isCorrect) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem("qotd-streak", newStreak.toString());
      }
    }
  };

  const nextPracticeQuestion = () => {
    setIsDaily(false);
    setStatus("unanswered");
    setSelectedAnswer(null);
    setShowHint(false);
    setActiveQuestion(generateMathQuestion(Math.floor(Math.random() * 100000)));
  };

  if (!activeQuestion) return null;

  const currentStyle = SUBJECT_CONFIG[activeQuestion.subject];

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-in fade-in duration-700">
      {/* Streak Badge */}
      {streak > 0 && (
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full border border-orange-200 shadow-sm animate-bounce">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-bold">{streak} Day Streak!</span>
          </div>
        </div>
      )}

      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border-2 bg-white shadow-2xl transition-all duration-500",
          status === "correct" ? "border-green-400" : status === "wrong" ? "border-red-400" : "border-slate-100",
        )}
      >
        {/* Animated Progress Bar */}
        <div
          className={cn(
            "h-1.5 w-full transition-all duration-1000",
            status === "correct" ? "bg-green-500" : status === "wrong" ? "bg-red-500" : "bg-blue-500",
          )}
        />

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">{isDaily ? "Daily Challenge" : "Practice Mode"}</h2>
            </div>

            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border",
                currentStyle.badge,
              )}
            >
              {currentStyle.icon}
              {currentStyle.label}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 min-h-[120px] flex items-center justify-center">
            <p className="text-xl sm:text-2xl font-medium text-center text-slate-800 leading-tight">
              {activeQuestion.question}
            </p>
          </div>

          <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", status === "wrong" && "animate-shake")}>
            {activeQuestion.options.map((option, idx) => {
              const isCorrect = idx === activeQuestion.correctIndex;
              const isSelected = selectedAnswer === idx;

              return (
                <button
                  key={idx}
                  disabled={status !== "unanswered"}
                  onClick={() => handleAnswerSelect(idx)}
                  className={cn(
                    "group relative p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between",
                    status === "unanswered"
                      ? "border-slate-200 hover:border-blue-500 hover:bg-blue-50 bg-white"
                      : isCorrect
                        ? "border-green-500 bg-green-50 text-green-700"
                        : isSelected
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-slate-100 opacity-50 bg-slate-50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border text-xs font-bold bg-slate-50 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{option}</span>
                  </div>
                  {status !== "unanswered" && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {status !== "unanswered" && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Feedback Area */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {status === "unanswered" ? (
              <div className="w-full text-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowHint(!showHint)}
                  className="text-slate-500 hover:text-blue-600"
                >
                  <Lightbulb className={cn("w-4 h-4 mr-2", showHint && "fill-yellow-400")} />
                  {showHint ? "Hide Hint" : "I need a hint"}
                </Button>
                {showHint && (
                  <div className="mt-3 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm border border-blue-100 animate-in slide-in-from-top-2">
                    💡 {activeQuestion.hint}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full animate-in zoom-in-95 duration-300">
                <div
                  className={cn(
                    "p-6 rounded-2xl border mb-6",
                    status === "correct" ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100",
                  )}
                >
                  <p className="font-bold text-lg mb-1">
                    {status === "correct" ? "✨ Excellent Work!" : "📚 Keep Learning!"}
                  </p>
                  <p className="text-slate-600 text-sm italic">
                    <span className="font-bold not-italic mr-1 text-slate-800">Fun Fact:</span>
                    {activeQuestion.funFact}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={nextPracticeQuestion}
                    className="flex-1 h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Practice Mode
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  {status === "wrong" && !isDaily && (
                    <Button variant="outline" onClick={() => setStatus("unanswered")} className="rounded-xl h-12">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
}
