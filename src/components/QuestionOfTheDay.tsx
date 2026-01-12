import { useState, useEffect, useCallback } from 'react';
import { Lightbulb, CheckCircle, XCircle, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  funFact: string;
  subject: 'math' | 'science' | 'english';
}

const questions: Question[] = [
  {
    id: 1,
    question: "If you have 3 pizzas and each pizza has 8 slices, how many slices do you have in total?",
    options: ["24 slices", "21 slices", "11 slices", "32 slices"],
    correctIndex: 0,
    hint: "Try multiplying the number of pizzas by the slices per pizza! 🍕",
    funFact: "The largest pizza ever made was 131 feet wide!",
    subject: 'math'
  },
  {
    id: 2,
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Saturn", "Jupiter", "Neptune"],
    correctIndex: 2,
    hint: "It's named after the king of Roman gods! 👑",
    funFact: "Jupiter is so big that over 1,300 Earths could fit inside it!",
    subject: 'science'
  },
  {
    id: 3,
    question: "Which word is a noun: 'quickly', 'happiness', 'beautiful', or 'run'?",
    options: ["quickly", "happiness", "beautiful", "run"],
    correctIndex: 1,
    hint: "A noun is a person, place, thing, or feeling! 💭",
    funFact: "The word 'set' has the most definitions of any English word!",
    subject: 'english'
  },
  {
    id: 4,
    question: "What is 25% of 80?",
    options: ["15", "20", "25", "40"],
    correctIndex: 1,
    hint: "25% means one quarter. Try dividing by 4! ✨",
    funFact: "The word 'percent' comes from Latin meaning 'per hundred'!",
    subject: 'math'
  },
  {
    id: 5,
    question: "Which part of the plant makes food using sunlight?",
    options: ["Roots", "Stem", "Leaves", "Flowers"],
    correctIndex: 2,
    hint: "This process is called photosynthesis! 🌿",
    funFact: "A single tree can produce enough oxygen for 2 people per year!",
    subject: 'science'
  },
  {
    id: 6,
    question: "What is the past tense of 'swim'?",
    options: ["swimmed", "swam", "swum", "swimming"],
    correctIndex: 1,
    hint: "It's an irregular verb - it doesn't follow the usual '-ed' rule! 🏊",
    funFact: "English has about 200 irregular verbs!",
    subject: 'english'
  },
  {
    id: 7,
    question: "If a rectangle has a length of 6 and width of 4, what is its area?",
    options: ["10", "20", "24", "28"],
    correctIndex: 2,
    hint: "Area = length × width 📐",
    funFact: "Ancient Egyptians used geometry to rebuild field boundaries after the Nile flooded!",
    subject: 'math'
  }
];

const subjectColors = {
  math: 'bg-blue/10 text-blue border-blue/20',
  science: 'bg-green/10 text-green border-green/20',
  english: 'bg-purple/10 text-purple border-purple/20'
};

const subjectLabels = {
  math: '🧮 Math',
  science: '🔬 Science',
  english: '📚 English'
};

const QuestionOfTheDay = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [todayQuestion, setTodayQuestion] = useState<Question>(questions[0]);

  // Get today's question based on day of year
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const questionIndex = dayOfYear % questions.length;
    setTodayQuestion(questions[questionIndex]);

    // Check localStorage for today's answer
    const savedData = localStorage.getItem('qotd-answer');
    if (savedData) {
      const { date, answered, answer } = JSON.parse(savedData);
      const today = now.toDateString();
      if (date === today && answered) {
        setHasAnswered(true);
        setSelectedAnswer(answer);
      }
    }
  }, []);

  const handleAnswerSelect = useCallback((index: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(index);
    setHasAnswered(true);
    
    // Save to localStorage
    const today = new Date().toDateString();
    localStorage.setItem('qotd-answer', JSON.stringify({
      date: today,
      answered: true,
      answer: index
    }));
  }, [hasAnswered]);

  const handleTryAgain = useCallback(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowHint(false);
    localStorage.removeItem('qotd-answer');
  }, []);

  const isCorrect = selectedAnswer === todayQuestion.correctIndex;

  return (
    <section 
      id="question-of-the-day" 
      className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative z-10"
      aria-labelledby="qotd-heading"
    >
      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
          {/* Decorative header */}
          <div className="bg-gradient-to-r from-primary via-orange to-pink p-1" aria-hidden="true" />
          
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <CardTitle 
                id="qotd-heading"
                className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-bold text-foreground"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                Question of the Day
              </CardTitle>
              <span 
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold border ${subjectColors[todayQuestion.subject]}`}
              >
                {subjectLabels[todayQuestion.subject]}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Challenge yourself daily! A new question appears every day. ✨
            </p>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            {/* Question */}
            <div className="bg-muted/50 rounded-xl p-3 sm:p-4 md:p-6">
              <p className="text-sm sm:text-base md:text-lg font-medium text-foreground leading-relaxed">
                {todayQuestion.question}
              </p>
            </div>

            {/* Options */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
              role="radiogroup"
              aria-label="Answer options"
            >
              {todayQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === todayQuestion.correctIndex;
                
                let optionClasses = "p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left font-medium text-sm sm:text-base ";
                
                if (hasAnswered) {
                  if (isCorrectAnswer) {
                    optionClasses += "bg-green/10 border-green text-green";
                  } else if (isSelected && !isCorrectAnswer) {
                    optionClasses += "bg-destructive/10 border-destructive text-destructive";
                  } else {
                    optionClasses += "bg-muted/30 border-border text-muted-foreground opacity-50";
                  }
                } else {
                  optionClasses += "bg-card border-border hover:border-primary hover:bg-primary/5 cursor-pointer";
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
                    <span className="flex items-center gap-2">
                      {hasAnswered && isCorrectAnswer && (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
                      )}
                      {hasAnswered && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
                      )}
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Hint button */}
            {!hasAnswered && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="text-primary hover:text-primary/80 hover:bg-primary/10"
                >
                  <Lightbulb className="w-4 h-4 mr-2" aria-hidden="true" />
                  {showHint ? 'Hide Hint' : 'Need a Hint?'}
                </Button>
              </div>
            )}

            {/* Hint display */}
            {showHint && !hasAnswered && (
              <div 
                className="bg-primary/10 border border-primary/20 rounded-xl p-3 sm:p-4 text-center"
                role="note"
                aria-label="Hint"
              >
                <p className="text-sm sm:text-base text-primary font-medium">
                  💡 {todayQuestion.hint}
                </p>
              </div>
            )}

            {/* Result feedback */}
            {hasAnswered && (
              <div 
                className={`rounded-xl p-4 sm:p-6 text-center space-y-3 ${
                  isCorrect 
                    ? 'bg-gradient-to-br from-green/10 to-green/5 border-2 border-green/20' 
                    : 'bg-gradient-to-br from-orange/10 to-primary/5 border-2 border-orange/20'
                }`}
                role="status"
                aria-live="polite"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl">
                  {isCorrect ? '🎉' : '💪'}
                </div>
                <h3 className={`font-bold text-base sm:text-lg ${isCorrect ? 'text-green' : 'text-orange'}`}>
                  {isCorrect ? 'Amazing! You got it right!' : "Good try! Keep learning!"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  <span className="font-semibold text-foreground">Fun Fact:</span> {todayQuestion.funFact}
                </p>
                
                {!isCorrect && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTryAgain}
                    className="mt-2 border-primary text-primary hover:bg-primary/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
                    Try Again
                  </Button>
                )}
              </div>
            )}

            {/* Encouragement */}
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              Come back tomorrow for a new challenge! 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuestionOfTheDay;
