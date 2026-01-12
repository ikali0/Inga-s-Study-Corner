import { useState, useEffect, useCallback, useMemo } from "react";
import { Lightbulb, CheckCircle, XCircle, Sparkles, RotateCcw, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Types ---
interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  funFact: string;
  subject: "math" | "science" | "english";
}

// --- Data ---
const questions: Question[] = [
  {
    id: 1,
    question: "If you have 3 pizzas and each pizza has 8 slices, how many slices do you have in total?",
    options: ["24 slices", "21 slices", "11 slices", "32 slices"],
    correctIndex: 0,
    hint: "Try multiplying the number of pizzas by the slices per pizza! 🍕",
    funFact: "The largest pizza ever made was 131 feet wide!",
    subject: "math",
  },
  {
    id: 2,
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Saturn", "Jupiter", "Neptune"],
    correctIndex: 2,
    hint: "It's named after the king of Roman gods! 👑",
    funFact: "Jupiter is so big that over 1,300 Earths could fit inside it!",
    subject: "science",
  },
  {
    id: 3,
    question: "Which word is a noun: 'quickly', 'happiness', 'beautiful', or 'run'?",
    options: ["quickly", "happiness", "beautiful", "run"],
    correctIndex: 1,
    hint: "A noun is a person, place, thing, or feeling! 💭",
    funFact: "The word 'set' has the most definitions of any English word!",
    subject: "english",
  },
  {
    id: 4,
    question: "What is 25% of 80?",
    options: ["15", "20", "25", "40"],
    correctIndex: 1,
    hint: "25% means one quarter. Try dividing by 4! ✨",
    funFact: "The word 'percent' comes from Latin meaning 'per hundred'!",
    subject: "math",
  },
  {
    id: 5,
    question: "Which part of the plant makes food using sunlight?",
    options: ["Roots", "Stem", "Leaves", "Flowers"],
    correctIndex: 2,
    hint: "This process is called photosynthesis! 🌿",
    funFact: "A single tree can produce enough oxygen for 2 people per year!",
    subject: "science",
  },
  {
    id: 6,
    question: "What is the past tense of 'swim'?",
    options: ["swimmed", "swam", "swum", "swimming"],
    correctIndex: 1,
    hint: "It's an irregular verb - it doesn't follow the usual '-ed' rule! 🏊",
    funFact: "English has about 200 irregular verbs!",
    subject: "english",
  },
  {
    id: 7,
    question: "If a rectangle has a length of 6 and width of 4, what is its area?",
    options: ["10", "20", "24", "28"],
    correctIndex: 2,
    hint: "Area = length × width 📐",
    funFact: "Ancient Egyptians used geometry to rebuild field boundaries after the Nile flooded!",
    subject: "math",
  },
];

// Normalized Tailwind Colors (using standard palette steps)
const subjectStyles = {
  math: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "text-blue-600",
  },
  science: {
    badge: "bg-green-100 text-green-700 border-green-200",
    icon: "text-green-600",
  },
  english: {
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    icon: "text-purple-600",
  },
};

const subjectLabels = {
  math: "🧮 Math",
  science: "🔬 Science",
  english: "📚 English",
};

const QuestionOfTheDay = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isWrongAnimation, setIsWrongAnimation] = useState(false);

  // 1. Determine Question of the Day based on Date
  // We use useMemo so this is stable, but we allow it to re-calc if the date changes
  const todayQuestion = useMemo(() => {
    const now = new Date();
    // Create a stable seed from the date string (e.g., "Mon Jan 01 2024")
    // This ensures everyone sees the same question on the same day
    const seed = now.toDateString();
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % questions.length;
    return questions[index];
  }, []);

  // 2. Hydration Fix & LocalStorage Check
  useEffect(() => {
    setMounted(true);

    // Check localStorage
    const savedData = localStorage.getItem("qotd-answer");
    if (savedData) {
      try {
        const { date, answered, answer } = JSON.parse(savedData);
        const today = new Date().toDateString();
        // Only restore if it's actually from today
        if (date === today && answered) {
          setHasAnswered(true);
          setSelectedAnswer(answer);
        } else {
          // Clear old data if it's a new day
          localStorage.removeItem("qotd-answer");
        }
      } catch (e) {
        console.error("Failed to parse QOTD data", e);
      }
    }
  }, []);

  const handleAnswerSelect = useCallback(
    (index: number) => {
      if (hasAnswered) return;

      setSelectedAnswer(index);
      setHasAnswered(true);

      const isCorrect = index === todayQuestion.correctIndex;

      // Trigger visual feedback
      if (!isCorrect) {
        setIsWrongAnimation(true);
        setTimeout(() => setIsWrongAnimation(false), 500); // Reset animation class
      }

      // Save to localStorage
      const today = new Date().toDateString();
      localStorage.setItem(
        "qotd-answer",
        JSON.stringify({
          date: today,
          answered: true,
          answer: index,
        }),
      );
    },
    [hasAnswered, todayQuestion.correctIndex],
  );

  const handleTryAgain = useCallback(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowHint(false);
    // We don't remove the localStorage item here immediately to prevent
    // accidental refresh-cheating, but for UI flow we reset state.
    // If you want to allow infinite retries on refresh, keep removeItem.
    localStorage.removeItem("qotd-answer");
  }, []);

  // Prevent Hydration Mismatch
  if (!mounted) return null;

  const isCorrect = selectedAnswer === todayQuestion.correctIndex;
  const currentSubjectStyle = subjectStyles[todayQuestion.subject];

  return (
    <section
      id="question-of-the-day"
      className="py-8 sm:py-12 px-4 sm:px-6 relative z-10 font-sans"
      aria-labelledby="qotd-heading"
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden border-2 border-slate-200 shadow-xl bg-white">
          {/* Decorative header bar */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2" aria-hidden="true" />

          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle
                id="qotd-heading"
                className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-slate-800"
              >
                <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                Question of the Day
              </CardTitle>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${currentSubjectStyle.badge}`}
              >
                {subjectLabels[todayQuestion.subject]}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Challenge your brain daily!
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Question Box */}
            <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
              <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">{todayQuestion.question}</p>
            </div>

            {/* Options Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${isWrongAnimation ? "animate-shake" : ""}`}
              role="radiogroup"
              aria-label="Answer options"
            >
              {todayQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === todayQuestion.correctIndex;

                let optionClasses =
                  "relative p-4 rounded-xl border-2 transition-all duration-200 text-left font-medium text-base ";

                if (hasAnswered) {
                  if (isCorrectAnswer) {
                    optionClasses +=
                      "bg-green-50 border-green-500 text-green-700 shadow-[0_0_10px_rgba(34,197,94,0.2)]";
                  } else if (isSelected && !isCorrectAnswer) {
                    optionClasses += "bg-red-50 border-red-500 text-red-700 opacity-80";
                  } else {
                    optionClasses += "bg-slate-50 border-transparent text-slate-400 opacity-50";
                  }
                } else {
                  optionClasses +=
                    "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md cursor-pointer text-slate-700";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={hasAnswered}
                    className={optionClasses}
                    role="radio"
                    aria-checked={isSelected}
                    aria-disabled={hasAnswered}
                  >
                    <span className="flex items-center justify-between w-full">
                      <span>{option}</span>
                      {hasAnswered && isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {hasAnswered && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Hint Section */}
            {!hasAnswered && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Lightbulb className={`w-4 h-4 mr-2 ${showHint ? "fill-blue-600" : ""}`} />
                  {showHint ? "Hide Hint" : "Need a Hint?"}
                </Button>
              </div>
            )}

            {showHint && !hasAnswered && (
              <div
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center animate-in fade-in slide-in-from-top-2"
                role="note"
              >
                <p className="text-sm text-yellow-800 font-medium">💡 Hint: {todayQuestion.hint}</p>
              </div>
            )}

            {/* Results & Fun Fact */}
            {hasAnswered && (
              <div
                className={`rounded-xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-300 ${
                  isCorrect
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
                    : "bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200"
                }`}
                role="status"
                aria-live="polite"
              >
                <div className="text-4xl animate-bounce">{isCorrect ? "🎉" : "🤔"}</div>

                <div>
                  <h3 className={`text-lg font-bold ${isCorrect ? "text-green-800" : "text-orange-800"}`}>
                    {isCorrect ? "Brilliant! That is correct!" : "Not quite, but good thinking!"}
                  </h3>
                  <div className="mt-2 text-sm text-slate-600 max-w-md mx-auto bg-white/60 p-3 rounded-lg">
                    <span className="font-bold text-slate-800">Did you know?</span> {todayQuestion.funFact}
                  </div>
                </div>

                {!isCorrect && (
                  <Button
                    variant="outline"
                    onClick={handleTryAgain}
                    className="border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuestionOfTheDay;
