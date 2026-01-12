import { useState, useCallback } from 'react';
import { Brain, Calculator, HelpCircle, Sparkles, Loader2, BookOpen, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type StudyMode = 'explain' | 'practice' | 'quiz';

interface ModeConfig {
  id: StudyMode;
  label: string;
  icon: typeof Brain;
  description: string;
  placeholder: string;
  buttonText: string;
  color: string;
}

const modes: ModeConfig[] = [
  {
    id: 'explain',
    label: 'Simple Explainer',
    icon: Brain,
    description: 'Get easy-to-understand explanations',
    placeholder: 'e.g., Photosynthesis, Fractions, The Solar System...',
    buttonText: 'Explain It!',
    color: 'bg-purple/10 text-purple border-purple/20 hover:bg-purple/20',
  },
  {
    id: 'practice',
    label: 'Practice Problems',
    icon: Calculator,
    description: 'Get fun practice problems with solutions',
    placeholder: 'e.g., Multiplication, Geometry, Word problems...',
    buttonText: 'Generate Problems!',
    color: 'bg-blue/10 text-blue border-blue/20 hover:bg-blue/20',
  },
  {
    id: 'quiz',
    label: 'Quick Quiz',
    icon: HelpCircle,
    description: 'Test your knowledge with a mini quiz',
    placeholder: 'e.g., Ancient Egypt, Dinosaurs, Grammar...',
    buttonText: 'Start Quiz!',
    color: 'bg-pink/10 text-pink border-pink/20 hover:bg-pink/20',
  },
];

const AIStudyHelper = () => {
  const [activeMode, setActiveMode] = useState<StudyMode>('explain');
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentMode = modes.find((m) => m.id === activeMode)!;

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast({
        title: 'Please enter a topic',
        description: 'Type something you want to learn about!',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-study-helper', {
        body: {
          topic: topic.trim(),
          mode: activeMode,
          gradeLevel: 'elementary to middle school (ages 8-14)',
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.result) {
        setResult(data.result);
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('AI Study Helper error:', error);
      toast({
        title: 'Oops! Something went wrong',
        description: error instanceof Error ? error.message : 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [topic, activeMode, toast]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading && topic.trim()) {
        handleGenerate();
      }
    },
    [handleGenerate, isLoading, topic]
  );

  const handleModeChange = useCallback((mode: StudyMode) => {
    setActiveMode(mode);
    setResult('');
  }, []);

  return (
    <section
      id="ai-helper"
      className="py-10 sm:py-14 md:py-18 lg:py-20 px-4 sm:px-6 lg:px-8 relative z-10"
      aria-labelledby="ai-helper-heading"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple/10 to-pink/10 text-purple px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm mb-3 sm:mb-4 border border-purple/20">
            <Sparkles size={16} aria-hidden="true" />
            Powered by AI
          </div>
          <h2
            id="ai-helper-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3"
          >
            AI Study Helper ✨
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Your personal learning companion! Get explanations, practice problems, and quizzes on any topic.
          </p>
        </header>

        <Card className="overflow-hidden border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
          {/* Decorative header gradient */}
          <div
            className="h-1.5 bg-gradient-to-r from-purple via-blue to-pink"
            aria-hidden="true"
          />

          {/* Mode Tabs */}
          <div className="flex border-b border-border overflow-x-auto" role="tablist" aria-label="Study modes">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${mode.id}-panel`}
                  className={`flex-1 min-w-[140px] p-3 sm:p-4 md:p-5 font-bold text-xs sm:text-sm md:text-base flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <Icon size={18} className="shrink-0" aria-hidden="true" />
                  <span className="text-center sm:text-left">{mode.label}</span>
                </button>
              );
            })}
          </div>

          <CardContent
            id={`${activeMode}-panel`}
            role="tabpanel"
            aria-labelledby={activeMode}
            className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6"
          >
            {/* Mode Description */}
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-muted/50 border border-border">
              <div className={`p-2 sm:p-2.5 rounded-lg ${currentMode.color}`}>
                <currentMode.icon size={20} aria-hidden="true" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">{currentMode.description}</p>
            </div>

            {/* Input Section */}
            <div className="space-y-3 sm:space-y-4">
              <label htmlFor="topic-input" className="block text-sm sm:text-base font-bold text-foreground">
                What would you like to learn about?
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  id="topic-input"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentMode.placeholder}
                  disabled={isLoading}
                  className="flex-1 bg-card border-2 border-border text-sm sm:text-base px-4 py-3 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  maxLength={200}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !topic.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-orange hover:opacity-90 text-primary-foreground font-bold px-6 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                      <span>{currentMode.buttonText}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Result Display */}
            {result && (
              <div
                className="bg-card rounded-2xl p-4 sm:p-6 border-2 border-primary/20 shadow-sm animate-fade-in"
                role="region"
                aria-label="AI Response"
                aria-live="polite"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-primary/20 to-purple/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                    <BookOpen className="text-primary w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">
                      {activeMode === 'explain' && '📚 Here is your explanation:'}
                      {activeMode === 'practice' && '✏️ Practice Problems:'}
                      {activeMode === 'quiz' && '🎯 Quiz Time!'}
                    </h3>
                    <div className="prose prose-sm sm:prose-base max-w-none text-foreground leading-relaxed whitespace-pre-line">
                      {result}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Helper Text */}
            {!result && !isLoading && (
              <p className="text-center text-xs sm:text-sm text-muted-foreground pt-2">
                💡 Tip: Be specific! Instead of "math", try "adding fractions with different denominators"
              </p>
            )}
          </CardContent>
        </Card>

        {/* Bottom encouragement */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
          Learning is an adventure! 🚀 Ask as many questions as you want.
        </p>
      </div>
    </section>
  );
};

export default AIStudyHelper;
