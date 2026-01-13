import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, Dna, Calculator, BookOpen, Globe, Trophy, Sparkles, History as HistoryIcon, LayoutDashboard, Trash2 } from "lucide-react";

// ==========================================
// 1. TYPES & DATA GENERATORS
// ==========================================

type Subject = "math" | "science" | "english" | "social-studies";
interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  subject: Subject;
  userResult?: "correct" | "wrong";
}
const SUBJECT_THEMES = {
  math: {
    bg: "bg-blue-500",
    icon: <Calculator className="w-4 h-4" />,
    label: "Math"
  },
  science: {
    bg: "bg-emerald-500",
    icon: <Dna className="w-4 h-4" />,
    label: "Science"
  },
  english: {
    bg: "bg-purple-500",
    icon: <BookOpen className="w-4 h-4" />,
    label: "English"
  },
  "social-studies": {
    bg: "bg-amber-500",
    icon: <Globe className="w-4 h-4" />,
    label: "History & Civics"
  }
};

// --- DATA BANKS ---

const generateMath = (seed: number, level: number) => {
  const range = level * 12;
  const a = seed % range + 2;
  const b = seed % 10 + 2;
  if (level > 3 && seed % 2 === 0) {
    const pct = [10, 20, 25, 50][seed % 4];
    const val = a * 10;
    return {
      q: `What is ${pct}% of ${val}?`,
      a: (val * pct / 100).toString(),
      d: [(val / 2).toString(), (val / 4).toString(), (val / 10).toString()],
      f: "Percent means 'per hundred' in Latin!"
    };
  }
  return {
    q: `Solve: ${a} × ${b} + ${level}`,
    a: (a * b + level).toString(),
    d: [(a * b).toString(), (a + b).toString(), (a * b - level).toString()],
    f: "The equals sign (=) was invented in 1557."
  };
};
const getEnglish = (seed: number, level: number) => {
  const bank = [{
    q: "Which is a NOUN?",
    a: "Happiness",
    d: ["Quickly", "Run", "Blue"],
    lv: 1
  }, {
    q: "Antonym of 'Vivid'?",
    a: "Dull",
    d: ["Bright", "Shiny", "Detailed"],
    lv: 3
  }, {
    q: "Identify the 'Metaphor'.",
    a: "Time is a thief",
    d: ["Quiet as a mouse", "The sun is hot", "I am tired"],
    lv: 4
  }];
  const filtered = bank.filter(i => i.lv <= level) || [bank[0]];
  return filtered[seed % filtered.length];
};
const getSocial = (seed: number, level: number) => {
  const bank = [{
    q: "Smallest continent?",
    a: "Australia",
    d: ["Europe", "Antarctica", "Asia"],
    lv: 1
  }, {
    q: "Year of the Magna Carta?",
    a: "1215",
    d: ["1776", "1066", "1492"],
    lv: 5
  }, {
    q: "Who wrote the Declaration of Independence?",
    a: "Thomas Jefferson",
    d: ["George Washington", "Ben Franklin", "Abraham Lincoln"],
    lv: 3
  }];
  const filtered = bank.filter(i => i.lv <= level) || [bank[0]];
  return filtered[seed % filtered.length];
};
const getScience = (seed: number, level: number) => {
  const bank = [{
    q: "Closest planet to the Sun?",
    a: "Mercury",
    d: ["Venus", "Mars", "Earth"],
    lv: 1
  }, {
    q: "Chemical symbol for Gold?",
    a: "Au",
    d: ["Ag", "Fe", "Gd"],
    lv: 4
  }, {
    q: "Main gas in Earth's atmosphere?",
    a: "Nitrogen",
    d: ["Oxygen", "Carbon", "Hydrogen"],
    lv: 3
  }];
  const filtered = bank.filter(i => i.lv <= level) || [bank[0]];
  return filtered[seed % filtered.length];
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function QuestionOfTheDay() {
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [history, setHistory] = useState<Question[]>([]);
  const [view, setView] = useState<"game" | "history">("game");
  const [status, setStatus] = useState<"unanswered" | "correct" | "wrong">("unanswered");
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const generateNew = useCallback(() => {
    const subjects: Subject[] = ["math", "english", "social-studies", "science"];
    const sub = subjects[Math.floor(Math.random() * subjects.length)];
    const seed = Math.floor(Math.random() * 1000);
    let data: any;
    if (sub === "math") data = generateMath(seed, level);else if (sub === "english") data = getEnglish(seed, level);else if (sub === "social-studies") data = getSocial(seed, level);else data = getScience(seed, level);
    const options = [data.a, ...data.d].sort(() => Math.random() - 0.5);
    setActiveQuestion({
      id: `q-${Date.now()}`,
      question: data.q,
      options,
      correctIndex: options.indexOf(data.a),
      funFact: data.f || "Learning new things creates new connections in your brain!",
      subject: sub
    });
    setStatus("unanswered");
    setView("game");
  }, [level]);
  useEffect(() => {
    const savedHistory = localStorage.getItem("edu-history");
    const savedLevel = localStorage.getItem("edu-level");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedLevel) setLevel(parseInt(savedLevel));
    generateNew();
  }, []);
  const handleAnswer = (idx: number) => {
    if (status !== "unanswered" || !activeQuestion) return;
    const isCorrect = idx === activeQuestion.correctIndex;
    const finalStatus: "correct" | "wrong" = isCorrect ? "correct" : "wrong";
    setStatus(finalStatus);
    const updated: Question = {
      ...activeQuestion,
      userResult: finalStatus
    };
    const newHistory = [updated, ...history].slice(0, 15);
    setHistory(newHistory);
    localStorage.setItem("edu-history", JSON.stringify(newHistory));
    if (isCorrect) {
      setStreak(s => s + 1);
      if (streak % 2 === 1) setLevel(l => Math.min(l + 1, 5));
    } else {
      setStreak(0);
      setLevel(l => Math.max(1, l - 1));
    }
  };
  if (!activeQuestion) return null;
  const theme = SUBJECT_THEMES[activeQuestion.subject];
  return;
}