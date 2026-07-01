export interface KeyStats {
  attempts: number;
  errors: number;
  totalLatencyMs: number;
}

export type KeyboardLayout = 'qwerty' | 'dvorak' | 'colemak';

export interface PracticeSession {
  id: string;
  timestamp: string;
  lessonTitle: string;
  lessonType: 'general' | 'ai-adaptive' | 'coding' | 'shortcut';
  wpm: number;
  accuracy: number;
  durationMs: number;
  weakKeysIdentified: string[];
}

export interface UserProfile {
  username: string;
  level: number;
  xp: number;
  speedGoal: number;
  layout: KeyboardLayout;
  theme?: 'cosmic' | 'terminal' | 'sepia' | 'aurora' | 'sakura' | 'blueblack';
  soundEnabled?: boolean;
  soundType?: 'click' | 'thud';
  streakDays: number;
  maxStreakDays: number;
  lastPracticeDate: string | null;
  keyStats: Record<string, KeyStats>;
  history: PracticeSession[];
  unlockedAchievements: string[];
}

export interface Lesson {
  id: string;
  title: string;
  category: 'Home Row' | 'Top Row' | 'Bottom Row' | 'Numbers' | 'Numpad' | 'Curated Sentences' | 'Paragraphs' | 'AI Custom' | 'Capitalization' | 'Symbols' | 'Basics: Home Row' | 'Basics: Top Row' | 'Basics: Bottom Row' | 'Mastery: N-Grams' | 'Pro Tips: Sentences' | 'Advanced: Shift & Caps' | 'Advanced: Numbers & Symbols';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  text: string;
  description: string;
}

export interface CodingLesson {
  id: string;
  language: 'python' | 'javascript' | 'html-css' | 'sql' | 'typescript';
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  code: string;
  explanation: string;
  snippet_type: string;
}

export interface ShortcutLesson {
  id: string;
  platform: 'Windows/Linux' | 'macOS' | 'VS Code' | 'Browser' | 'Universal';
  title: string;
  keys: string[]; // e.g. ['Control', 'c']
  description: string;
  context: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirementType: 'streak' | 'wpm' | 'accuracy' | 'lessons' | 'xp';
  requirementValue: number;
}
