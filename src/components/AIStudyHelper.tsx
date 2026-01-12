import { useState, useEffect, useCallback, useMemo } from "react";
import { Lightbulb, CheckCircle, XCircle, Sparkles, RotateCcw, Brain, ArrowRight, Dna, Calculator, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Types ---
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

// --- 1. THE STATIC DATABASE (Science & English) ---
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

// --- 2. THE "AI" LOGIC (Procedural Math Generator) ---
// This generates infinite unique questions on the fly
const generateMathQuestion = (seed: number): Question => {
  // Use the seed to deterministically choose a type of math problem
  const type = seed % 3; // 0: Arithmetic, 1: Geometry, 2: Percentage

  if (type === 0) {
    // Arithmetic: (A x B) + C
    const a = seed % 9 + 2; // 2 to 10
    const b = seed % 8 + 3; // 3 to 10
    const c = seed % 15 + 5; // 5 to 20
    const ans = a * b + c;

    // Generate smart distractors (close to the real answer)
    const options = [`${ans}`, `${ans + a}`, `${ans - b}`, `${(a + c) * b}`].sort(() => Math.random() - 0.5); // Shuffle

    return {
      id: `m-${seed}`,
      question: `Solve: (${a} × ${b}) + ${c} = ?`,
      options: options,
      correctIndex: options.indexOf(`${ans}`),
      hint: `Remember Order of Operations (PEMDAS): Multiply first, then add!`,
      funFact: "The equal sign (=) was invented in 1557 by a Welsh mathematician who was tired of writing 'is equal to'.",
      subject: "math"
    };
  } else if (type === 1) {
    // Geometry: Area of Rectangle
    const w = seed % 8 + 3;
    const l = w + seed % 5 + 2;
    const area = w * l;
    const options = [`${area}`, `${2 * (w + l)}`,
    // Perimeter (common mistake)
    `${area + w}`, `${w * w}`].sort(() => Math.random() - 0.5);
    return {
      id: `m-${seed}`,
      question: `A rectangle has a width of ${w} and a length of ${l}. What is its area?`,
      options: options,
      correctIndex: options.indexOf(`${area}`),
      hint: "Area = Length × Width 📐",
      funFact: "Geometry means 'Earth Measurement' in Greek!",
      subject: "math"
    };
  } else {
    // Percentage
    const pct = [10, 20, 25, 50][seed % 4];
    const whole = (seed % 10 + 1) * 100; // 100, 200, ... 1000
    const ans = whole * pct / 100;
    const options = [`${ans}`, `${ans / 2}`, `${ans * 2}`, `${whole - pct}`].sort(() => Math.random() - 0.5);
    return {
      id: `m-${seed}`,
      question: `What is ${pct}% of ${whole}?`,
      options: options,
      correctIndex: options.indexOf(`${ans}`),
      hint: `Try converting ${pct}% to a decimal (${pct / 100}) and multiplying!`,
      funFact: "Percentages are reversible! 8% of 25 is the same as 25% of 8.",
      subject: "math"
    };
  }
};

// --- Styles ---
const subjectStyles = {
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
  }
};
const QuestionOfTheDay = () => {
  const [mounted, setMounted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<"unanswered" | "correct" | "wrong">("unanswered");
  const [isDaily, setIsDaily] = useState(true); // Is this the official "Question of the Day"?

  // 1. Core Logic: Get the "Question of the Day"
  const getDailyQuestion = useCallback(() => {
    const now = new Date();
    const seedString = now.toDateString(); // "Mon Jan 01 2024"

    // Create a numeric hash from the date
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
    }
    const positiveHash = Math.abs(hash);

    // Logic:
    // - Even days: Math (Generated)
    // - Odd days: Static (Science/English)
    if (positiveHash % 2 === 0) {
      return generateMathQuestion(positiveHash);
    } else {
      const index = positiveHash % staticQuestions.length;
      return staticQuestions[index];
    }
  }, []);

  // 2. Logic: Generate a random "Next" question (Practice Mode)
  const getNextRandomQuestion = useCallback(() => {
    const randomSeed = Math.floor(Math.random() * 10000);
    // 50% chance of Math, 50% chance of Static
    if (Math.random() > 0.5) {
      return generateMathQuestion(randomSeed);
    } else {
      const index = randomSeed % staticQuestions.length;
      return staticQuestions[index];
    }
  }, []);

  // 3. Initialize
  useEffect(() => {
    setMounted(true);
    const dailyQ = getDailyQuestion();
    setActiveQuestion(dailyQ);

    // Check LocalStorage only for the DAILY question
    const savedData = localStorage.getItem("qotd-answer");
    if (savedData) {
      try {
        const {
          date,
          answered,
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

    // Only save to localStorage if it's the official daily question
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
    // Reset state for new question
    setIsDaily(false);
    setSelectedAnswer(null);
    setShowHint(false);
    setStatus("unanswered");
    setActiveQuestion(getNextRandomQuestion());
  };
  if (!mounted || !activeQuestion) return null;
  const style = subjectStyles[activeQuestion.subject];
  return;
};
export default QuestionOfTheDay;