// ==========================================
// 1. UPDATED PROCEDURAL GENERATOR
// ==========================================

const generateMathQuestion = (seed: number, level: number = 1): Question => {
  const type = seed % 3;
  let question = "";
  let answer = 0;
  let hint = "";

  // DIFFICULTY SCALING LOGIC
  // Level 1: Small numbers (2-10)
  // Level 5: Large numbers (20-100) + complex operations
  const multiplier = level * 5;

  if (type === 0) {
    // Arithmetic: (A * B) + C
    const a = (seed % (5 + level)) + 2;
    const b = (seed % (3 + level)) + 2;
    const c = (seed % multiplier) + 2;
    answer = a * b + c;
    question = `Solve: (${a} × ${b}) + ${c} = ?`;
    hint = "Multiply first, then add the last number!";
  } else if (type === 1) {
    // Geometry: Area
    const w = (seed % (4 + level)) + 2;
    const l = w + (seed % level) + 2;
    answer = w * l;
    question = `A room is ${w}m wide and ${l}m long. What is the total area in square meters?`;
    hint = "Area is just Width times Length! 📐";
  } else {
    // Percentages: Scaled by difficulty
    const percentages = [10, 20, 25, 50, 75];
    const pct = percentages[Math.min(level - 1, percentages.length - 1)];
    const base = level > 3 ? (seed % 10) * 25 : (seed % 10) * 20;
    const whole = base + 100;
    answer = (whole * pct) / 100;
    question = `What is ${pct}% of ${whole}?`;
    hint = `Try finding 10% first, then multiply.`;
  }

  // Generate unique distractor options
  const optionsSet = new Set<string>();
  optionsSet.add(answer.toString());
  while (optionsSet.size < 4) {
    const offset = Math.floor(Math.random() * multiplier) + 1;
    const distractor = Math.random() > 0.5 ? answer + offset : Math.max(0, answer - offset);
    optionsSet.add(distractor.toString());
  }

  const shuffledOptions = Array.from(optionsSet).sort(() => (seed % 2 === 0 ? 1 : -1));

  return {
    id: `math-lv${level}-${seed}`,
    question,
    options: shuffledOptions,
    correctIndex: shuffledOptions.indexOf(answer.toString()),
    hint,
    funFact: `You are currently playing at Difficulty Level ${level}!`,
    subject: "math",
  };
};

// ==========================================
// 2. MAIN COMPONENT WITH ENGINE LOGIC
// ==========================================

// ... inside QuestionOfTheDay component ...

const [level, setLevel] = useState(1);
const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

// Initialize Level from Storage
useEffect(() => {
  const savedLevel = localStorage.getItem("qotd-level");
  if (savedLevel) setLevel(parseInt(savedLevel));
}, []);

const handleAnswerSelect = (index: number) => {
  if (!activeQuestion || status !== "unanswered") return;

  const isCorrect = index === activeQuestion.correctIndex;
  setSelectedAnswer(index);
  setStatus(isCorrect ? "correct" : "wrong");

  // ADAPTIVE ENGINE LOGIC
  let nextLevel = level;
  let nextConsecutive = 0;

  if (isCorrect) {
    nextConsecutive = consecutiveCorrect + 1;
    // Level up after 2 correct answers, max level 5
    if (nextConsecutive >= 2 && level < 5) {
      nextLevel = level + 1;
      nextConsecutive = 0; // Reset counter for next tier
    }
  } else {
    // Level down immediately on mistake to build confidence, min level 1
    nextLevel = Math.max(1, level - 1);
    nextConsecutive = 0;
  }

  setConsecutiveCorrect(nextConsecutive);
  setLevel(nextLevel);
  localStorage.setItem("qotd-level", nextLevel.toString());

  // ... (rest of your existing persistence/streak logic)
};
