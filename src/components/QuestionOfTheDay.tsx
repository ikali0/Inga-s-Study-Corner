import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  encouragement: string;
  hint: string;
}

const questions: Question[] = [
  {
    question: "What is 7 × 8?",
    options: ["54", "56", "58", "64"],
    correctIndex: 1,
    encouragement: "Math superstar! 🌟 7×8 is one of the tricky ones!",
    hint: "Think: 7×7=49, then add one more 7!"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctIndex: 2,
    encouragement: "Space explorer! 🚀 Mars gets its red color from iron oxide (rust)!",
    hint: "It's named after the Roman god of war."
  },
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Madrid", "Paris"],
    correctIndex: 3,
    encouragement: "Magnifique! 🗼 Paris is also called the City of Light!",
    hint: "This city has a famous tower named after its builder."
  },
  {
    question: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    correctIndex: 1,
    encouragement: "Geometry genius! 📐 Hex means six in Greek!",
    hint: "Think of a honeycomb cell!"
  },
  {
    question: "What do plants need to make their own food?",
    options: ["Milk", "Sunlight", "Meat", "Candy"],
    correctIndex: 1,
    encouragement: "Science whiz! 🌱 Plants use sunlight in photosynthesis!",
    hint: "It's something that comes from the sky during the day."
  },
  {
    question: "What is 1/2 + 1/4?",
    options: ["2/6", "1/6", "3/4", "2/4"],
    correctIndex: 2,
    encouragement: "Fraction master! 🧮 You nailed that one!",
    hint: "Convert 1/2 to 2/4 first, then add!"
  },
  {
    question: "Which ocean is the largest?",
    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    correctIndex: 2,
    encouragement: "Ocean explorer! 🌊 The Pacific covers more area than all land combined!",
    hint: "Its name means peaceful or calm."
  }
];

const getDailyQuestion = (): Question => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return questions[dayOfYear % questions.length];
};

const getTodayKey = (): string => {
  const today = new Date();
  return `qotd-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
};

const QuestionOfTheDay = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const question = getDailyQuestion();
  const todayKey = getTodayKey();

  useEffect(() => {
    const saved = localStorage.getItem(todayKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedAnswer(parsed.selectedAnswer);
      setIsCompleted(true);
    }
  }, [todayKey]);

  const handleAnswer = (index: number) => {
    if (isCompleted) return;
    
    setSelectedAnswer(index);
    setIsCompleted(true);
    
    localStorage.setItem(todayKey, JSON.stringify({
      selectedAnswer: index,
      correct: index === question.correctIndex,
      date: new Date().toISOString()
    }));
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setIsCompleted(false);
    setShowHint(false);
    localStorage.removeItem(todayKey);
  };

  const isCorrect = selectedAnswer === question.correctIndex;

  return (
    <section className="py-12 md:py-16 relative z-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-purple/10 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 border border-primary/20 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Question of the Day</h3>
              <p className="text-xs text-muted-foreground">A new challenge every day! ✨</p>
            </div>
          </div>

          {/* Question */}
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-6">
            {question.question}
          </p>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {question.options.map((option, index) => {
              let buttonClass = "p-3 sm:p-4 rounded-xl border-2 font-medium text-left transition-all ";
              
              if (isCompleted) {
                if (index === question.correctIndex) {
                  buttonClass += "border-green bg-green/10 text-green";
                } else if (index === selectedAnswer) {
                  buttonClass += "border-destructive bg-destructive/10 text-destructive";
                } else {
                  buttonClass += "border-border bg-muted/50 text-muted-foreground opacity-50";
                }
              } else {
                buttonClass += "border-border bg-card hover:border-primary hover:bg-primary/5 text-foreground cursor-pointer";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isCompleted}
                  className={buttonClass}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                    {isCompleted && index === question.correctIndex && (
                      <CheckCircle className="w-5 h-5 ml-auto text-green" />
                    )}
                    {isCompleted && index === selectedAnswer && index !== question.correctIndex && (
                      <XCircle className="w-5 h-5 ml-auto text-destructive" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hint button */}
          {!isCompleted && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-sm text-primary hover:text-primary/80 font-medium mb-4"
            >
              Need a hint? 💡
            </button>
          )}

          {/* Hint */}
          {showHint && !isCompleted && (
            <div className="bg-primary/10 rounded-lg p-3 mb-4 text-sm text-foreground">
              💡 <span className="font-medium">Hint:</span> {question.hint}
            </div>
          )}

          {/* Result feedback */}
          {isCompleted && (
            <div className={`rounded-xl p-4 ${isCorrect ? 'bg-green/10 border border-green/20' : 'bg-accent/10 border border-accent/20'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${isCorrect ? 'bg-green/20' : 'bg-accent/20'}`}>
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-accent" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground mb-1">
                    {isCorrect ? "Correct!" : "Almost there!"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isCorrect ? question.encouragement : `The answer is ${question.options[question.correctIndex]}. ${question.encouragement}`}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Come back tomorrow for a new question! 🌟
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetry}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Try again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuestionOfTheDay;
