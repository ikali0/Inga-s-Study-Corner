import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle, XCircle, Sparkles, RotateCcw, Brain, ArrowRight, Dna, Calculator, BookOpen } from "lucide-react";

// ==========================================
// TYPES & DATA
// ==========================================

type Subject = "math" | "science" | "english";
interface Question {
  id: string | number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  funFact: string;
  subject: Subject;
}
const staticQuestions: Question[] = [{
  id: "s1",
  question: "What is the largest planet in our solar system?",
  options: ["Earth", "Saturn", "Jupiter", "Neptune"],
  correctIndex: 2,
  hint: "It's named after the king of Roman gods! 👑",
  funFact: "Jupiter is so big that over 1,300 Earths could fit inside it!",
  subject: "science"
}, {
  id: "e1",
  question: "Which word is a noun: 'quickly', 'happiness', 'beautiful', or 'run'?",
  options: ["quickly", "happiness", "beautiful", "run"],
  correctIndex: 1,
  hint: "A noun is a person, place, thing, or feeling! 💭",
  funFact: "The word 'set' has the most definitions of any English word!",
  subject: "english"
}, {
  id: "s2",
  question: "Which part of the plant makes food using sunlight?",
  options: ["Roots", "Stem", "Leaves", "Flowers"],
  correctIndex: 2,
  hint: "This process is called photosynthesis! 🌿",
  funFact: "A single tree can produce enough oxygen for 2 people per year!",
  subject: "science"
}, {
  id: "e2",
  question: "What is the past tense of 'swim'?",
  options: ["swimmed", "swam", "swum", "swimming"],
  correctIndex: 1,
  hint: "It's an irregular verb - it doesn't follow the usual '-ed' rule! 🏊",
  funFact: "English has about 200 irregular verbs!",
  subject: "english"
}, {
  id: "s3",
  question: "What gas do humans need to breathe in to survive?",
  options: ["Carbon Dioxide", "Helium", "Oxygen", "Nitrogen"],
  correctIndex: 2,
  hint: "Trees release this gas, and we take it in! 🌬️",
  funFact: "The air we breathe is actually 78% Nitrogen and only 21% Oxygen.",
  subject: "science"
}, {
  id: "e3",
  question: "Identify the antonym of 'Artificial'.",
  options: ["Fake", "Natural", "Constructed", "Man-made"],
  correctIndex: 1,
  hint: "An antonym means the opposite. Think of something found in nature.",
  funFact: "Antonyms are words with opposite meanings, like 'hot' and 'cold'.",
  subject: "english"
}];

// Procedural Math Generator
const generateMathQuestion = (seed: number): Question => {
  const type = seed % 3;
  if (type === 0) {
    const a = seed % 9 + 2;
    const b = seed % 8 + 3;
    const c = seed % 15 + 5;
    const ans = a * b + c;
    const options = [`${ans}`, `${ans + a}`, `${ans - b}`, `${(a + c) * b}`].sort(() => Math.random() - 0.5);
    return {
      id: `m-${seed}`,
      question: `Solve: (${a} × ${b}) + ${c} = ?`,
      options,
      correctIndex: options.indexOf(`${ans}`),
      hint: "Multiply first, then add! (Order of Operations)",
      funFact: "The equal sign (=) was invented in 1557 by a Welsh mathematician.",
      subject: "math"
    };
  } else if (type === 1) {
    const w = seed % 8 + 3;
    const l = w + seed % 5 + 2;
    const area = w * l;
    const options = [`${area}`, `${2 * (w + l)}`, `${area + w}`, `${w * w}`].sort(() => Math.random() - 0.5);
    return {
      id: `m-${seed}`,
      question: `Rectangle: width ${w}, length ${l}. Area?`,
      options,
      correctIndex: options.indexOf(`${area}`),
      hint: "Area = Length × Width 📐",
      funFact: "Geometry means 'Earth Measurement' in Greek!",
      subject: "math"
    };
  } else {
    const pct = [10, 20, 25, 50][seed % 4];
    const whole = (seed % 10 + 1) * 100;
    const ans = whole * pct / 100;
    const options = [`${ans}`, `${ans / 2}`, `${ans * 2}`, `${whole - pct}`].sort(() => Math.random() - 0.5);
    return {
      id: `m-${seed}`,
      question: `What is ${pct}% of ${whole}?`,
      options,
      correctIndex: options.indexOf(`${ans}`),
      hint: `Convert ${pct}% to decimal (${pct / 100}) and multiply.`,
      funFact: "Percentages are reversible! 8% of 25 is the same as 25% of 8.",
      subject: "math"
    };
  }
};
const subjectStyles = {
  math: {
    badge: "bg-blue/10 text-blue border-blue/20",
    icon: <Calculator className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
    label: "Math"
  },
  science: {
    badge: "bg-green/10 text-green border-green/20",
    icon: <Dna className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
    label: "Science"
  },
  english: {
    badge: "bg-purple/10 text-purple border-purple/20",
    icon: <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
    label: "English"
  }
};

// ==========================================
// MAIN COMPONENT - Compact Mobile-First
// ==========================================

const QuestionOfTheDay = () => {
  const [mounted, setMounted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<"unanswered" | "correct" | "wrong">("unanswered");
  const [isDaily, setIsDaily] = useState(true);
  const getDailyQuestion = useCallback(() => {
    const now = new Date();
    const seedString = now.toDateString();
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
    }
    const positiveHash = Math.abs(hash);
    if (positiveHash % 2 === 0) {
      return generateMathQuestion(positiveHash);
    } else {
      return staticQuestions[positiveHash % staticQuestions.length];
    }
  }, []);
  const getNextRandomQuestion = useCallback(() => {
    const randomSeed = Math.floor(Math.random() * 10000);
    if (Math.random() > 0.5) {
      return generateMathQuestion(randomSeed);
    } else {
      return staticQuestions[randomSeed % staticQuestions.length];
    }
  }, []);
  useEffect(() => {
    setMounted(true);
    const dailyQ = getDailyQuestion();
    setActiveQuestion(dailyQ);
    const savedData = localStorage.getItem("qotd-answer");
    if (savedData) {
      try {
        const {
          date,
          answer,
          questionId
        } = JSON.parse(savedData);
        if (date === new Date().toDateString() && questionId === dailyQ.id) {
          setSelectedAnswer(answer);
          setStatus(answer === dailyQ.correctIndex ? "correct" : "wrong");
        } else {
          localStorage.removeItem("qotd-answer");
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [getDailyQuestion]);
  const handleAnswerSelect = (index: number) => {
    if (status !== "unanswered" || !activeQuestion) return;
    setSelectedAnswer(index);
    const isCorrect = index === activeQuestion.correctIndex;
    setStatus(isCorrect ? "correct" : "wrong");
    if (isDaily) {
      localStorage.setItem("qotd-answer", JSON.stringify({
        date: new Date().toDateString(),
        answered: true,
        answer: index,
        questionId: activeQuestion.id
      }));
    }
  };
  const handleNextQuestion = () => {
    setIsDaily(false);
    setSelectedAnswer(null);
    setShowHint(false);
    setStatus("unanswered");
    setActiveQuestion(getNextRandomQuestion());
  };
  if (!mounted || !activeQuestion) return null;
  const style = subjectStyles[activeQuestion.subject];
  return <div className="w-full font-sans">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>

      <div className="bg-card rounded-xl border-2 border-foreground/80 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] overflow-hidden">
        {/* Status Bar */}
        <div className={cn("h-1 w-full transition-colors duration-300", status === "correct" ? "bg-green" : status === "wrong" ? "bg-destructive" : "bg-gradient-to-r from-blue via-purple to-pink")} />

        <div className="p-3 sm:p-4 bg-white py-[10px] px-[10px]">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary" />
              <span className="font-bold text-foreground text-[10px] sm:text-xs">
                {isDaily ? "Daily Quiz" : "Practice"}
              </span>
            </div>
            <div className={cn("inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold border", style.badge)}>
              {style.icon}
              {style.label}
            </div>
          </div>

          {/* Question */}
          <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3 border border-border mb-2 sm:mb-3">
            <p className="text-xs sm:text-sm font-medium text-foreground leading-snug">
              {activeQuestion.question}
            </p>
          </div>

          {/* Options - 2x2 Grid */}
          <div className={cn("grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3", status === "wrong" ? "animate-shake" : "")}>
            {activeQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === activeQuestion.correctIndex;
            const isDisabled = status !== "unanswered";
            return <button key={index} onClick={() => handleAnswerSelect(index)} disabled={isDisabled} className={cn("relative p-2 sm:p-2.5 rounded-lg border-2 text-left text-[10px] sm:text-xs font-medium transition-all duration-150 flex items-center justify-between min-h-[36px] sm:min-h-[40px]", isDisabled ? isCorrect ? "bg-green/10 border-green text-green" : isSelected ? "bg-destructive/10 border-destructive text-destructive" : "bg-muted border-border text-muted-foreground opacity-50" : "bg-card border-border hover:border-primary hover:bg-primary/5 cursor-pointer text-foreground active:scale-[0.98]")}>
                  <span className="mr-1 line-clamp-2">{option}</span>
                  {isDisabled && isCorrect && <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green shrink-0" />}
                  {isDisabled && isSelected && !isCorrect && <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-destructive shrink-0" />}
                </button>;
          })}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {status === "unanswered" && <>
                <Button variant="ghost" size="sm" onClick={() => setShowHint(!showHint)} className="text-primary hover:bg-primary/10 h-7 sm:h-8 text-[10px] sm:text-xs w-full">
                  <Lightbulb className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1", showHint && "fill-primary")} />
                  {showHint ? "Hide Hint" : "Need a Hint?"}
                </Button>
                {showHint && <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 text-[10px] sm:text-xs text-foreground text-center">
                    💡 {activeQuestion.hint}
                  </div>}
              </>}

            {status !== "unanswered" && <div className="space-y-1.5 sm:space-y-2">
                <div className={cn("p-2 sm:p-2.5 rounded-lg text-center", status === "correct" ? "bg-green/10 border border-green/20" : "bg-destructive/10 border border-destructive/20")}>
                  <p className={cn("text-xs sm:text-sm font-bold", status === "correct" ? "text-green" : "text-destructive")}>
                    {status === "correct" ? "🎉 Correct!" : "💪 Try again!"}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">
                    <span className="font-semibold">Fun Fact:</span> {activeQuestion.funFact}
                  </p>
                </div>

                <div className="flex gap-1.5 sm:gap-2">
                  {!isDaily && status === "wrong" && <Button variant="outline" size="sm" onClick={() => setStatus("unanswered")} className="flex-1 h-7 sm:h-8 text-[10px] sm:text-xs">
                      <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> Retry
                    </Button>}
                  <Button size="sm" onClick={handleNextQuestion} className="flex-1 bg-foreground text-background hover:bg-foreground/90 h-7 sm:h-8 text-[10px] sm:text-xs">
                    <Brain className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                    Next
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" />
                  </Button>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default QuestionOfTheDay;