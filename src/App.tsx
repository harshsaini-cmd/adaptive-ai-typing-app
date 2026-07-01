// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import {
  Keyboard as KeyboardIcon,
  BookOpen,
  BarChart3,
  Sparkles,
  RotateCcw,
  Award,
  CheckCircle2,
  Target,
  User,
  RefreshCw,
  Flame,
  AlertTriangle,
  Code,
  Zap,
  Check,
  ChevronRight,
  Info,
  Settings,
  Brain,
  HelpCircle,
  Play,
  Terminal,
  Palette,
  Volume2,
  VolumeX,
  Trophy,
  Activity,
  Share2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import {
  UserProfile,
  Lesson,
  CodingLesson,
  ShortcutLesson,
  PracticeSession,
  KeyStats
} from "./types";
import {
  CURATED_LESSONS,
  CODING_LESSONS,
  SHORTCUT_LESSONS,
  ACHIEVEMENTS_LIST
} from "./data/lessons";
import Keyboard from "./components/Keyboard";
import { THEMES, ThemeId } from "./data/themes";
import { playKeyClickSound, playKeyThudSound } from "./utils/sound";

// Initial Profile setup with offline local persistence fallback
const DEFAULT_PROFILE: UserProfile = {
  username: "CodePilot",
  level: 1,
  xp: 150,
  speedGoal: 65,
  layout: "qwerty",
  theme: "blueblack",
  soundEnabled: true,
  soundType: "click",
  streakDays: 3,
  maxStreakDays: 12,
  lastPracticeDate: new Date().toISOString().split("T")[0],
  keyStats: {
    "e": { attempts: 18, errors: 1, totalLatencyMs: 4100 },
    "t": { attempts: 15, errors: 0, totalLatencyMs: 3100 },
    "a": { attempts: 14, errors: 2, totalLatencyMs: 5120 },
    "o": { attempts: 12, errors: 0, totalLatencyMs: 2400 },
    "p": { attempts: 10, errors: 3, totalLatencyMs: 7600 },
    "q": { attempts: 6, errors: 2, totalLatencyMs: 4400 }
  },
  history: [
    {
      id: "hist-1",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      lessonTitle: "The Home Row Base",
      lessonType: "general",
      wpm: 48,
      accuracy: 94,
      durationMs: 45000,
      weakKeysIdentified: ["a", "f"]
    },
    {
      id: "hist-2",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      lessonTitle: "Reaching Top Row",
      lessonType: "general",
      wpm: 56,
      accuracy: 92,
      durationMs: 38000,
      weakKeysIdentified: ["p", "q"]
    }
  ],
  unlockedAchievements: ["streak-3", "wpm-45"]
};

export interface ComedicTier {
  name: string;
  description: string;
  color: string;
  textColor: string;
  borderColor: string;
  emoji: string;
}

export function getComedicTier(wpm: number): ComedicTier {
  if (wpm === 0) {
    return {
      name: "Keyboard Sleeper",
      description: "Resting your forehead on the keyboard does not count as typing. Wake up and start tapping!",
      color: "bg-slate-500/10",
      textColor: "text-slate-400",
      borderColor: "border-slate-500/20",
      emoji: "😴"
    };
  }
  if (wpm <= 15) {
    return {
      name: "Snail on Tranquilizers",
      description: "Absolute safety first. You are typing so cautiously that local moss has started growing on your knuckles.",
      color: "bg-rose-500/10",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/20",
      emoji: "🐌"
    };
  }
  if (wpm <= 30) {
    return {
      name: "Depressed Tortoise",
      description: "You are striking keys with the dynamic speeds of tectonic continental drift. But hey, neat accuracy!",
      color: "bg-amber-500/10",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/20",
      emoji: "🐢"
    };
  }
  if (wpm <= 45) {
    return {
      name: "Polite Butler in Boxing Gloves",
      description: "Extremely dignified, formal keystrokes, yet severely hampered by invisible massive oven mitts.",
      color: "bg-yellow-500/10",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-500/20",
      emoji: "🐧"
    };
  }
  if (wpm <= 60) {
    return {
      name: "Average wage earner",
      description: "Perfect corporate cruise rate. Zooming just enough to look productive while secretly shopping on eBay.",
      color: "bg-blue-500/10",
      textColor: "text-blue-450",
      borderColor: "border-blue-500/20",
      emoji: "💼"
    };
  }
  if (wpm <= 75) {
    return {
      name: "Caffeine Jitterbug",
      description: "Snappy, precise, and highly active! The physical vibrations of your double-shot espresso are doing wonders.",
      color: "bg-teal-500/10",
      textColor: "text-teal-400",
      borderColor: "border-teal-500/20",
      emoji: "☕"
    };
  }
  if (wpm <= 90) {
    return {
      name: "Keyboard Smoker",
      description: "Friction alert! Minor plastic melting smells are normal at this speed. Local processors are feeling highly threatened.",
      color: "bg-orange-500/10",
      textColor: "text-orange-400",
      borderColor: "border-orange-500/20",
      emoji: "🔥"
    };
  }
  if (wpm <= 110) {
    return {
      name: "Sonic the Hedgehog's Amanuensis",
      description: "An absolute blur of fingers! You are typing with the ferocious velocity of a cornered honey-badger.",
      color: "bg-indigo-500/10",
      textColor: "text-indigo-400",
      borderColor: "border-indigo-500/20",
      emoji: "☄️"
    };
  }
  return {
    name: "Ascended Cybernetic Entity",
    description: "Your absolute conscious mind has merged with the device's chip controllers. You type in speed dimensions humans don't comprehend.",
    color: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    emoji: "🧠"
  };
}

const COMMON_TYPING_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would",
  "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can",
  "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them",
  "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use",
  "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day",
  "most", "us", "are", "was", "were", "been", "has", "had", "more", "some", "here", "there", "then", "than", "out", "our",
  "more", "must", "make", "made", "many", "much", "may", "might", "most", "find", "found", "long", "show", "give", "given",
  "form", "work", "play", "part", "point", "place", "case", "state", "system", "group", "school", "here", "hear", "high",
  "right", "write", "read", "run", "keep", "hold", "turn", "start", "stop", "end", "begin", "create", "design", "build",
  "code", "space", "key", "letter", "word", "sentence", "paragraph", "text", "type", "fast", "slow", "speed", "score",
  "program", "logic", "click", "tap", "finger", "hand", "mind", "focus", "flow", "rhythm", "sound", "volume", "tone",
  "press", "release", "swift", "calm", "track", "trail", "sprint", "race", "goal", "target", "perfect", "clean", "fresh",
  "great", "small", "large", "little", "power", "light", "dark", "night", "day", "week", "month", "year", "life", "world"
];

const EDGY_SENTENCES = [
  "bro touched grass once and called it character development",
  "wifi stronger than your situationship",
  "your battery lasts longer than your attention span",
  "born to lock in forced to scroll reels",
  "your sleep schedule filed for divorce",
  "if delusion paid rent you would own dubai",
  "your playlist knows more secrets than your therapist",
  "typing faster will not fix your life but keep going",
  "every notification is a side quest",
  "your brain opened thirty tabs and crashed",
  "even my alarm clock gave up on me",
  "happiness left me on read",
  "my guardian angel requested a transfer",
  "life keeps spawning side quests nobody asked for",
  "if bad timing was a sport id be world champion",
  "rock bottom started charging rent",
  "plot twist everyone was equally confused",
  "i lost the plot around chapter three",
  "they said forever then updated their bio",
  "your ex is someone elses canon event",
  "love is temporary screenshots are forever",
  "communication is cheaper than therapy",
  "the relationship ended the playlist survived",
  "trust your gut not their snap score",
  "assignment due tomorrow motivation arriving next week",
  "caffeine has more attendance than me",
  "studying starts after one more video",
  "calculator works harder than i do",
  "procrastination deserves an olympic medal",
  "the syllabus keeps unlocking new bosses",
  "skill issue sounds personal now",
  "one more game became sunrise",
  "carried the squad still failed the exam",
  "the boss fight was easier than monday",
  "papa entered the room volume automatically reduced",
  "indian parents invented emotional speedrunning",
  "relatives unlock after every exam result",
  "sharma ji is the final boss",
  "maggi has carried this nation for decades",
  "auto bhaiya always knows a shortcut",
  "hostel food builds unforgettable memories unfortunately",
  "coaching taught trauma with free chemistry",
  "engineering students survive on chai and hope",
  "indian weddings have better networking than linkedin",
  "the fan spins harder than my career plans",
  "turning it off and on still works",
  "github commits look better than my grades",
  "ai writes essays humans take credit",
  "keyboard louder than my ambitions",
  "i came i saw i forgot why",
  "my brain runs on low battery mode",
  "professional overthinker since childhood",
  "i win imaginary arguments daily",
  "i am fluent in making things awkward",
  "every plan ends with maybe tomorrow",
  "negative aura farming",
  "im emotionally unavailable is somehow a dating profile",
  "even my fake scenarios reject me",
  "emotionally buffering please wait",
  "confidence not found try restarting",
  "my future keeps ghosting me",
  "my coping mechanism needs therapy",
  "every bad decision started with trust me",
  "i laugh because crying takes effort",
  "overthinking deserves employee benefits",
  "trust is limited edition",
  "my type is unavailable people",
  "i collect red flags like pokemon",
  "they fixed me by leaving",
  "i ignored the warning signs professionally",
  "i romanticized another bad idea",
  "blocked for telling the truth is crazy",
  "engineering builds patience not careers",
  "caffeine earned this degree",
  "the exam was open book life was not",
  "i studied the wrong chapter perfectly",
  "assignment submitted dignity missing",
  "my resume has trust issues",
  "my bank balance is practicing minimalism",
  "monday is a hate crime",
  "indian parents have wall hacks",
  "mummy always knows before google does",
  "relatives spawn faster than enemies",
  "every family function is an interrogation",
  "chai fixes everything except wifi",
  "reality has the worst matchmaking algorithm",
  "the wifi left before she did",
  "ai is replacing everyone except toxic people",
  "the group chat is evidence",
  "delete for everyone should work in real life",
  "the universe keeps testing beta features on me",
  "emotionally unavailable physically online",
  "if the island has a guest list just stay home",
  "if the group chat goes silent delete nothing admit nothing",
  "your search history deserves diplomatic immunity",
  "the plot twist was your own decision",
  "adulthood is just googling everything secretly",
  "if delusion was energy id power the planet",
  "i won the argument three hours later in the shower",
  "stay away from islands owned by billionaires thats the whole life lesson",
  "if he wanted to he would but he also ghosted so maybe he wont",
  "texting back fast is free real estate dont give it away",
  "love language is great but rent language hits different",
  "log kya kahenge is the real national anthem",
  "thoda aur padh lo said while youre already crying over board exams",
  "sleep schedule is more broken than my last relationship",
  "dont take a lamborghini from diddy",
  "dont go near epstein",
  "use protection virus can come from anywhere"
];

const EDGY_PRIORITY_INDICES = [
  0, 1, 2, 3, 6, 7, 9, 10, 11, 12, 14, 16, 18, 19, 22, 23, 24, 26, 28, 29, 30, 32, 34, 35, 36, 37, 38, 41, 43, 44, 46, 47, 52, 53, 54, 55, 57, 60, 62, 63, 67, 69, 70, 71, 75, 76, 78, 81, 83, 85, 86, 87, 91, 92, 94, 95, 97, 98, 99, 104, 106, 107, 108
];

function generateMonkeyWords(limit: number, weakKeys: string[] = [], includeNumbers: boolean = false, includeSymbols: boolean = false): string {
  const generateSentence = () => {
    let index = 0;
    if (Math.random() < 0.7) {
      index = EDGY_PRIORITY_INDICES[Math.floor(Math.random() * EDGY_PRIORITY_INDICES.length)];
    } else {
      index = Math.floor(Math.random() * EDGY_SENTENCES.length);
    }
    let sentence = EDGY_SENTENCES[index];
    
    if (includeSymbols) {
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      const punctuation = [".", "!", "?", "..."];
      sentence += punctuation[Math.floor(Math.random() * punctuation.length)];
      
      sentence = sentence.replace(/\b(dont)\b/g, "don't")
                         .replace(/\b(im)\b/g, "I'm")
                         .replace(/\b(id)\b/g, "I'd")
                         .replace(/\b(youre)\b/g, "you're")
                         .replace(/\b(i)\b/g, "I")
                         .replace(/\b(elses)\b/g, "else's");
      
      if (Math.random() < 0.4) {
        const words = sentence.split(" ");
        if (words.length > 4) {
          const mid = Math.floor(words.length / 2);
          words[mid] += ",";
          sentence = words.join(" ");
        }
      }
    }
    
    if (includeNumbers && Math.random() < 0.6) {
      const words = sentence.split(" ");
      const numIdx = Math.floor(Math.random() * words.length);
      words.splice(numIdx, 0, Math.floor(Math.random() * 100).toString());
      sentence = words.join(" ");
    }
    
    // Add extra random punctuation/symbols inside the sentence randomly if symbols are on
    if (includeSymbols && Math.random() < 0.3) {
      const SYMBOLS = ["-", "@", "#", "$", "%", "&", "*", "(", ")"];
      const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const words = sentence.split(" ");
      const symIdx = Math.floor(Math.random() * words.length);
      words.splice(symIdx, 0, sym);
      sentence = words.join(" ");
    }
    return sentence;
  };

  // Return a single randomly generated or selected sentence
  return generateSentence();
}

interface TextToken {
  text: string;
  isWord: boolean;
  startIndex: number;
  endIndex: number;
}

function tokenizeText(text: string): TextToken[] {
  const tokens: TextToken[] = [];
  if (!text) return tokens;

  let currentWord = "";
  let isCurrentWordSpace = false;
  let startIdx = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isSpace = /\s/.test(char);
    if (i === 0) {
      isCurrentWordSpace = isSpace;
      currentWord += char;
    } else {
      if (isSpace === isCurrentWordSpace) {
        currentWord += char;
      } else {
        tokens.push({
          text: currentWord,
          isWord: !isCurrentWordSpace,
          startIndex: startIdx,
          endIndex: i
        });
        currentWord = char;
        isCurrentWordSpace = isSpace;
        startIdx = i;
      }
    }
  }
  if (currentWord) {
    tokens.push({
      text: currentWord,
      isWord: !isCurrentWordSpace,
      startIndex: startIdx,
      endIndex: text.length
    });
  }
  return tokens;
}

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"practice" | "lessons" | "analytics" | "coach">("practice");
  const [activeLessonType, setActiveLessonType] = useState<"general" | "coding" | "shortcut">("general");

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("aerotype_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to restore profile:", e);
      }
    }
    return DEFAULT_PROFILE;
  });

  // Active Typing State
  const [currentGeneralLesson, setCurrentGeneralLesson] = useState<Lesson>(CURATED_LESSONS[0]);
  const [currentCodingLesson, setCurrentCodingLesson] = useState<CodingLesson>(CODING_LESSONS[0]);
  const [currentShortcutLesson, setCurrentShortcutLesson] = useState<ShortcutLesson>(SHORTCUT_LESSONS[0]);

  const [typedText, setTypedText] = useState("");
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [chartData, setChartData] = useState<{time: number, wpm: number, rawWpm: number, errors: number}[]>([]);
  const [lastCharTime, setLastCharTime] = useState<number | null>(null);
  
  const liveStatsRef = useRef({ wpm: 0, rawWpm: 0, accuracy: 100 });
  const mistakesRef = useRef(0);
  
  // Highlighting active keys from physical keyboard
  const [heldKeys, setHeldKeys] = useState<Set<string>>(new Set());
  const [justWrongKey, setJustWrongKey] = useState<string | null>(null);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  
  const [tempUsername, setTempUsername] = useState(profile.username);
  const [tempGoal, setTempGoal] = useState(profile.speedGoal);
  const [tempLayout, setTempLayout] = useState(profile.layout);
  const [tempTheme, setTempTheme] = useState<ThemeId>((profile.theme as ThemeId) || 'cosmic');
  const [tempSoundEnabled, setTempSoundEnabled] = useState(profile.soundEnabled ?? true);
  const [tempSoundType, setTempSoundType] = useState(profile.soundType ?? 'click');
  const [editedIndices, setEditedIndices] = useState<Set<number>>(new Set());
  const [incorrectFirstTryIndices, setIncorrectFirstTryIndices] = useState<Set<number>>(new Set());
  const [typedIndices, setTypedIndices] = useState<Set<number>>(new Set());

  // Active Theme configuration
  const currentTheme = useMemo(() => {
    const selected = profile.theme || 'cosmic';
    return THEMES.find(t => t.id === selected) || THEMES[0];
  }, [profile.theme]);

  // Helper to determine letter classes based on correctness, first-try history, and active theme
  const getLetterStyle = (index: number, targetChar: string) => {
    let letterColorClass = currentTheme.isLight ? "text-stone-300 opacity-60" : "text-slate-500 opacity-55";
    let letterBgClass = "";

    if (index < typedText.length) {
      const typedChar = typedText[index];
      if (typedChar === targetChar) {
        const isIncorrectFirstTry = incorrectFirstTryIndices.has(index) || editedIndices.has(index);
        if (isIncorrectFirstTry) {
          // Orange for edited and correct
          letterColorClass = currentTheme.isLight 
            ? "text-orange-600 bg-orange-100/50 rounded-sm px-0.5 font-bold" 
            : "text-orange-400 bg-orange-500/10 rounded-sm px-0.5 font-bold";
        } else {
          // Green if correct at first try
          letterColorClass = currentTheme.isLight ? "text-emerald-600 font-bold" : "text-emerald-400 font-bold";
        }
      } else {
        // Red for wrong
        letterColorClass = currentTheme.isLight ? "text-rose-650 font-bold underline decoration-rose-600 decoration-2 bg-rose-50 px-0.5 rounded-sm animate-[pulse_1.5s_infinite]" : "text-rose-400 font-bold underline decoration-rose-500 decoration-2 bg-rose-950/25 px-0.5 rounded-sm animate-[pulse_1.5s_infinite]";
      }
    } else if (index === typedText.length) {
      letterColorClass = `${currentTheme.isLight ? "text-stone-900" : "text-slate-100"} ${currentTheme.accentBg} border-b-2 ${currentTheme.id === "sepia" ? "border-amber-700" : "border-indigo-400"} animate-[pulse_0.8s_infinite] font-extrabold`;
    }

    return { letterColorClass, letterBgClass };
  };

  // Weak keys calculation based on character data
  const calculatedWeakKeysList = useMemo(() => {
    return Object.entries(profile.keyStats)
      .filter(([_, data]) => {
        const stats = data as KeyStats;
        const accuracy = (stats.attempts - stats.errors) / stats.attempts;
        return stats.attempts >= 4 && accuracy < 0.88;
      })
      .map(([k]) => k)
      .slice(0, 4);
  }, [profile.keyStats]);

  // Session results modal summary
  const [sessionReceipt, setSessionReceipt] = useState<{
    wpm: number;
    accuracy: number;
    xpEarned: number;
    levelUp: boolean;
    weakKeys: string[];
    durationSec: number;
  } | null>(null);

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingFromTest, setIsGeneratingFromTest] = useState(false);
  const [aiCustomLesson, setAiCustomLesson] = useState<Lesson | null>(null);
  const [aiCustomLanguage, setAiCustomLanguage] = useState<"python" | "javascript" | "html-css" | "sql">("python");
  const [aiCustomDifficulty, setAiCustomDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [useAi, setUseAi] = useState(true);
  
  // AI Coach Feedback State
  const [isFetchingCoach, setIsFetchingCoach] = useState(false);
  const [coachFeedback, setCoachFeedback] = useState<{
    overallAssessment: string;
    weaknessExplainer: string;
    curatedPracticePlan: string[];
  } | null>(null);

  // Code execution states
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [htmlPreviewCode, setHtmlPreviewCode] = useState<string | null>(null);

  // MonkeyType-inspired test modes and limits
  const [monkeyMode, setMonkeyMode] = useState<"standard" | "time" | "words">("time");
  const [monkeyLimit, setMonkeyLimit] = useState<number>(30); // seconds for 'time', word count for 'words'
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [countdownSec, setCountdownSec] = useState<number>(30);
  const [monkeySeed, setMonkeySeed] = useState<number>(0);
  const [timeTrialSentences, setTimeTrialSentences] = useState<string[]>([]);
  const [historicalCorrectCount, setHistoricalCorrectCount] = useState<number>(0);
  const [historicalTypedLength, setHistoricalTypedLength] = useState<number>(0);
  const [historicalWordCount, setHistoricalWordCount] = useState<number>(0);

  // Input caret focus reference
  const typingInputRef = useRef<HTMLTextAreaElement>(null);

  // Backup data back to LocalStorage
  const saveProfile = (updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem("aerotype_profile", JSON.stringify(updated));
  };

  // Generate an objective target string based on practice mode
  const targetText = useMemo(() => {
    if (activeLessonType === "coding") {
      return currentCodingLesson.code;
    }
    if (activeLessonType === "shortcut") {
      // Reconstruct simple string representing keys to hold down (e.g. CTRL+S)
      return currentShortcutLesson.keys.join(" + ");
    }
    return currentGeneralLesson.text;
  }, [activeLessonType, currentGeneralLesson, currentCodingLesson, currentShortcutLesson]);

  // Adapt targetText based on MonkeyType constraints
  const displayTargetText = useMemo(() => {
    let originalText = targetText;
    if (activeLessonType === "shortcut") return originalText;

    if (monkeyMode === "words" || monkeyMode === "time") {
      if (timeTrialSentences.length > 0) {
        return timeTrialSentences[0];
      }
      return generateMonkeyWords(10, calculatedWeakKeysList, includeNumbers, includeSymbols);
    }

    return originalText;
  }, [targetText, monkeyMode, monkeyLimit, activeLessonType, monkeySeed, calculatedWeakKeysList, timeTrialSentences, includeNumbers, includeSymbols]);

  const tokens = useMemo(() => tokenizeText(displayTargetText), [displayTargetText]);

  // Reset current typing block state
  const resetPractice = () => {
    setTypedText("");
    setIsTestRunning(false);
    setIsTestFinished(false);
    setStartTime(null);
    setMistakes(0);
    setChartData([]);
    setLastCharTime(null);
    setJustWrongKey(null);
    setEditedIndices(new Set());
    setIncorrectFirstTryIndices(new Set());
    setTypedIndices(new Set());
    setCountdownSec(monkeyMode === "time" ? monkeyLimit : 0);
    setHistoricalCorrectCount(0);
    setHistoricalTypedLength(0);
    setHistoricalWordCount(0);
    
    if (monkeyMode === "time" || monkeyMode === "words") {
      const s1 = generateMonkeyWords(10, calculatedWeakKeysList, includeNumbers, includeSymbols);
      const s2 = generateMonkeyWords(10, calculatedWeakKeysList, includeNumbers, includeSymbols);
      setTimeTrialSentences([s1, s2]);
    } else {
      setTimeTrialSentences([]);
    }

    setMonkeySeed(prev => prev + 1);
    if (typingInputRef.current) {
      typingInputRef.current.value = "";
      typingInputRef.current.focus();
    }
  };

  // Reset practice whenever mode settings change
  useEffect(() => {
    resetPractice();
  }, [monkeyMode, monkeyLimit, includeNumbers, includeSymbols]);

  // Run initial alignment on mounted hook
  useEffect(() => {
    resetPractice();
  }, [activeLessonType, currentGeneralLesson, currentCodingLesson, currentShortcutLesson]);

  // Real-time calculation of WPM and accuracy metrics
  const liveStats = useMemo(() => {
    const totalTyped = historicalTypedLength + typedText.length;
    if (totalTyped === 0) return { wpm: 0, accuracy: 100 };
    
    // Duration
    const durationMin = startTime ? (Date.now() - startTime) / 60000 : 0;
    
    // Key formula: correct chars divided by 5 (standard word metric) divided by overall minutes
    let correctCount = historicalCorrectCount;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === displayTargetText[i]) {
        correctCount++;
      }
    }

    const calculatedWpm = durationMin > 0.01 ? Math.round((correctCount / 5) / durationMin) : 0;
    const calculatedRawWpm = durationMin > 0.01 ? Math.round((totalTyped / 5) / durationMin) : 0;
    const calculatedAcc = Math.max(0, Math.round(((totalTyped - mistakes) / totalTyped) * 100));

    return {
      wpm: Math.min(250, calculatedWpm),
      rawWpm: Math.min(250, calculatedRawWpm),
      accuracy: Math.min(100, calculatedAcc)
    };
  }, [typedText, displayTargetText, mistakes, startTime, historicalCorrectCount, historicalTypedLength]);

  useEffect(() => {
    liveStatsRef.current = liveStats;
    mistakesRef.current = mistakes;
  }, [liveStats, mistakes]);

  // Chart data interval logger
  useEffect(() => {
    let intervalId: any = null;
    if (isTestRunning && !isTestFinished) {
      intervalId = setInterval(() => {
        setChartData(prev => [...prev, { 
          time: prev.length, 
          wpm: liveStatsRef.current.wpm, 
          rawWpm: liveStatsRef.current.rawWpm,
          errors: mistakesRef.current 
        }]);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTestRunning, isTestFinished]);

  // Handle countdown interval for Time-based trials (MonkeyType mode)
  useEffect(() => {
    let intervalId: any = null;
    if (isTestRunning && monkeyMode === "time" && !isTestFinished) {
      intervalId = setInterval(() => {
        setCountdownSec(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTestRunning, monkeyMode, isTestFinished]);

  // Handle time trial completion when countdown hits zero
  useEffect(() => {
    if (isTestRunning && monkeyMode === "time" && countdownSec === 0 && !isTestFinished) {
      // Compile and freeze results at this literal second block
      const durationMs = monkeyLimit * 1000;
      const durationMin = monkeyLimit / 60;
      
      let correctCount = historicalCorrectCount;
      for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === displayTargetText[i]) {
          correctCount++;
        }
      }
      const totalTyped = historicalTypedLength + typedText.length;
      const finalWpm = Math.min(250, durationMin > 0 ? Math.round((correctCount / 5) / durationMin) : 0);
      const finalAcc = totalTyped > 0 ? Math.max(0, Math.min(100, Math.round(((totalTyped - mistakes) / totalTyped) * 100))) : 100;
      
      handleLessonCompletion(finalWpm, finalAcc, durationMs);
    }
  }, [countdownSec, isTestRunning, monkeyMode, isTestFinished, typedText, mistakes, displayTargetText, historicalCorrectCount, historicalTypedLength, monkeyLimit]);

  // Daily missions goals tracker state
  const completedHistorySessionsToday = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return profile.history.filter(h => h.timestamp.startsWith(today)).length;
  }, [profile.history]);

  // Capture global key events for virtual keys pressed
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Avoid tracking if input forms or dialog text inputs are active
      if (document.activeElement?.tagName === "INPUT" && showSettings) return;

      const activeKey = e.key.toLowerCase();
      setHeldKeys(prev => {
        const next = new Set(prev);
        if (e.key === " ") {
          next.add("space");
        } else {
          next.add(activeKey);
        }
        return next;
      });

      // Keyboard Shortcut Mode checking
      if (activeLessonType === "shortcut") {
        // Match standard representation of modifier keys
        const targetKeysMapped = currentShortcutLesson.keys.map(k => {
          if (k.toLowerCase() === "control" || k.toLowerCase() === "ctrl") return "control";
          if (k.toLowerCase() === "shift") return "shift";
          if (k.toLowerCase() === "alt") return "alt";
          return k.toLowerCase();
        });

        // Evaluate if each required key is satisfied recursively
        const allPressed = targetKeysMapped.every(k => {
          if (k === "control" && e.ctrlKey) return true;
          if (k === "shift" && e.shiftKey) return true;
          if (k === "alt" && e.altKey) return true;
          return e.key.toLowerCase() === k;
        });

        // Prevent browser default actions for specific combinations like Ctrl+S, Ctrl+F
        // so the browser doesn't open its own dialogs.
        if (e.ctrlKey && ['s', 'f', 'p', 'g'].includes(e.key.toLowerCase())) {
          e.preventDefault();
        }

        if (allPressed && !isTestFinished) {
          // Success! Capture achievements
          handleLessonCompletion(70, 100, 12000);
        }
      }
    };

    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      const activeKey = e.key.toLowerCase();
      setHeldKeys(prev => {
        const next = new Set(prev);
        if (e.key === " ") {
          next.delete("space");
        } else {
          next.delete(activeKey);
        }
        return next;
      });
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    window.addEventListener("keyup", handleGlobalKeyUp);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      window.removeEventListener("keyup", handleGlobalKeyUp);
    };
  }, [activeLessonType, currentShortcutLesson, isTestFinished]);

  // Handle precise character inputs for text block lessons
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isTestFinished) return;
    
    const val = e.target.value;
    const currentLength = val.length;
    const originalLength = typedText.length;
    
    // Ignore deletions unless they specifically delete characters (Backspace)
    if (currentLength < originalLength) {
      setTypedText(val);
      setEditedIndices(prev => {
        const next = new Set(prev);
        for (let i = currentLength; i < originalLength; i++) {
          next.add(i);
        }
        return next;
      });
      return;
    }

    // Track first-try correctness for each newly typed position without nested updater side-effects
    const nextTyped = new Set(typedIndices);
    const nextIncorrect = new Set(incorrectFirstTryIndices);
    let changed = false;
    for (let i = originalLength; i < currentLength; i++) {
      if (!nextTyped.has(i)) {
        const charTyped = val[i];
        const charTarget = displayTargetText[i];
        if (charTarget !== undefined) {
          if (charTyped !== charTarget) {
            nextIncorrect.add(i);
          }
          nextTyped.add(i);
          changed = true;
        }
      }
    }
    if (changed) {
      setTypedIndices(nextTyped);
      setIncorrectFirstTryIndices(nextIncorrect);
    }

    const insertedChar = val[currentLength - 1];
    const targetChar = displayTargetText[currentLength - 1];

    // Mark active clock
    let currentStart = startTime;
    if (!isTestRunning) {
      setIsTestRunning(true);
      currentStart = Date.now();
      setStartTime(currentStart);
    }

    const now = Date.now();
    const keyLatency = lastCharTime ? now - lastCharTime : 150;
    setLastCharTime(now);

    const isMatch = insertedChar === targetChar;

    // Track detailed single-character metrics
    if (targetChar) {
      const charKey = targetChar.toLowerCase();
      const updatedKeyStats = { ...profile.keyStats };
      const currentStat = updatedKeyStats[charKey] || { attempts: 0, errors: 0, totalLatencyMs: 0 };
      
      currentStat.attempts += 1;
      currentStat.totalLatencyMs += Math.min(2500, keyLatency); // Cap latency spike outliers

      if (!isMatch) {
         currentStat.errors += 1;
         setMistakes(prev => prev + 1);
         setJustWrongKey(targetChar);
         // Visual shake feedback trigger
         setTimeout(() => setJustWrongKey(null), 300);
         if (profile.soundEnabled ?? true) {
           playKeyThudSound();
         }
      } else {
         setJustWrongKey(null);
         if (profile.soundEnabled ?? true) {
           if ((profile.soundType ?? 'click') === 'click') {
             playKeyClickSound();
           } else {
             playKeyThudSound();
           }
         }
      }

      updatedKeyStats[charKey] = currentStat;
      // Write incremental progress data to memory
      saveProfile({
        ...profile,
        keyStats: updatedKeyStats
      });
    }

    setTypedText(val);

    if ((monkeyMode === "time" || monkeyMode === "words") && timeTrialSentences.length >= 2) {
      const targetLen = displayTargetText.length;
      if (val.length >= targetLen) {
        const lastChar = val[val.length - 1];
        if (lastChar === " " || val.length > targetLen) {
          let correctInFirst = 0;
          for (let i = 0; i < Math.min(val.length, targetLen); i++) {
            if (val[i] === displayTargetText[i]) {
              correctInFirst++;
            }
          }
          const wordsInSentence = displayTargetText.trim().split(/\s+/).length;
          
          setHistoricalCorrectCount(prev => prev + correctInFirst);
          setHistoricalTypedLength(prev => prev + targetLen);
          setHistoricalWordCount(prev => prev + wordsInSentence);

          const nextSent = generateMonkeyWords(10, calculatedWeakKeysList, includeNumbers, includeSymbols);
          setTimeTrialSentences([timeTrialSentences[1], nextSent]);
          setTypedText("");
          setEditedIndices(new Set());
          setIncorrectFirstTryIndices(new Set());
          setTypedIndices(new Set());
          
          // Clear text area value for the next sentence
          if (typingInputRef.current) {
            typingInputRef.current.value = "";
          }
          
          // If we reached words limit in words mode, finish test early
          if (monkeyMode === "words") {
            if (historicalWordCount + wordsInSentence >= monkeyLimit) {
              const duration = Date.now() - (currentStart || Date.now());
              const totalTyped = historicalTypedLength + targetLen;
              const finalWpm = Math.min(250, duration > 0 ? Math.round(((historicalCorrectCount + correctInFirst) / 5) / (duration / 60000)) : 0);
              const finalAcc = totalTyped > 0 ? Math.max(0, Math.min(100, Math.round(((totalTyped - mistakes) / totalTyped) * 100))) : 100;
              handleLessonCompletion(finalWpm, finalAcc, duration);
            }
          }
          
          return;
        }
      }
    }

    // Evaluate test complete condition (skip length condition and wait for timer in "time" mode)
    if (monkeyMode !== "time" && monkeyMode !== "words" && val.length >= displayTargetText.length) {
      const duration = Date.now() - (currentStart || Date.now());
      const finalWpm = liveStats.wpm;
      const finalAcc = liveStats.accuracy;
      handleLessonCompletion(finalWpm, finalAcc, duration);
    }
  };

  // Manage logic when practice session completes
  const handleLessonCompletion = (finalWpm: number, finalAcc: number, durationMs: number) => {
    setIsTestFinished(true);
    setIsTestRunning(false);

    // Calculate XP Rewards
    // Formula scales with WPM and higher accuracy weight to incentivize exact keystroke discipline
    const baseReward = 45;
    const bonusWpmMultiplier = Math.round(finalWpm * 1.2);
    const bonusAccuracyMultiplier = finalAcc >= 95 ? 50 : finalAcc >= 90 ? 20 : 0;
    const xpGained = baseReward + bonusWpmMultiplier + bonusAccuracyMultiplier;

    // Evaluate level ups
    let newXp = profile.xp + xpGained;
    let nextLevelNeededXp = profile.level * 400;
    let levelGained = false;
    let currentLevel = profile.level;

    while (newXp >= nextLevelNeededXp) {
      newXp -= nextLevelNeededXp;
      currentLevel += 1;
      nextLevelNeededXp = currentLevel * 400;
      levelGained = true;
    }

    // Determine weak keys generated in this individual lesson
    const localWeakKeys: string[] = [];
    if (finalAcc < 95) {
      // Pick random characters mismatching typed sequence
      for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] !== displayTargetText[i] && displayTargetText[i] && !localWeakKeys.includes(displayTargetText[i].toLowerCase())) {
          localWeakKeys.push(displayTargetText[i].toLowerCase());
          if (localWeakKeys.length >= 3) break;
        }
      }
    }

    // Process new streak days logic
    const todayStr = new Date().toISOString().split("T")[0];
    let activeStreak = profile.streakDays;
    let maxStreak = profile.maxStreakDays;

    if (profile.lastPracticeDate !== todayStr) {
      if (profile.lastPracticeDate) {
        const lastPractice = new Date(profile.lastPracticeDate).getTime();
        const diffDays = Math.round((new Date(todayStr).getTime() - lastPractice) / 86400000);
        if (diffDays === 1) {
          activeStreak += 1;
        } else if (diffDays > 1) {
          activeStreak = 1;
        }
      } else {
        activeStreak = 1;
      }
      if (activeStreak > maxStreak) {
        maxStreak = activeStreak;
      }
    }

    // Evaluate Achievement triggers
    const freshlyUnlocked: string[] = [];
    const checkAchievement = (id: string, satisfied: boolean) => {
      if (satisfied && !profile.unlockedAchievements.includes(id)) {
        freshlyUnlocked.push(id);
      }
    };

    checkAchievement("streak-3", activeStreak >= 3);
    checkAchievement("streak-7", activeStreak >= 7);
    checkAchievement("wpm-45", finalWpm >= 45);
    checkAchievement("wpm-70", finalWpm >= 70);
    checkAchievement("acc-95", finalAcc >= 95);
    checkAchievement("acc-99", finalAcc >= 99);
    checkAchievement("xp-1000", (profile.xp + xpGained) >= 1000);
    checkAchievement("lessons-5", (profile.history.length + 1) >= 5);

    // Save final history state
    const currentSessionReceipt: PracticeSession = {
      id: "prac-" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      lessonTitle: activeLessonType === "coding" ? currentCodingLesson.title : activeLessonType === "shortcut" ? currentShortcutLesson.title : currentGeneralLesson.title,
      lessonType: activeLessonType,
      wpm: finalWpm,
      accuracy: finalAcc,
      durationMs: durationMs,
      weakKeysIdentified: localWeakKeys
    };

    const updatedProfile: UserProfile = {
      ...profile,
      xp: newXp,
      level: currentLevel,
      streakDays: activeStreak,
      maxStreakDays: maxStreak,
      lastPracticeDate: todayStr,
      history: [...profile.history, currentSessionReceipt],
      unlockedAchievements: [...profile.unlockedAchievements, ...freshlyUnlocked]
    };

    saveProfile(updatedProfile);

    // Post to leaderboard
    if (finalWpm > 0 && finalAcc > 0) {
      fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedProfile.username,
          wpm: finalWpm,
          accuracy: finalAcc
        })
      }).catch(err => console.warn("Failed to post to leaderboard", err));
    }

    // Automatically trigger AI Coaching Evaluation for this session's diagnostics
    setIsFetchingCoach(true);
    fetch("/api/ai-coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileName: updatedProfile.username,
        keyStats: updatedProfile.keyStats,
        history: updatedProfile.history
      })
    })
      .then(res => res.ok ? res.json() : null)
      .then(payload => {
        if (payload) {
          setCoachFeedback(payload);
        }
      })
      .catch(err => console.warn("AI Coach auto analysis failed:", err))
      .finally(() => setIsFetchingCoach(false));

    // Save results view
    if (activeLessonType === "shortcut") {
      setTimeout(() => {
        resetPractice();
      }, 2500);
    } else {
      setSessionReceipt({
        wpm: finalWpm,
        accuracy: finalAcc,
        xpEarned: xpGained,
        levelUp: levelGained,
        weakKeys: localWeakKeys,
        durationSec: Math.round(durationMs / 1000)
      });
    }
  };

  // Count the mistakes in current typed code compared to targetText
  const codingMyMistakesCount = useMemo(() => {
    if (activeLessonType !== "coding") return 0;
    let count = 0;
    const len = Math.min(typedText.length, targetText.length);
    for (let i = 0; i < len; i++) {
      if (typedText[i] !== targetText[i]) {
        count++;
      }
    }
    return count;
  }, [typedText, targetText, activeLessonType]);

  // Fixes all typos in typed text so far by aligning it with targetText, then runs it
  const handleCorrectAndRun = async () => {
    if (activeLessonType !== "coding") return;
    setIsRunningCode(true);
    setCodeOutput("Autocorrecting syntax typos...\n");
    setHtmlPreviewCode(null);

    // Correct any non-matching characters with exact targetText equivalents
    const correctedIndicesList: number[] = [];
    const correctedChars = typedText.split("").map((char, index) => {
      if (targetText[index] !== undefined && char !== targetText[index]) {
        correctedIndicesList.push(index);
        return targetText[index];
      }
      return char;
    });
    const correctedCode = correctedChars.join("");
    
    // Smoothly update input field value
    setTypedText(correctedCode);
    setEditedIndices(prev => {
      const next = new Set(prev);
      correctedIndicesList.forEach(idx => next.add(idx));
      return next;
    });

    try {
      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: correctedCode,
          language: currentCodingLesson.language
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCodeOutput(data.output);
        if (data.previewHtml) {
          setHtmlPreviewCode(data.previewHtml);
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        setCodeOutput(`Execution Error: ${errData.error || "Failed to contact sandboxed worker module."}`);
      }
    } catch (err: any) {
      setCodeOutput(`Execution Network Error: ${err.message || "Failed to pipe codes to virtual terminal."}`);
    } finally {
      setIsRunningCode(false);
    }
  };

  // Run the current typed or complete code
  const handleRunCode = async (useTarget = false) => {
    setIsRunningCode(true);
    setCodeOutput("Initializing environment...\n");
    setHtmlPreviewCode(null);
    try {
      const codeToRun = useTarget ? targetText : typedText;
      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeToRun,
          language: activeLessonType === "coding" ? currentCodingLesson.language : "javascript"
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCodeOutput(data.output);
        if (data.previewHtml) {
          setHtmlPreviewCode(data.previewHtml);
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        setCodeOutput(`Execution Error: ${errData.error || "Failed to contact sandboxed worker module."}`);
      }
    } catch (err: any) {
      setCodeOutput(`Execution Network Error: ${err.message || "Failed to pipe codes to virtual terminal."}`);
    } finally {
      setIsRunningCode(false);
    }
  };

  // call local environment api trigger to generate adaptive practice material
  const handleGenerateAiLesson = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weakKeys: calculatedWeakKeysList.length > 0 ? calculatedWeakKeysList : ["a", "p", "o"],
          difficulty: aiCustomDifficulty,
          type: activeLessonType === "coding" ? "coding" : "general",
          language: aiCustomLanguage,
          useAi: useAi
        })
      });

      if (response.ok) {
        const payload = await response.json();
        if (activeLessonType === "coding") {
          const generatedCodeLesson: CodingLesson = {
            id: `ai-code-${Date.now()}`,
            language: aiCustomLanguage,
            title: payload.title || `AI Generated Code (${aiCustomLanguage})`,
            difficulty: aiCustomDifficulty,
            code: payload.code,
            explanation: payload.explanation || "Adaptive software code.",
            snippet_type: "Custom generated"
          };
          setCurrentCodingLesson(generatedCodeLesson);
          setMonkeyMode("standard");
        } else {
          const generatedGeneralLesson: Lesson = {
            id: `ai-gen-${Date.now()}`,
            title: payload.title || "AI General Drill",
            category: "AI Custom",
            difficulty: aiCustomDifficulty,
            text: payload.text,
            description: payload.description || "Synthesised tactile focus plan."
          };
          setCurrentGeneralLesson(generatedGeneralLesson);
          setAiCustomLesson(generatedGeneralLesson);
          setMonkeyMode("standard");
        }
      }
    } catch (e) {
      console.warn("AI Generation issue:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  // call local environment api trigger to generate adaptive practice material from weakest keys of the test
  const handleShareScore = () => {
    if (!sessionReceipt) return;
    const shareText = `I just hit ${sessionReceipt.wpm} WPM with ${sessionReceipt.accuracy}% accuracy on this typing test! 🚀`;
    if (navigator.share) {
      navigator.share({
        title: "My Typing Score",
        text: shareText,
      }).catch(err => console.warn("Failed to share", err));
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Score copied to clipboard!");
    }
  };

  const handleGenerateLessonFromTest = async () => {
    if (!sessionReceipt) return;
    setIsGeneratingFromTest(true);
    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weakKeys: sessionReceipt.weakKeys.length > 0 ? sessionReceipt.weakKeys : ["t", "e", "s", "t"],
          difficulty: activeLessonType === "coding" ? currentCodingLesson.difficulty : currentGeneralLesson.difficulty,
          type: activeLessonType === "coding" ? "coding" : "general",
          language: activeLessonType === "coding" ? currentCodingLesson.language : "english",
          useAi: useAi
        })
      });

      if (response.ok) {
        const payload = await response.json();
        if (activeLessonType === "coding") {
          const generatedCodeLesson: CodingLesson = {
            id: `ai-code-${Date.now()}`,
            language: currentCodingLesson.language,
            title: payload.title || `AI Code Drill`,
            difficulty: currentCodingLesson.difficulty,
            code: payload.code,
            explanation: payload.explanation || "Adaptive software code.",
            snippet_type: "Custom generated"
          };
          setCurrentCodingLesson(generatedCodeLesson);
          setMonkeyMode("standard");
        } else {
          const generatedGeneralLesson: Lesson = {
            id: `ai-gen-${Date.now()}`,
            title: payload.title || "AI Target Drill",
            category: "AI Custom",
            difficulty: currentGeneralLesson.difficulty,
            text: payload.text,
            description: payload.description || "Synthesised weak keys practice."
          };
          setCurrentGeneralLesson(generatedGeneralLesson);
          setAiCustomLesson(generatedGeneralLesson);
          setMonkeyMode("standard");
        }
        // Close modal and restart practice
        setSessionReceipt(null);
        resetPractice();
      }
    } catch (err) {
      console.warn("Failed to generate test-adaptive AI lesson:", err);
    } finally {
      setIsGeneratingFromTest(false);
    }
  };

  // call local environment api trigger to request the AI biomechanical evaluation coach
  const handleFetchAiCoach = async () => {
    setIsFetchingCoach(true);
    try {
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileName: profile.username,
          keyStats: profile.keyStats,
          history: profile.history
        })
      });

      if (response.ok) {
        const payload = await response.json();
        setCoachFeedback(payload);
      }
    } catch (e) {
       console.warn("AI Coach query failed:", e);
    } finally {
       setIsFetchingCoach(false);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboardData(data);
      }
    } catch (e) {
      console.warn("Failed to fetch leaderboard", e);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  const handleOpenLeaderboard = () => {
    setShowLeaderboard(true);
    fetchLeaderboard();
  };

  // Update Settings profile callback
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      username: tempUsername || "Guest Pilot",
      speedGoal: Number(tempGoal) || 50,
      layout: tempLayout,
      theme: tempTheme,
      soundEnabled: tempSoundEnabled,
      soundType: tempSoundType
    };
    saveProfile(updated);
    setShowSettings(false);
  };

  const handleFocusTypingZone = () => {
    if (typingInputRef.current) {
      typingInputRef.current.focus();
    }
  };

  // Auto focus typing area on startup
  useEffect(() => {
    handleFocusTypingZone();
  }, []);

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} font-sans flex flex-col antialiased selection:bg-indigo-500/30 selection:text-white p-4 md:p-6 overflow-x-hidden transition-colors duration-300`}>
      
      {/* Settings Modal popover */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
              <Settings className="w-5 h-5 text-indigo-400" />
              Pilot Configuration
            </h2>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Pilot Username</label>
                <input
                  type="text"
                  maxLength={16}
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 text-sm font-mono"
                  placeholder="Enter custom username"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-mono">Personal WPM speed Goal</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={20}
                    max={120}
                    value={tempGoal}
                    onChange={(e) => setTempGoal(Number(e.target.value))}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="text-sm font-bold font-mono text-indigo-400 min-w-[50px] text-right">{tempGoal} WPM</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Target Keyboard Layout</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["qwerty", "dvorak", "colemak"] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setTempLayout(opt)}
                      className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold uppercase transition-all ${
                        tempLayout === opt
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                          : "bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  Visual Theme Profile
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {THEMES.map((themeOption) => (
                    <button
                      type="button"
                      key={themeOption.id}
                      onClick={() => {
                        setTempTheme(themeOption.id);
                        const updatedPreview: UserProfile = {
                          ...profile,
                          theme: themeOption.id
                        };
                        setProfile(updatedPreview);
                        localStorage.setItem("aerotype_profile", JSON.stringify(updatedPreview));
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex flex-col justify-between h-16 ${
                        tempTheme === themeOption.id
                          ? "bg-slate-850 border-indigo-500 shadow-md ring-1 ring-indigo-500/20"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <span className="text-white text-[10px] block truncate">{themeOption.name}</span>
                      <div className="flex gap-1.5 mt-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: themeOption.id === 'cosmic' ? '#07090e' : themeOption.id === 'terminal' ? '#000000' : themeOption.id === 'sepia' ? '#FAF6EE' : themeOption.id === 'aurora' ? '#0b0f14' : '#130d1a' }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: themeOption.id === 'cosmic' ? '#6366f1' : themeOption.id === 'terminal' ? '#10b981' : themeOption.id === 'sepia' ? '#b45309' : themeOption.id === 'aurora' ? '#06b6d4' : '#d946ef' }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: themeOption.id === 'sepia' ? '#2e261f' : '#f8fafc' }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {tempSoundEnabled ? (
                      <Volume2 className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-500" />
                    )}
                    <div>
                      <span className="block text-xs font-bold text-slate-200">Typing Sound Effects</span>
                      <span className="block text-[10px] text-slate-400">Play sounds while typing</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTempSoundEnabled(!tempSoundEnabled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                      tempSoundEnabled ? "bg-indigo-605" : "bg-slate-800"
                    }`}
                    style={{ backgroundColor: tempSoundEnabled ? '#4f46e5' : '#1e293b' }}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        tempSoundEnabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
                
                {tempSoundEnabled && (
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => { setTempSoundType('click'); playKeyClickSound(); }}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                        tempSoundType === 'click' 
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      Mechanical Click
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTempSoundType('thud'); playKeyThudSound(); }}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                        tempSoundType === 'thud' 
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      Deep Thud
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-850 text-slate-400 transition-all border border-slate-800/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20"
                >
                  Save Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Global Leaderboard
              </h2>
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="text-slate-500 hover:text-white transition-colors p-1"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {isLoadingLeaderboard ? (
                <div className="text-center py-10">
                  <Activity className="w-6 h-6 text-indigo-500 animate-pulse mx-auto mb-3" />
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Scanning Network...</p>
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs font-mono text-slate-500">No records found.</p>
                </div>
              ) : (
                leaderboardData.map((entry, idx) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-md font-mono font-bold text-xs ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : idx === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' : idx === 2 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30' : 'bg-slate-800 text-slate-500'}`}>
                        {idx + 1}
                      </div>
                      <span className="text-sm font-bold text-slate-200 truncate max-w-[120px] sm:max-w-[160px]">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-mono">WPM</div>
                        <div className="font-black text-indigo-400 font-mono">{entry.wpm}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-mono">ACC</div>
                        <div className="font-bold text-slate-300 font-mono">{entry.accuracy}%</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-900 flex justify-end">
               <button
                  type="button"
                  onClick={() => setShowLeaderboard(false)}
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-850 text-slate-400 transition-all border border-slate-800/60"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Completed session popup receipt */}
      {sessionReceipt && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#090d16] border border-indigo-500/25 rounded-[2rem] w-full max-w-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Ambient dynamic backdrop glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>

            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white uppercase font-sans">Sprint Diagnostic</h3>
                  <p className="text-[10px] text-slate-400 font-mono">TACTILE ANALYSIS SECURED</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-500 text-[10px] font-mono font-bold rounded-lg uppercase">
                  {activeLessonType} trial
                </span>
              </div>
            </div>

            {/* Massive Key metrics row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-5 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-center text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">Velocity</span>
                <span className="text-5xl font-mono font-black text-white mt-2 tabular-nums">
                  {sessionReceipt.wpm}
                </span>
                <span className="text-[9px] uppercase font-bold text-indigo-400 mt-1">WORDS / MIN</span>
              </div>
              <div className="p-5 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col justify-center text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">Accuracy</span>
                <span className="text-5xl font-mono font-black text-emerald-400 mt-2 tabular-nums">
                  {sessionReceipt.accuracy}%
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500 mt-1">{mistakes} errors</span>
              </div>
              <div className="p-5 bg-indigo-950/20 border border-indigo-500/10 rounded-2xl flex flex-col justify-center text-center">
                <span className="text-[10px] text-indigo-300 uppercase font-mono tracking-widest">XP Awarded</span>
                <span className="text-3xl font-mono font-black text-indigo-300 mt-2 flex items-center justify-center gap-1">
                  +{sessionReceipt.xpEarned} <span className="text-xs text-indigo-455 font-bold">XP</span>
                </span>
                {sessionReceipt.levelUp ? (
                  <span className="text-[9px] text-amber-400 font-black tracking-wider uppercase mt-1 animate-bounce">LEVEL UP!</span>
                ) : (
                  <span className="text-[9px] text-slate-500 mt-1">Goal: {profile.speedGoal} WPM</span>
                )}
              </div>
            </div>

            {/* Comedic Speed rating Spotlight */}
            <div className={`p-5 rounded-2xl border ${getComedicTier(sessionReceipt.wpm).borderColor} ${getComedicTier(sessionReceipt.wpm).color} mb-6 transition-all`}>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-2xl">{getComedicTier(sessionReceipt.wpm).emoji}</span>
                <h4 className="text-xs uppercase font-mono font-black text-white tracking-wider">
                  Speed Tier: {getComedicTier(sessionReceipt.wpm).name}
                </h4>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{getComedicTier(sessionReceipt.wpm).description}"
              </p>
            </div>

            {/* Actions: Continue and Share */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => {
                  setSessionReceipt(null);
                  resetPractice();
                }}
                className="flex-1 py-3.5 bg-white text-[#090d16] hover:bg-slate-200 transition-all text-xs font-black rounded-xl cursor-pointer uppercase tracking-widest font-mono"
              >
                Continue Sprints
              </button>
              <button
                onClick={handleShareScore}
                className="flex-[0.5] py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-xs font-black rounded-xl cursor-pointer uppercase tracking-widest font-mono flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Speed over time chart */}
            {chartData.length > 0 && (
              <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-5 mb-6 h-64 w-full relative">
                <h4 className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-widest mb-3 absolute top-5 left-5">
                  Pacing Analytics
                </h4>
                <div className="w-full h-full pt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="time" stroke="#475569" fontSize={10} tickFormatter={(val) => `${val}s`} />
                      <YAxis yAxisId="left" stroke="#475569" fontSize={10} />
                      <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={10} hide />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl shadow-black/50">
                                <p className="text-slate-400 text-xs mb-2">{`Time: ${label}s`}</p>
                                {payload.map((entry: any, index: number) => (
                                  <div key={index} className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-sm font-mono" style={{ color: entry.color }}>
                                      {entry.name}: <span className="font-bold">{entry.value}</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                      <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="#818cf8" strokeWidth={3} dot={false} activeDot={{ r: 4 }} name="Net WPM" />
                      <Line yAxisId="left" type="monotone" dataKey="rawWpm" stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Raw WPM" />
                      <Line yAxisId="right" type="monotone" dataKey="errors" stroke="#fb7185" strokeWidth={2} dot={false} name="Errors" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* AI Diagnostics & Ergonomic Biomechanical Evaluation */}
            <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-5 mb-6">
              <h4 className="text-[10px] font-mono font-black uppercase text-indigo-400 tracking-widest mb-3 flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Live Coach Hand-Biometrics Report
              </h4>
              
              {isFetchingCoach ? (
                <div className="py-4 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                  <p className="text-[10px] font-mono text-slate-400 tracking-widest animate-pulse uppercase">
                    Analyzing finger grip, posture, and kinetic latency structures...
                  </p>
                </div>
              ) : coachFeedback ? (
                <div className="space-y-4">
                  <div className="bg-slate-900/40 p-3.5 rounded-xl border border-white/5">
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {coachFeedback.overallAssessment}
                    </p>
                  </div>

                  {coachFeedback.curatedPracticePlan && coachFeedback.curatedPracticePlan.length > 0 && (
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Recommended Focus Steps</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {coachFeedback.curatedPracticePlan.slice(0, 4).map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 bg-slate-900/20 p-2 border border-white/5 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <span className="text-[10px] text-slate-405 leading-tight">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 font-mono">
                  Diagnostics report failed load. Focus on maintaining floats to reduce fatigue.
                </p>
              )}
            </div>

            {/* Weak Keys diagnostic list and AI Adaptive generation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div className="p-4 bg-slate-950 border border-white/5 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Keystroke Diagnostics</span>
                  <p className="text-xs font-bold text-white mb-2">Weakest Letters Traveled</p>
                  {sessionReceipt.weakKeys.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {sessionReceipt.weakKeys.map(key => (
                        <span key={key} className="px-2.5 py-1 bg-red-500/10 border border-red-500/25 rounded font-mono text-xs font-bold text-red-400 uppercase">
                          {key}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-mono">★ Perfect touch alignment! No issues found.</span>
                  )}
                </div>
                <p className="text-[9px] text-slate-500 italic mt-3 leading-tight font-mono">
                  Accuracy was lowest when transiting to these reach zones.
                </p>
              </div>

              {/* Special adaptive retraining block */}
              <div className="p-4 bg-[#0a0f1d] border border-indigo-500/20 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider block mb-1">AI Adaptive Synthesis</span>
                  <p className="text-xs font-bold text-white mb-1.5">Iterative Retraining Loop</p>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Instantly compose a high-engagement practice lesson targeting your exact finger trajectory weaknesses from this test.
                  </p>
                </div>

                <button
                  disabled={isGeneratingFromTest}
                  onClick={handleGenerateLessonFromTest}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 text-white font-mono font-bold text-[10px] rounded-lg mt-3 flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wide shadow-lg shadow-indigo-600/15"
                >
                  {isGeneratingFromTest ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Synthesizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Compose Custom Retrain Lesson
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container Header Navigation */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-white/5 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all hover:rotate-6">
            <span className="font-bold text-xl text-white font-mono">A</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white uppercase font-sans">
                AERO<span className="text-indigo-400">TYPE</span> AI
              </h1>
              <span className="text-[9px] font-mono font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full px-2.5 py-0.5">
                V2.4.0
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
              Cognitive Tactile Training Engine
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          <nav className="flex bg-slate-900/50 border border-slate-800 p-1 rounded-xl">
            {(["practice", "lessons", "coach", "analytics"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 px-3 md:px-4 rounded-lg text-xs font-bold transition-all capitalize select-none cursor-pointer ${
                  activeTab === tab
                    ? `${currentTheme.accentSolid} text-white border border-white/5`
                    : currentTheme.isLight
                    ? "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* User account capsule card */}
          <div className="flex items-center gap-3 bg-slate-900/50 border border-white/10 rounded-full pl-3 pr-1.5 py-1 select-none">
            <Flame className="w-4 h-4 text-amber-500 animate-[pulse_2s_infinite]" />
            <span className="text-xs font-mono font-bold text-amber-400">{profile.streakDays}D STREAK</span>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 rounded-full px-2 py-0.5 uppercase">
              LVL {profile.level}
            </span>
            <button
              onClick={() => {
                const updated: UserProfile = {
                  ...profile,
                  soundEnabled: !(profile.soundEnabled ?? true)
                };
                saveProfile(updated);
                setTempSoundEnabled(updated.soundEnabled!);
                if (updated.soundEnabled) {
                  if (profile.soundType === 'thud') {
                    playKeyThudSound();
                  } else {
                    playKeyClickSound();
                  }
                }
              }}
              title={profile.soundEnabled ?? true ? "Sound On" : "Sound Off"}
              className={`w-6 h-6 rounded-full bg-slate-700/60 border border-white/20 flex items-center justify-center text-xs transition-all cursor-pointer ${
                profile.soundEnabled ?? true 
                  ? "text-indigo-300 hover:text-indigo-100 hover:bg-slate-650" 
                  : "text-slate-500 hover:text-slate-400 hover:bg-slate-650"
              }`}
            >
              {(profile.soundEnabled ?? true) ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => {
                const currentIndex = THEMES.findIndex(t => t.id === currentTheme.id);
                const nextIndex = (currentIndex + 1) % THEMES.length;
                const nextTheme = THEMES[nextIndex].id;
                const updated: UserProfile = {
                  ...profile,
                  theme: nextTheme
                };
                setProfile(updated);
                localStorage.setItem("aerotype_profile", JSON.stringify(updated));
                setTempTheme(nextTheme);
              }}
              title={`Cycle Theme (Current: ${currentTheme.name})`}
              className="w-6 h-6 rounded-full bg-slate-700/60 border border-white/20 flex items-center justify-center text-xs text-emerald-300 hover:text-emerald-100 hover:bg-slate-650 transition-all cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleOpenLeaderboard}
              title="Global Leaderboard"
              className="w-6 h-6 rounded-full bg-slate-700/60 border border-white/20 flex items-center justify-center text-xs text-yellow-500 hover:text-yellow-300 hover:bg-slate-650 transition-all cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setTempUsername(profile.username);
                setTempGoal(profile.speedGoal);
                setTempLayout(profile.layout);
                setTempTheme((profile.theme as ThemeId) || 'cosmic');
                setTempSoundEnabled(profile.soundEnabled ?? true);
                setTempSoundType(profile.soundType ?? 'click');
                setShowSettings(true);
              }}
              title="Profile Settings"
              className="w-6 h-6 rounded-full bg-slate-700/60 border border-white/20 flex items-center justify-center text-xs text-indigo-300 hover:text-indigo-100 hover:bg-slate-650 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Primary content area routing based on navigation state tabs */}
      {activeTab === "practice" && (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch max-w-6xl mx-auto w-full">
          
          {/* Left Side Section: Realtime dynamic diagnostics charts & Adaptive drills setup */}
          <section className="flex flex-col gap-6 order-2">
            
            {/* Practice Session Stats */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                Live Feed Diagnostics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-slate-400">Current Velocity</span>
                  <span className="text-4xl font-mono font-bold text-white tabular-nums">
                    {liveStats.wpm}
                  </span>
                </div>
                
                {/* Dynamically expanding progress bar showing WPM against target personal goal */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (liveStats.wpm / profile.speedGoal) * 100)}%` }}
                      className="bg-indigo-500 h-full transition-all duration-300"
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>{liveStats.wpm} WPM</span>
                    <span>GOAL: {profile.speedGoal} WPM</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pb-1 border-b border-slate-850">
                  <span className="text-xs text-slate-400">Test Accuracy</span>
                  <span className={`text-2xl font-mono font-bold tabular-nums ${liveStats.accuracy >= 95 ? "text-emerald-400" : liveStats.accuracy >= 90 ? "text-amber-400" : "text-rose-400"}`}>
                    {liveStats.accuracy}%
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span>Characters typed</span>
                  <span className="text-slate-300">{typedText.length} / {targetText.length}</span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span>Logged mistakes</span>
                  <span className="text-slate-300">{mistakes}</span>
                </div>
              </div>
            </div>

            {/* AI Diagnostics Focused area & Interactive prompt targets generation triggers */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Adaptive Customizer
                </h3>
                
                <div className="space-y-4">
                  {/* List of auto detected keyboard trouble ranges */}
                  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <span className="text-[9px] font-bold text-rose-400 uppercase font-mono block">Weakest fingers reaches</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xl font-mono font-black text-white whitespace-nowrap">
                        {calculatedWeakKeysList.length > 0 ? calculatedWeakKeysList.join(" ").toUpperCase() : "NONE DETECTED"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {calculatedWeakKeysList.length > 0 ? "Under 88% accuracy" : "Keep practicing"}
                      </span>
                    </div>
                  </div>

                  {/* AI adaptive settings drawer */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Adaptive Drill focus</label>
                      <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg">
                        <button
                          onClick={() => {
                            setActiveLessonType("general");
                            resetPractice();
                          }}
                          className={`py-1 text-[10px] font-bold rounded uppercase ${
                            activeLessonType === "general" ? "bg-slate-800 text-indigo-300" : "text-slate-500"
                          }`}
                        >
                          Tactile Text
                        </button>
                        <button
                          onClick={() => {
                            setActiveLessonType("coding");
                            resetPractice();
                          }}
                          className={`py-1 text-[10px] font-bold rounded uppercase ${
                            activeLessonType === "coding" ? "bg-slate-800 text-indigo-300" : "text-slate-500"
                          }`}
                        >
                          Program Code
                        </button>
                      </div>
                    </div>

                    {activeLessonType === "coding" && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Language</label>
                        <select
                          value={aiCustomLanguage}
                          onChange={(e) => setAiCustomLanguage(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-2 py-1 text-xs text-indigo-200 outline-none"
                        >
                          <option value="python">Python Syntax</option>
                          <option value="javascript">JavaScript Async</option>
                          <option value="html-css">Tailwind Struct</option>
                          <option value="sql">SQL Aggregates</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">AI Coach Difficulty</label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg">
                        {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setAiCustomDifficulty(level)}
                            className={`py-1 text-[9px] font-bold rounded uppercase ${
                              aiCustomDifficulty === level ? "bg-indigo-600/20 text-indigo-300" : "text-slate-500"
                            }`}
                          >
                            {level.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 border-t border-slate-800/80 pt-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-300 uppercase">AI Generation</span>
                        <span className="text-[9px] text-slate-500">Toggle offline preloaded sentences</span>
                      </div>
                      <button
                        onClick={() => setUseAi(!useAi)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none`}
                        style={{ backgroundColor: useAi ? '#4f46e5' : '#1e293b' }}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            useAi ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Engine run trigger */}
              <button
                disabled={isGenerating}
                onClick={handleGenerateAiLesson}
                className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition-all disabled:opacity-50 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    COMPOSING LESSON...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    GENERATE AI DRILL
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Center Column: The Primary Typing Input terminal and virtual Keyboard layout */}
          <section className="lg:col-span-2 flex flex-col gap-6 order-1">
            
            {/* MonkeyType-inspired option selector bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/70 border border-slate-800/60 rounded-2xl px-5 py-3 backdrop-blur-md shadow-lg">
              {/* Left hand segment: Modes */}
              <div className="flex items-center gap-2 select-none">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-2">Mode:</span>
                <div className="flex bg-slate-900 border border-slate-850 p-1 rounded-xl gap-1">
                  <button
                    onClick={() => { setMonkeyMode("standard"); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all outline-none ${
                      monkeyMode === "standard" 
                        ? "bg-indigo-600/35 text-indigo-300 shadow shadow-indigo-500/10 border border-indigo-500/30" 
                        : "text-slate-450 hover:text-slate-300"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    STANDARD
                  </button>
                  <button
                    onClick={() => { setMonkeyMode("time"); setMonkeyLimit(30); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all outline-none ${
                      monkeyMode === "time" 
                        ? "bg-indigo-600/35 text-indigo-300 shadow shadow-indigo-500/10 border border-indigo-500/30" 
                        : "text-slate-450 hover:text-slate-300"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-455" />
                    TIME TRIAL
                  </button>
                  <button
                    onClick={() => { setMonkeyMode("words"); setMonkeyLimit(25); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all outline-none ${
                      monkeyMode === "words" 
                        ? "bg-indigo-600/35 text-indigo-300 shadow shadow-indigo-500/10 border border-indigo-500/30" 
                        : "text-slate-450 hover:text-slate-300"
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-red-455" />
                    WORDS DRILL
                  </button>
                </div>
              </div>

              {/* Right hand segment: Limits / Selectors based on mode */}
              <div className="flex items-center gap-2 select-none">
                {monkeyMode === "time" && (
                  <>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Time Limit:</span>
                    <div className="flex bg-slate-900 border border-slate-850 p-1 rpx rounded-xl gap-0.5 font-mono text-[11px] font-bold">
                      {[15, 30, 60, 100].map(sec => (
                        <button
                          key={sec}
                          onClick={() => { setMonkeyLimit(sec); }}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            monkeyLimit === sec 
                              ? "bg-amber-600/25 text-amber-300" 
                              : "text-slate-450 hover:text-slate-300"
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {monkeyMode === "words" && (
                  <>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Words:</span>
                    <div className="flex bg-slate-900 border border-slate-850 p-1 rounded-xl gap-0.5 font-mono text-[11px] font-bold">
                      {[10, 25, 50, 100].map(cnt => (
                        <button
                          key={cnt}
                          onClick={() => { setMonkeyLimit(cnt); }}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            monkeyLimit === cnt 
                              ? "bg-emerald-600/25 text-emerald-300" 
                              : "text-slate-450 hover:text-slate-300"
                          }`}
                        >
                          {cnt}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {monkeyMode === "standard" && (
                  <span className="text-[10px] font-mono text-slate-500/80 italic">
                    Continuous prose typing challenge
                  </span>
                )}

                {/* Toggles for Numbers and Symbols */}
                {(monkeyMode === "time" || monkeyMode === "words") && (
                  <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3 ml-2">
                    <button
                      onClick={() => setIncludeNumbers(!includeNumbers)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        includeNumbers ? "bg-indigo-600/35 text-indigo-300 border border-indigo-500/30" : "text-slate-500 hover:text-slate-400 border border-transparent"
                      }`}
                      title="Include Numbers"
                    >
                      123
                    </button>
                    <button
                      onClick={() => setIncludeSymbols(!includeSymbols)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        includeSymbols ? "bg-indigo-600/35 text-indigo-300 border border-indigo-500/30" : "text-slate-500 hover:text-slate-400 border border-transparent"
                      }`}
                      title="Include Symbols"
                    >
                      !@#
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Gymnast-grade 3D outer glow and theme-driven glassmorphism container */}
            <div
              onClick={handleFocusTypingZone}
              className={`backdrop-blur-xl ${currentTheme.cardBg} border-2 ${currentTheme.border} rounded-[2rem] p-6 md:p-8 flex-1 flex flex-col justify-between relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] shadow-indigo-500/5 overflow-hidden cursor-text min-h-[350px] transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent ${currentTheme.id === 'sepia' ? 'before:via-amber-700/20' : 'before:via-white/10'} before:to-transparent`}
            >
              
              {/* Dynamic tag headers with Live HUD statistics */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wide">
                    {activeLessonType === "coding" 
                      ? `Coding: ${currentCodingLesson.language.toUpperCase()}` 
                      : activeLessonType === "shortcut"
                      ? "Keyboard Shortcut Academy"
                      : currentGeneralLesson.category
                    }
                  </span>
                  <span className="px-2.5 py-1 bg-slate-800 border border-slate-700/20 text-slate-400 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wide">
                    {activeLessonType === "coding" ? currentCodingLesson.difficulty : activeLessonType === "shortcut" ? "System Core" : currentGeneralLesson.difficulty}
                  </span>
                </div>

                {isTestRunning ? (
                  <div className="flex items-center gap-2.5 bg-black/65 px-3 py-1 border border-white/5 rounded-xl">
                    {/* Live Clock Timer */}
                    <span className="text-xs font-mono font-black text-amber-400 tabular-nums">
                      {monkeyMode === "time" ? `${countdownSec}s` : `${Math.round((Date.now() - (startTime || Date.now())) / 1000)}s`}
                    </span>
                    <span className="text-[9px] text-slate-600">|</span>
                    {monkeyMode === "words" && (
                      <>
                        <span className="text-xs font-mono font-black text-emerald-400 tabular-nums">
                          {historicalWordCount}/{monkeyLimit}
                        </span>
                        <span className="text-[9px] text-slate-600">|</span>
                      </>
                    )}
                    {/* Running speed */}
                    <span className="text-xs font-mono font-bold text-white tabular-nums">
                      {liveStats.wpm} <span className="text-[8px] uppercase text-slate-400">WPM</span>
                    </span>
                    <span className="text-[9px] text-slate-600">|</span>
                    {/* Accuracy rate */}
                    <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                      {liveStats.accuracy}%
                    </span>
                    <span className="text-[9px] text-slate-600">|</span>
                    {/* Bouncy comedic tier rating badge */}
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${getComedicTier(liveStats.wpm).textColor} ${getComedicTier(liveStats.wpm).color} border ${getComedicTier(liveStats.wpm).borderColor}`}>
                      {getComedicTier(liveStats.wpm).emoji} {getComedicTier(liveStats.wpm).name}
                    </span>
                  </div>
                ) : (
                  <div className="text-[10px] font-mono text-slate-450 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    TACTILE LINK LIVE
                  </div>
                )}
              </div>

              {/* Character Typing Sandbox Block */}
              <div className="relative my-auto py-4">
                
                {/* Real hidden tracking textarea for reliable full framework system inputs */}
                <textarea
                  ref={typingInputRef}
                  value={typedText}
                  onChange={handleInputChange}
                  disabled={isTestFinished}
                  className="absolute inset-0 opacity-0 cursor-default pointer-events-none w-full h-full resize-none"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck="false"
                />

                {/* Character matrix display */}
                {activeLessonType === "shortcut" ? (
                  <div className="text-center py-6">
                    <h4 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">
                      HOLD AND PRESS KEY COMBINATION SIMULTANEOUSLY
                    </h4>
                    
                    <div className="flex justify-center items-center gap-3">
                      {currentShortcutLesson.keys.map((key, kIndex) => {
                        const isHeld = heldKeys.has(key.toLowerCase()) || 
                                       (key.toLowerCase() === "ctrl" && heldKeys.has("control"));
                        return (
                          <React.Fragment key={key}>
                            <div
                              className={`px-4 py-3 rounded-xl font-mono text-xl font-black border transition-all duration-150 transform ${
                                isHeld 
                                  ? "bg-amber-500 text-white border-amber-600 scale-105 shadow-lg shadow-amber-500/15" 
                                  : "bg-slate-900 border-slate-800 text-slate-300"
                              }`}
                            >
                              {key}
                            </div>
                            {kIndex < currentShortcutLesson.keys.length - 1 && (
                              <span className="text-slate-500 font-black font-mono text-lg">+</span>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-8 leading-relaxed">
                      {currentShortcutLesson.description} <br />
                      <span className="font-mono text-[10px] text-indigo-400 uppercase mt-2 block bg-indigo-500/5 py-1 px-3 rounded">
                        Context: {currentShortcutLesson.context}
                      </span>
                    </p>

                    {/* Shortcut Preview Visualizer */}
                    <div className="mt-8 mx-auto max-w-lg border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50 relative">
                      <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                        <span className="ml-2 text-[10px] text-slate-500 font-mono uppercase">Live Preview & Practice</span>
                      </div>
                      <div className="p-6 flex flex-col min-h-[160px] relative">
                        {currentShortcutLesson.id === "shortcut-copicut" && (
                          <div className="font-mono text-sm text-slate-400 text-left w-full mb-6">
                            <span className="text-indigo-400">const</span>{" "}
                            <span className={`transition-all duration-300 ${isTestFinished ? "bg-indigo-500/40 text-indigo-200" : ""}`}>userProfile</span>{" "}
                            <span className="text-slate-500">=</span>{" "}
                            <span className="text-emerald-400">getProfile</span><span className="text-slate-500">();</span>
                          </div>
                        )}
                        {currentShortcutLesson.id === "shortcut-save" && (
                          <div className="font-mono text-sm text-slate-400 text-center flex flex-col items-center gap-3 mb-6">
                            <div className={`text-5xl transition-transform duration-300 ${isTestFinished ? "scale-110" : ""}`}>
                              {isTestFinished ? "💾" : "📝"}
                            </div>
                            <div className={`transition-all duration-300 font-bold ${isTestFinished ? "text-emerald-400" : "text-slate-500"}`}>
                              {isTestFinished ? "Document Saved" : "Unsaved changes"}
                            </div>
                          </div>
                        )}
                        {currentShortcutLesson.id === "shortcut-search" && (
                          <div className="w-full relative h-32 flex flex-col text-left mb-6">
                            <div className={`absolute top-0 right-0 bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 flex items-center gap-2 transition-all duration-300 z-10 ${isTestFinished ? "translate-y-0 opacity-100 shadow-lg shadow-black/50" : "-translate-y-4 opacity-0"}`}>
                              <span className="text-slate-300 text-[10px]">items.reduce</span>
                              <div className="w-3 h-3 rounded-full border-2 border-slate-500" />
                            </div>
                            <div className="mt-8 font-mono text-xs text-slate-500 space-y-2 relative z-0">
                              <p><span className="text-indigo-400">function</span> <span className="text-emerald-400">calculateTotal</span>(items) {'{'}</p>
                              <p className={`pl-4 transition-all duration-300 ${isTestFinished ? "bg-amber-500/30 text-amber-200 rounded px-1 -mx-1 inline-block" : ""}`}>  return items.reduce((a, b) =&gt; a + b, 0);</p>
                              <p>{'}'}</p>
                            </div>
                          </div>
                        )}
                        {currentShortcutLesson.id === "shortcut-terminal" && (
                          <div className="w-full h-32 relative flex flex-col justify-end mb-6">
                            <div className="font-mono text-xs text-slate-500 mb-4 px-4 text-left">
                              <p><span className="text-emerald-400">console</span>.log(<span className="text-amber-400">"Server running..."</span>);</p>
                            </div>
                            <div className={`bg-slate-950 border-t border-slate-800 w-full transition-all duration-300 absolute bottom-0 left-0 right-0 ${isTestFinished ? "h-20" : "h-0"} overflow-hidden`}>
                              <div className="p-3 font-mono text-[10px] text-emerald-400 text-left">
                                <p><span className="text-indigo-400">➜</span>  <span className="text-white">Local:</span>   http://localhost:3000/</p>
                                <p className="text-slate-500 mt-1">press h to show help</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="w-full mt-auto">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold text-left">Interactive Sandbox</p>
                          <textarea 
                            key={currentShortcutLesson.id}
                            className="w-full bg-slate-900 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-300 font-mono resize-none focus:outline-none focus:border-indigo-500/50 transition-colors"
                            rows={3}
                            placeholder="Click here to practice text selection and shortcuts..."
                            defaultValue={
                              currentShortcutLesson.id === "shortcut-delete-word" 
                                ? "This sentence has some completely unnecessary words that you should probably delete quickly."
                                : currentShortcutLesson.id.includes("move-word")
                                ? "Navigate through this long sentence quickly by jumping over words instead of single characters."
                                : currentShortcutLesson.id === "shortcut-select-all"
                                ? "You will want to select this entire block of text all at once. Try using the shortcut now."
                                : currentShortcutLesson.id === "shortcut-undo"
                                ? "Type some random mistakes here, then use the shortcut to travel back in time and undo them."
                                : "function practiceArea() {\n  // Try out your keyboard shortcuts here!\n  const message = 'Hello World';\n}"
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : activeLessonType === "coding" ? (
                  // Coding multi-line viewport
                  <pre className={`font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre rounded-2xl bg-black/85 p-6 border-2 ${currentTheme.id === 'terminal' ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : currentTheme.id === 'sepia' ? 'border-amber-700/40 shadow-[0_4px_24px_rgba(139,92,26,0.1)]' : 'border-slate-800/80 shadow-[0_12px_40px_rgba(0,0,0,0.65)]'} selection:bg-transparent transition-all duration-300 relative`}>
                    <div className="absolute top-2 right-3 flex items-center gap-1.5 opacity-45 select-none font-sans text-[9px] uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></span>
                      CODE PARSER VIEW
                    </div>
                    <code className="block relative z-10">
                      {tokens.map((token, tokIdx) => {
                        if (!token.isWord) {
                          return (
                            <span key={tokIdx} className="whitespace-pre">
                              {token.text.split("").map((targetChar, offset) => {
                                const index = token.startIndex + offset;
                                const { letterColorClass, letterBgClass } = getLetterStyle(index, targetChar);

                                if (targetChar === "\n") {
                                  return (
                                    <span key={index} className={`${letterColorClass} ${letterBgClass}`}>
                                      ↵{"\n"}
                                    </span>
                                  );
                                }
                                return (
                                  <span key={index} className={`${letterColorClass} ${letterBgClass}`}>
                                    {targetChar}
                                  </span>
                                );
                              })}
                            </span>
                          );
                        }

                        let status: "correct" | "wrong" | "edited" | "active" | "unvisited" = "unvisited";
                        if (typedText.length > token.startIndex) {
                          const isPast = typedText.length >= token.endIndex;
                          const checkEnd = Math.min(typedText.length, token.endIndex);
                          
                          let hasTypo = false;
                          let hasEdit = false;
                          for (let i = token.startIndex; i < checkEnd; i++) {
                            if (typedText[i] !== displayTargetText[i]) {
                              hasTypo = true;
                            }
                            if (editedIndices.has(i)) {
                              hasEdit = true;
                            }
                          }
                          
                          if (hasTypo) status = "wrong";
                          else if (hasEdit) status = "edited";
                          else if (isPast) status = "correct";
                          else status = "active";
                        }

                        // Style blocks per status
                        let wordStyle = "px-1 mx-0.5 border-b border-transparent transition-all duration-200";
                        if (status === "active") {
                          wordStyle = `border-b-2 ${currentTheme.id === 'sepia' ? 'border-amber-700/50 bg-amber-600/5' : 'border-indigo-400/60 bg-indigo-500/5'} px-1 mx-0.5 rounded-t-md`;
                        }

                        return (
                          <span key={tokIdx} className={`inline-block whitespace-nowrap align-middle transition-all ${wordStyle}`}>
                            {token.text.split("").map((targetChar, offset) => {
                              const index = token.startIndex + offset;
                              const { letterColorClass, letterBgClass } = getLetterStyle(index, targetChar);

                              return (
                                <span key={index} className={`${letterColorClass} ${letterBgClass}`}>
                                  {targetChar}
                                </span>
                              );
                            })}
                          </span>
                        );
                      })}
                    </code>
                  </pre>
                ) : (monkeyMode === "time" || monkeyMode === "words") && timeTrialSentences.length >= 2 ? (
                  // Custom Time Trial Rolling Layout
                  <div className="flex flex-col gap-5 select-none bg-slate-900/10 p-6 md:p-8 border border-dashed border-slate-800/40 rounded-3xl relative overflow-hidden transition-all duration-300">
                    {/* Active Line (Sentence 1) with key-based flip animation */}
                    <motion.div
                      key={timeTrialSentences[0]}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="relative min-h-[90px] flex flex-col justify-end"
                    >
                      <div className="absolute left-0 top-0 text-[9px] uppercase font-mono font-black tracking-widest text-indigo-400 opacity-80 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/15 select-none md:mb-1 block">
                        ACTIVE SENTENCE
                      </div>
                      <div className={`pt-6 md:pt-5 font-mono text-xl md:text-2xl lg:text-3xl leading-relaxed ${currentTheme.isLight ? 'text-stone-850' : 'text-white'} tracking-wide text-left break-words flex flex-wrap gap-x-1.5 gap-y-1`}>
                        {tokens.map((token, tokIdx) => {
                          if (!token.isWord) {
                            return (
                              <span key={tokIdx} className="whitespace-pre">
                                {token.text.split("").map((targetChar, offset) => {
                                  const index = token.startIndex + offset;
                                  const { letterColorClass, letterBgClass } = getLetterStyle(index, targetChar);

                                  return (
                                    <span key={index} className={`${letterColorClass} ${letterBgClass}`}>
                                      {targetChar}
                                    </span>
                                  );
                                })}
                              </span>
                            );
                          }

                          let status: "correct" | "wrong" | "edited" | "active" | "unvisited" = "unvisited";
                          if (typedText.length > token.startIndex) {
                            const isPast = typedText.length >= token.endIndex;
                            const checkEnd = Math.min(typedText.length, token.endIndex);
                            
                            let hasTypo = false;
                            let hasEdit = false;
                            for (let i = token.startIndex; i < checkEnd; i++) {
                              if (typedText[i] !== displayTargetText[i]) {
                                hasTypo = true;
                              }
                              if (editedIndices.has(i)) {
                                  hasEdit = true;
                              }
                            }
                            
                            if (hasTypo) status = "wrong";
                            else if (hasEdit) status = "edited";
                            else if (isPast) status = "correct";
                            else status = "active";
                          }

                          // Word level wrapper (subtle active underline only, no heavy boxes)
                          let wordStyle = "px-1 mx-0.5 border-b border-transparent transition-all duration-200";
                          if (status === "active") {
                            wordStyle = `border-b-2 ${currentTheme.id === 'sepia' ? 'border-amber-700/50 bg-amber-600/5' : 'border-indigo-400/60 bg-indigo-500/5'} px-1 mx-0.5 rounded-t-xl`;
                          }

                          return (
                            <span key={tokIdx} className={`inline-block whitespace-nowrap align-middle transition-all ${wordStyle}`}>
                              {token.text.split("").map((targetChar, offset) => {
                                const index = token.startIndex + offset;
                                const { letterColorClass, letterBgClass } = getLetterStyle(index, targetChar);

                                return (
                                  <span key={index} className={`${letterColorClass} ${letterBgClass}`}>
                                    {targetChar}
                                  </span>
                                );
                              })}
                            </span>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Divider line */}
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-800/40 to-transparent my-1"></div>

                    {/* Upcoming Line (Sentence 2) with sliding layout */}
                    <motion.div
                      key={`next-${timeTrialSentences[1]}`}
                      initial={{ y: 25, opacity: 0 }}
                      animate={{ y: 0, opacity: 0.4 }}
                      transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                      className="relative min-h-[70px] flex flex-col justify-end"
                    >
                      <div className="absolute left-0 top-0 text-[9px] uppercase font-mono font-bold tracking-widest text-slate-500 select-none block">
                        UPCOMING SENTENCE
                      </div>
                      <div className="pt-5 font-mono text-lg md:text-xl text-slate-400/90 text-left tracking-wide leading-relaxed filter blur-[0.3px] select-none select-text bg-transparent line-clamp-2">
                        {timeTrialSentences[1]}
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  // General text layout
                  <div className={`font-mono text-xl md:text-2xl leading-relaxed select-none ${currentTheme.isLight ? 'text-stone-400' : 'text-slate-550'} tracking-wide text-left break-words bg-slate-900/10 p-5 border border-dashed border-slate-800/40 rounded-2xl`}>
                    {tokens.map((token, tokIdx) => {
                      if (!token.isWord) {
                        return (
                          <span key={tokIdx} className="whitespace-pre">
                            {token.text.split("").map((targetChar, offset) => {
                              const index = token.startIndex + offset;
                              const { letterColorClass, letterBgClass } = getLetterStyle(index, targetChar);

                              return (
                                <span key={index} className={`${letterColorClass} ${letterBgClass}`}>
                                  {targetChar}
                                </span>
                              );
                            })}
                          </span>
                        );
                      }

                      let status: "correct" | "wrong" | "edited" | "active" | "unvisited" = "unvisited";
                      if (typedText.length > token.startIndex) {
                        const isPast = typedText.length >= token.endIndex;
                        const checkEnd = Math.min(typedText.length, token.endIndex);
                        
                        let hasTypo = false;
                        let hasEdit = false;
                        for (let i = token.startIndex; i < checkEnd; i++) {
                          if (typedText[i] !== displayTargetText[i]) {
                            hasTypo = true;
                          }
                          if (editedIndices.has(i)) {
                            hasEdit = true;
                          }
                        }
                        
                        if (hasTypo) status = "wrong";
                        else if (hasEdit) status = "edited";
                        else if (isPast) status = "correct";
                        else status = "active";
                      }

                      // Word level wrapper (subtle active underline only, no heavy boxes)
                      let wordStyle = "px-1 mx-0.5 border-b border-transparent transition-all duration-200";
                      if (status === "active") {
                        wordStyle = `border-b-2 ${currentTheme.id === 'sepia' ? 'border-amber-700/50 bg-amber-600/5' : 'border-indigo-400/60 bg-indigo-500/5'} px-1 mx-0.5 rounded-t-xl`;
                      }

                      return (
                        <span key={tokIdx} className={`inline-block whitespace-nowrap align-middle transition-all ${wordStyle}`}>
                          {token.text.split("").map((targetChar, offset) => {
                            const index = token.startIndex + offset;
                            const { letterColorClass, letterBgClass } = getLetterStyle(index, targetChar);

                            return (
                              <span key={index} className={`${letterColorClass} ${letterBgClass}`}>
                                  {targetChar}
                              </span>
                            );
                          })}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Helper tips and focus warning labels */}
              <div className="flex flex-wrap gap-y-2 justify-between items-center text-slate-500 font-mono text-[10px] uppercase tracking-wider pt-4 border-t border-slate-900">
                <span className="flex items-center gap-1.5 selection:bg-transparent">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  {isTestRunning ? "Practice is active..." : "Click anywhere here to focus & type"}
                </span>

                {activeLessonType === "coding" && codingMyMistakesCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCorrectAndRun();
                    }}
                    className="flex items-center gap-1.5 py-1 px-3 bg-rose-550/15 hover:bg-rose-550/30 border border-rose-500/30 text-rose-350 rounded-lg font-bold transition-all text-[9.5px] cursor-pointer animate-[pulse_2s_infinite]"
                    title="Auto-correct all current programming typing typos on-the-fly and execute instantly"
                  >
                    <Sparkles className="w-3 h-3 text-rose-400 animate-pulse" />
                    Correct {codingMyMistakesCount} Typos & Run
                  </button>
                )}
                
                <div className="flex gap-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetPractice();
                    }}
                    className="flex items-center gap-1 hover:text-white transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset [ESC]
                  </button>
                  <span className="text-slate-600">LAYOUT: {profile.layout}</span>
                </div>
              </div>

            </div>

            {/* Real-time Code Execution Console Sandbox */}
            {activeLessonType === "coding" && (
              <div className="bg-[#0b0f19]/95 border border-slate-800/80 rounded-3xl p-5 md:p-6 backdrop-blur-sm shadow-xl flex flex-col gap-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Terminal className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Virtual Terminal Console
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Test and evaluate your code lines on the live sandbox container
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {codingMyMistakesCount > 0 && (
                      <button
                        onClick={handleCorrectAndRun}
                        disabled={isRunningCode}
                        className="py-1.5 px-3 bg-rose-600/15 hover:bg-rose-600/30 border border-rose-500/30 text-rose-400 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer animate-[pulse_1.5s_infinite]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        Correct {codingMyMistakesCount} Typos & Run
                      </button>
                    )}
                    <button
                      onClick={() => handleRunCode(false)}
                      disabled={isRunningCode || !typedText}
                      className="py-1.5 px-3 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                    >
                      {isRunningCode ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      Run My Typed Code
                    </button>
                    <button
                      onClick={() => handleRunCode(true)}
                      disabled={isRunningCode}
                      className="py-1.5 px-3 bg-indigo-600/15 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-300 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5" />
                      Run Full Source
                    </button>
                  </div>
                </div>

                {/* Simulated/Real Terminal Shell Frame */}
                <div className="bg-[#05070c] border border-slate-950 rounded-xl p-4 font-mono text-xs shadow-inner overflow-hidden relative">
                  {/* Top bar controls */}
                  <div className="flex items-center justify-between mb-3 text-slate-600 border-b border-slate-950/60 pb-1.5">
                    <div className="flex items-center gap-1.5 select-none">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/50"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/50"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/50"></span>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold select-none">
                      {currentCodingLesson.language.toUpperCase()} ENGINE
                    </span>
                  </div>

                  <div className="max-h-[160px] overflow-y-auto space-y-2 select-text selection:bg-indigo-500/35 leading-relaxed text-slate-300 scrollbar-thin">
                    <div className="text-slate-500 select-none">
                      pilot@nexus-sandbox:~$ fetch --execute "{currentCodingLesson.language}"
                    </div>
                    
                    {codeOutput ? (
                      <pre className="whitespace-pre-wrap word-break break-all text-emerald-350 font-mono">
                        {codeOutput}
                      </pre>
                    ) : (
                      <div className="text-slate-600 italic select-none">
                        No logs printed. Start typing the target block above. Click "Run My Typed Code" at any time to execute your keystrokes, or click "Run Full Source" to view the complete solution's execution.
                      </div>
                    )}
                  </div>
                </div>

                {/* HTML/CSS Embedded frame if rendering layout */}
                {htmlPreviewCode && (
                  <div className="border border-slate-900 rounded-xl overflow-hidden bg-[#07090e] shadow-lg animate-fadeIn flex flex-col">
                    <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-900 text-[10px] font-mono text-indigo-300 uppercase font-black tracking-widest flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Live Interactive Render Box
                      </div>
                      <span className="text-xs text-slate-500 lowercase">iframe preview</span>
                    </div>
                    <iframe
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <meta charset="utf-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <script src="https://cdn.tailwindcss.com"></script>
                        </head>
                        <body class="p-6 bg-slate-950 text-white flex items-center justify-center min-h-[160px] font-sans">
                          ${htmlPreviewCode}
                        </body>
                        </html>
                      `}
                      className="w-full h-44 bg-slate-950"
                      title="HTML Sandbox"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Virtual Physical Touch Keyboard */}
            <Keyboard
              activeKeys={heldKeys}
              layout={profile.layout}
              keyStats={profile.keyStats}
              justWrongKey={justWrongKey}
              themeId={profile.theme || 'cosmic'}
            />

          </section>

          {/* Right Column: Achievements registry, Streak trackers, progress charts */}
          <section className="flex flex-col gap-6 order-3">
            
            {/* Daily Milestone task card */}
            <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-600/10 flex flex-col justify-between">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80 font-mono">Daily Directive</h3>
                <p className="text-base font-extrabold leading-snug">Complete 3 adaptive typing logs sessions today</p>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                  <span className="opacity-90">{completedHistorySessionsToday >= 3 ? "Mission Objective Secured" : `${completedHistorySessionsToday} of 3 drills finished`}</span>
                  <span>{Math.round(Math.min(100, (completedHistorySessionsToday / 3) * 100))}%</span>
                </div>
                <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (completedHistorySessionsToday / 3) * 100)}%` }}
                    className="bg-white h-full transition-all duration-300"
                  ></div>
                </div>
              </div>
            </div>

            {/* Achievements highlights tracker container */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    Earned Milestones
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono font-semibold">
                    {profile.unlockedAchievements.length} / {ACHIEVEMENTS_LIST.length}
                  </span>
                </div>

                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {ACHIEVEMENTS_LIST.slice(0, 4).map((achievement) => {
                    const isUnlocked = profile.unlockedAchievements.includes(achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                          isUnlocked
                            ? "bg-slate-900/80 border-indigo-500/20 text-slate-200"
                            : "bg-slate-950/40 border-slate-900/40 opacity-40 text-slate-550"
                        }`}
                      >
                        <div className="text-2xl pt-0.5">{achievement.icon}</div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-200">{achievement.title}</h4>
                            {isUnlocked && <Check className="w-3 h-3 text-emerald-400" />}
                          </div>
                          <p className="text-[10px] text-slate-450 mt-0.5 leading-normal">{achievement.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick stats summarizing overall practice metrics */}
              <div className="pt-4 border-t border-slate-900 mt-4 space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Accrued Experience</span>
                  <span className="text-slate-200 font-bold">{profile.xp} XP</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Drills practicing log</span>
                  <span className="text-slate-200 font-bold">{profile.history.length} runs</span>
                </div>
              </div>

            </div>

          </section>
        </main>
      )}

      {activeTab === "lessons" && (
        <main className="flex-1 max-w-4xl mx-auto w-full py-2 animate-fadeIn space-y-6">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2 font-mono flex items-center gap-2">
              <BookOpen className="text-indigo-400 w-5 h-5" />
              Tactile Practice Curriculums
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Step through our structured drills to cement physical tactile muscle memory. Move sequentially from baseline home-row rest locations up to advanced syntax codes.
            </p>

            <div className="space-y-8">
              
              {/* Category section mapping */}
              <div className="space-y-8">
                {["Basics: Home Row", "Basics: Top Row", "Basics: Bottom Row", "Mastery: N-Grams", "Pro Tips: Sentences", "Advanced: Shift & Caps", "Advanced: Numbers & Symbols"].map((categoryName) => {
                  const items = CURATED_LESSONS.filter(l => l.category === categoryName);
                  if (items.length === 0) return null;
                  
                  return (
                    <div key={categoryName}>
                      <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 font-mono">
                        {categoryName}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setCurrentGeneralLesson(item);
                              setActiveLessonType("general");
                              setMonkeyMode("standard");
                              setActiveTab("practice");
                            }}
                            className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-indigo-400 transition-all cursor-pointer flex justify-between items-center group"
                          >
                            <div>
                              <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">{item.difficulty}</span>
                              <h5 className="text-sm font-bold text-white mt-1 group-hover:text-indigo-400">{item.title}</h5>
                              <p className="text-xs text-slate-450 mt-1 max-w-md line-clamp-2">{item.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Custom cache element if practice logged previously */}
              {aiCustomLesson && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    Your last generated AI adaptive focus lesson
                  </h4>
                  <div
                    onClick={() => {
                      setCurrentGeneralLesson(aiCustomLesson);
                      setActiveLessonType("general");
                      setMonkeyMode("standard");
                      setActiveTab("practice");
                    }}
                    className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 hover:border-indigo-400/50 transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">AI SPECIALIZED</span>
                      <h5 className="text-sm font-bold text-white mt-1">{aiCustomLesson.title}</h5>
                      <p className="text-xs text-slate-450 mt-1">{aiCustomLesson.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 font-mono flex items-center gap-1">
                  <Code className="w-4 h-4 text-indigo-400" />
                  Programming & Multi-line developer drills
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CODING_LESSONS.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrentCodingLesson(item);
                        setActiveLessonType("coding");
                        setMonkeyMode("standard");
                        setActiveTab("practice");
                      }}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-indigo-400 transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">{item.language}</span>
                        <h5 className="text-sm font-bold text-white mt-1 group-hover:text-indigo-400">{item.title}</h5>
                        <p className="text-xs text-slate-450 mt-1 max-w-sm line-clamp-2">{item.explanation}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 font-mono flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Keyboard Shortcut Academy
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SHORTCUT_LESSONS.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrentShortcutLesson(item);
                        setActiveLessonType("shortcut");
                        setMonkeyMode("standard");
                        setActiveTab("practice");
                      }}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-amber-400 transition-all cursor-pointer flex justify-between items-center group"
                    >
                      <div>
                        <span className="text-[9px] font-mono text-amber-400 font-bold uppercase">{item.platform}</span>
                        <h5 className="text-sm font-bold text-white mt-1 group-hover:text-amber-400">{item.title}</h5>
                        <p className="text-xs text-slate-450 mt-1 max-w-sm">{item.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      )}

      {activeTab === "analytics" && (
        <main className="flex-1 max-w-4xl mx-auto w-full py-2 space-y-6 animate-fadeIn">
          
          {/* Diagnostic key statistics dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 text-center">
              <span className="text-xs text-slate-400 font-mono">ALL-TIME SESSIONS</span>
              <p className="text-4xl font-mono font-bold text-white mt-2">{profile.history.length}</p>
              <p className="text-[10px] text-slate-500 mt-2">Durable runs logged locally</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 text-center">
              <span className="text-xs text-slate-400 font-mono">MEDIAN ACCURACY</span>
              <p className="text-4xl font-mono font-bold text-emerald-400 mt-2">
                {profile.history.length > 0 
                  ? Math.round(profile.history.reduce((a, b) => a + b.accuracy, 0) / profile.history.length)
                  : 100
                }%
              </p>
              <p className="text-[10px] text-slate-500 mt-2">Consistency health goal: 95%+</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 text-center">
              <span className="text-xs text-slate-400 font-mono">PEAK PERFORMANCE RECORD</span>
              <p className="text-4xl font-mono font-bold text-indigo-400 mt-2">
                {profile.history.reduce((max, raw) => raw.wpm > max ? raw.wpm : max, 48)} <span className="text-xs">WPM</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-2">Target personal speed goal: {profile.speedGoal} WPM</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Visual key diagnostic metrics */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 md:col-span-8">
              <h4 className="text-xs font-bold uppercase text-slate-450 tracking-wider mb-4 font-mono">
                Physical keyboard diagnostic log readings
              </h4>
              <div className="space-y-4">
                {Object.keys(profile.keyStats).length === 0 ? (
                  <p className="text-slate-500 text-xs py-8 text-center font-mono">No character key iterations practice logged yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(profile.keyStats).slice(0, 12).map(([character, rawStats]: [string, KeyStats]) => {
                      const accRate = Math.max(0, Math.round(((rawStats.attempts - rawStats.errors) / rawStats.attempts) * 100));
                      const averageLatency = Math.round(rawStats.totalLatencyMs / rawStats.attempts);
                      return (
                        <div key={character} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-mono font-black text-white uppercase">{character}</span>
                            <span className="text-[10px] text-slate-500 block font-mono">Tested: {rawStats.attempts}x</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-bold block ${accRate >= 94 ? "text-emerald-450" : accRate >= 85 ? "text-amber-450" : "text-rose-450"}`}>
                              {accRate}% acc
                            </span>
                            <span className="text-[10px] text-slate-450 block font-mono">{averageLatency}ms delay</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Historic run ledger log list */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 md:col-span-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-450 tracking-wider mb-3 font-mono">
                  Sprints Ledger history
                </h4>
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {profile.history.length === 0 ? (
                    <p className="text-slate-500 text-xs py-10 text-center italic">Ready to track your habits.</p>
                  ) : (
                    profile.history.slice().reverse().map((record) => (
                      <div key={record.id} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-850/80 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-200 truncate max-w-[120px]">{record.lessonTitle}</p>
                          <span className="text-[9px] text-slate-500 uppercase">{record.lessonType}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-indigo-300">{record.wpm} WPM</p>
                          <p className="text-[10px] text-emerald-400 font-semibold">{record.accuracy}% accuracy</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to restore default prototype status data? This removes local records.")) {
                    localStorage.removeItem("aerotype_profile");
                    setProfile(DEFAULT_PROFILE);
                  }
                }}
                className="w-full text-center text-[10px] text-rose-400 border border-rose-500/10 hover:border-rose-400/40 bg-rose-500/5 py-1.5 rounded-lg mt-4 cursor-pointer font-bold font-mono"
              >
                RESTORE FACTORY SETTINGS
              </button>
            </div>
          </div>
        </main>
      )}

      {activeTab === "coach" && (
        <main className="flex-1 max-w-4xl mx-auto w-full py-2 animate-fadeIn space-y-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-850 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-850">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-600/5">
                  <Brain className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Biomechanics Typing Coach</h3>
                  <p className="text-xs text-slate-400">Generate personal posture recommendations and layout advice utilizing live key diagnostics data.</p>
                </div>
              </div>

              <button
                disabled={isFetchingCoach}
                onClick={handleFetchAiCoach}
                className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-98 shadow-md"
              >
                {isFetchingCoach ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ANALYZING KINETICS...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    GENERATE RE-ALIGNMENT REPORT
                  </>
                )}
              </button>
            </div>

            {/* Coach assessment body layout */}
            {coachFeedback ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 animate-fadeIn">
                <div className="md:col-span-7 space-y-5">
                  <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 font-mono">Overall Diagnostic Assessment</h4>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{coachFeedback.overallAssessment}</p>
                  </div>

                  <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2 font-mono">Tactile Weakness explainer</h4>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans">{coachFeedback.weaknessExplainer}</p>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl h-full flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-mono">Re-alignment Action Plan</h4>
                      <ul className="space-y-4">
                        {coachFeedback.curatedPracticePlan.map((step, index) => (
                          <li key={index} className="flex gap-3 text-xs leading-relaxed text-slate-300">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono flex items-center justify-center font-bold shrink-0">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono mt-8 p-3 bg-slate-950 rounded-xl border border-slate-900 flex items-start gap-2 leading-relaxed">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Advice generated by Gemini based on your unique error metrics. Practice keeping your wrists floating above desk surfaces.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto space-y-4">
                  <p className="text-xs text-slate-500 font-mono leading-relaxed">
                    Ready to evaluate your hand alignment trends and finger agility. Run some lessons first, then click trigger above to request your customized Kinetic feedback.
                  </p>
                  <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-xl text-left max-w-sm mx-auto">
                    <h5 className="text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Key performance stats tracked:</h5>
                    <ul className="space-y-1 text-[11px] text-slate-500 font-mono list-disc list-inside">
                      <li>Reach/displacement timings (ms)</li>
                      <li>Heatmaps of mistyped key distributions</li>
                      <li>Pacing rhythm variation coefficients</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      )}

      {/* Footer diagnostic logs */}
      <footer className="mt-auto pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-slate-500 gap-2 border-t border-white/5 select-none">
        <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
          <span>ENGINE STATUS: <span className="text-indigo-400 font-bold">ONLINE</span></span>
          <span>ACTIVE USER: <span className="text-indigo-400 uppercase">{profile.username}</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Sync status: Local Storage ok
          </span>
          <span>Adaptive AI Typing Dashboard v2.4</span>
        </div>
      </footer>

    </div>
  );
}
