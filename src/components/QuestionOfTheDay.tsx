import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle, XCircle, Sparkles, RotateCcw, Brain, ArrowRight, Dna, Calculator, BookOpen } from "lucide-react";

// ==========================================
// 1. UI COMPONENTS (Refactored for Readability)
// ==========================================

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...props} />);
Card.displayName = "Card";
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)} {...props} />);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({
  className,
  ...props
}, ref) => <h3 ref={ref} className={cn("text-xl sm:text-2xl font-semibold leading-none tracking-tight", className)} {...props} />);
CardTitle.displayName = "CardTitle";
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("p-4 sm:p-6 pt-0 sm:pt-0", className)} {...props} />);
CardContent.displayName = "CardContent";

// ==========================================
// 2. GAME LOGIC & DATA
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

// --- Procedural Math Generator ---
const generateMathQuestion = (seed: number): Question => {
  const type = seed % 3; // 0: Arithmetic, 1: Geometry, 2: Percentage

  if (type === 0) {
    // Arithmetic: (A x B) + C
    const a = seed % 9 + 2;
    const b = seed % 8 + 3;
    const c = seed % 15 + 5;
    const ans = a * b + c;
    const options = [`${ans}`, `${ans + a}`, `${ans - b}`, `${(a + c) * b}`].sort(() => Math.random() - 0.5);
    return {
      id: `m-${seed}`,
      question: `Solve: (${a} × ${b}) + ${c} = ?`,
      options: options,
      correctIndex: options.indexOf(`${ans}`),
      hint: `Multiply first, then add! (Order of Operations)`,
      funFact: "The equal sign (=) was invented in 1557 by a Welsh mathematician.",
      subject: "math"
    };
  } else if (type === 1) {
    // Geometry: Area of Rectangle
    const w = seed % 8 + 3;
    const l = w + seed % 5 + 2;
    const area = w * l;

    // Fixed: Cleaned up array construction
    const options = [`${area}`, `${2 * (w + l)}`,
    // Perimeter
    `${area + w}`, `${w * w}`].sort(() => Math.random() - 0.5);
    return {
      id: `m-${seed}`,
      question: `A rectangle has width ${w} and length ${l}. What is its area?`,
      options: options,
      correctIndex: options.indexOf(`${area}`),
      hint: "Area = Length × Width 📐",
      funFact: "Geometry means 'Earth Measurement' in Greek!",
      subject: "math"
    };
  } else {
    // Percentage
    const pct = [10, 20, 25, 50][seed % 4];
    const whole = (seed % 10 + 1) * 100;
    const ans = whole * pct / 100;
    const options = [`${ans}`, `${ans / 2}`, `${ans * 2}`, `${whole - pct}`].sort(() => Math.random() - 0.5);
    return {
      id: `m-${seed}`,
      question: `What is ${pct}% of ${whole}?`,
      options: options,
      correctIndex: options.indexOf(`${ans}`),
      hint: `Convert ${pct}% to decimal (${pct / 100}) and multiply.`,
      funFact: "Percentages are reversible! 8% of 25 is the same as 25% of 8.",
      subject: "math"
    };
  }
};
const subjectStyles = {
  math: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />,
    label: "Math"
  },
  science: {
    badge: "bg-green-100 text-green-700 border-green-200",
    icon: <Dna className="w-3 h-3 sm:w-4 sm:h-4" />,
    label: "Science"
  },
  english: {
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />,
    label: "English"
  }
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

const QuestionOfTheDay = () => {
  const [mounted, setMounted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<"unanswered" | "correct" | "wrong">("unanswered");
  const [isDaily, setIsDaily] = useState(true);

  // Get Daily Question based on Date Hash
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
      const index = positiveHash % staticQuestions.length;
      return staticQuestions[index];
    }
  }, []);

  // Get Random Question (Practice Mode)
  const getNextRandomQuestion = useCallback(() => {
    const randomSeed = Math.floor(Math.random() * 10000);
    if (Math.random() > 0.5) {
      return generateMathQuestion(randomSeed);
    } else {
      const index = randomSeed % staticQuestions.length;
      return staticQuestions[index];
    }
  }, []);

  // Initialization & LocalStorage Restore
  useEffect(() => {
    setMounted(true);
    const dailyQ = getDailyQuestion();
    setActiveQuestion(dailyQ);
    const savedData = localStorage.getItem("qotd-answer");
    if (savedData) {
      try {
        const {
          date,
          answered,
          answer,
          questionId
        } = JSON.parse(savedData);
        // Only restore if it's the SAME day AND the SAME question ID
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
  return <section className="py-6 sm:py-12 px-4 font-sans w-full max-w-4xl mx-auto">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>

      <div className="w-full">
        <Card className="overflow-hidden border-2 border-slate-100 shadow-xl bg-white transition-all duration-300">
          {/* Status Bar */}
          <div className={`h-2 w-full transition-colors duration-500 ${status === "correct" ? "bg-green-500" : status === "wrong" ? "bg-red-500" : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"}`} />

          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <CardTitle className="text-slate-800">
                  {isDaily ? "Question of the Day" : "Practice Mode"}
                </CardTitle>
              </div>
              
              <div className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${style.badge}`}>
                {style.icon}
                {style.label}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Question Display */}
            <div className="bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-100 min-h-[100px] flex items-center justify-center text-center py-[20px] px-[20px]">
              <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                {activeQuestion.question}
              </p>
            </div>

            {/* Options Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ${status === "wrong" ? "animate-shake" : ""}`}>
              {activeQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === activeQuestion.correctIndex;
              const isDisabled = status !== "unanswered";
              let classes = "relative w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 flex items-center justify-between min-h-[56px] active:scale-[0.98] ";
              if (isDisabled) {
                if (isCorrect) classes += "bg-green-50 border-green-500 text-green-700 ";else if (isSelected) classes += "bg-red-50 border-red-500 text-red-700 ";else classes += "bg-slate-50 border-transparent text-slate-400 opacity-50 ";
              } else {
                classes += "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md cursor-pointer text-slate-700 ";
              }
              return <button key={index} onClick={() => handleAnswerSelect(index)} disabled={isDisabled} className={classes} aria-label={option}>
                    <span className="text-sm sm:text-base mr-2">{option}</span>
                    {isDisabled && isCorrect && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                    {isDisabled && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                  </button>;
            })}
            </div>

            {/* Controls: Hint & Results */}
            <div className="flex flex-col items-center gap-4 pt-2">
              
              {/* Hint Section */}
              {status === "unanswered" && <>
                  <Button variant="ghost" size="sm" onClick={() => setShowHint(!showHint)} className="text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                    <Lightbulb className={`w-4 h-4 mr-2 ${showHint ? "fill-blue-600" : ""}`} />
                    {showHint ? "Hide Hint" : "Need a Hint?"}
                  </Button>
                  
                  {showHint && <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 animate-in fade-in slide-in-from-top-2 text-center">
                      💡 {activeQuestion.hint}
                    </div>}
                </>}

              {/* Result & Next Actions */}
              {status !== "unanswered" && <div className="w-full space-y-4 animate-in zoom-in-95 duration-300">
                  <div className={`p-4 rounded-xl text-center ${status === "correct" ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}>
                    <h3 className={`text-lg font-bold ${status === "correct" ? "text-green-800" : "text-red-800"}`}>
                      {status === "correct" ? "🎉 Correct!" : "💪 Good try!"}
                    </h3>
                    <p className="text-slate-600 mt-2 text-xs">
                      <span className="font-semibold">Fun Fact:</span> {activeQuestion.funFact}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center min-w-full">
                    {!isDaily && status === "wrong" && <Button variant="outline" onClick={() => setStatus("unanswered")} className="w-full sm:w-auto border-slate-300 h-12 sm:h-10 text-base sm:text-sm">
                        <RotateCcw className="w-4 h-4 mr-2" /> Retry This Question
                      </Button>}

                    <Button onClick={handleNextQuestion} className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 h-12 sm:h-10 text-base sm:text-sm">
                      <Brain className="w-4 h-4 mr-2" />
                      {status === "correct" ? "Next Question" : "Try Another Question"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>;
};
export default QuestionOfTheDay;