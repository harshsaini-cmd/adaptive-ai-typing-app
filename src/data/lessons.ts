import { Lesson, CodingLesson, ShortcutLesson, Achievement } from "../types";

export const CURATED_LESSONS: Lesson[] = [
  // BASICS: HOME ROW
  {
    id: "typing-club-basics-1",
    title: "Lesson 1: f & j",
    category: "Basics: Home Row",
    difficulty: "beginner",
    text: "f j f j f j f j ff jj fj jf f j ff jj f f j j f j f j ff jj",
    description: "The absolute basics. Use your left index finger for f and your right index finger for j."
  },
  {
    id: "typing-club-basics-2",
    title: "Lesson 2: d & k",
    category: "Basics: Home Row",
    difficulty: "beginner",
    text: "d k d k d k d k dd kk dk kd d k dd kk d d k k d k d k dd kk",
    description: "Use your left middle finger for d and right middle finger for k."
  },
  {
    id: "typing-club-practice-1",
    title: "Practice: f j d k",
    category: "Basics: Home Row",
    difficulty: "beginner",
    text: "fd jk df kj fdk jdf kfj dfk fj dk fd jk df kj f d k j",
    description: "Combine the first four keys with simple drills."
  },
  {
    id: "typing-club-basics-3",
    title: "Lesson 3: s & l",
    category: "Basics: Home Row",
    difficulty: "beginner",
    text: "s l s l s l s l ss ll sl ls s l ss ll s s l l s l s l ss ll",
    description: "Use your left ring finger for s and right ring finger for l."
  },
  {
    id: "typing-club-practice-2",
    title: "Practice: f j d k s l",
    category: "Basics: Home Row",
    difficulty: "beginner",
    text: "sl ls fs jl ds lk sdl slkf jdls kfdl ljsd fdsl f s d l",
    description: "Practice the 6 inner home row keys."
  },
  {
    id: "typing-club-basics-4",
    title: "Lesson 4: a & ;",
    category: "Basics: Home Row",
    difficulty: "beginner",
    text: "a ; a ; a ; a ; aa ;; a; ;a a ; aa ;; a a ; ; a ; a ; aa ;;",
    description: "Use your left pinky for a and your right pinky for ;."
  },
  {
    id: "typing-club-practice-3",
    title: "Practice: Home Row Base",
    category: "Basics: Home Row",
    difficulty: "beginner",
    text: "a as add ads lad lads sad salad fad fall falls alas flak ask asks",
    description: "Type real words using the core 8 home row keys."
  },
  {
    id: "typing-club-basics-5",
    title: "Lesson 5: g & h",
    category: "Basics: Home Row",
    difficulty: "beginner",
    text: "g h g h g h g h gg hh gh hg g h gg hh g g h h g h g h gg hh",
    description: "Stretch your left index finger to g and right index finger to h."
  },
  {
    id: "typing-club-practice-4",
    title: "Practice: g & h",
    category: "Basics: Home Row",
    difficulty: "beginner",
    text: "gas gash had has half flag flash ash hash glass glad lag sag gag hag",
    description: "Integrate g and h into your home row vocabulary."
  },
  {
    id: "typing-club-1",
    title: "Home Row Real Words",
    category: "Basics: Home Row",
    difficulty: "beginner",
    text: "dad sad lad fad alas fall glad lass glass salad flask alfalfa slag flask gash hash splash",
    description: "Practice combining all home row keys into real words."
  },

  // BASICS: TOP ROW
  {
    id: "typing-club-basics-6",
    title: "Lesson 6: e & i",
    category: "Basics: Top Row",
    difficulty: "beginner",
    text: "e i e i e i e i ee ii ei ie e i ee ii e e i i e i e i ee ii",
    description: "Move your middle fingers up to e and i."
  },
  {
    id: "typing-club-practice-5",
    title: "Practice: e & i",
    category: "Basics: Top Row",
    difficulty: "beginner",
    text: "he she see sea feel fill file side hide high his did dig lie age life desk fish dish sled lid",
    description: "Use your new vowels to type many common English words."
  },
  {
    id: "typing-club-basics-7",
    title: "Lesson 7: r & u",
    category: "Basics: Top Row",
    difficulty: "beginner",
    text: "r u r u r u r u rr uu ru ur r u rr uu r r u u r u r u rr uu",
    description: "Move your index fingers up to r and u."
  },
  {
    id: "typing-club-practice-6",
    title: "Practice: r & u",
    category: "Basics: Top Row",
    difficulty: "beginner",
    text: "red read ride use rude rule fur sure urge rug hear hare hard guard grass drug red",
    description: "Practice the r and u keys with real words."
  },
  {
    id: "typing-club-basics-8",
    title: "Lesson 8: t & y",
    category: "Basics: Top Row",
    difficulty: "beginner",
    text: "t y t y t y t y tt yy ty yt t y tt yy t t y y t y t y tt yy",
    description: "Stretch your index fingers up and over to t and y."
  },
  {
    id: "typing-club-practice-7",
    title: "Practice: t & y",
    category: "Basics: Top Row",
    difficulty: "beginner",
    text: "the they that this there yet yes toy try stay tree fast start state art height light right",
    description: "Practice t and y with common words."
  },
  {
    id: "typing-club-basics-9",
    title: "Lesson 9: w & o",
    category: "Basics: Top Row",
    difficulty: "beginner",
    text: "w o w o w o w o ww oo wo ow w o ww oo w w o o w o w o ww oo",
    description: "Move your ring fingers up to w and o."
  },
  {
    id: "typing-club-practice-8",
    title: "Practice: w & o",
    category: "Basics: Top Row",
    difficulty: "beginner",
    text: "who word work world low row show slow old out our gold good food word wood root shoot out",
    description: "Practice w and o with common words."
  },
  {
    id: "typing-club-basics-10",
    title: "Lesson 10: q & p",
    category: "Basics: Top Row",
    difficulty: "beginner",
    text: "q p q p q p q p qq pp qp pq q p qq pp q q p p q p q p qq pp",
    description: "Move your pinky fingers up to q and p."
  },
  {
    id: "typing-club-practice-9",
    title: "Practice: q & p",
    category: "Basics: Top Row",
    difficulty: "beginner",
    text: "quit page pass play group stop step deep keep top up quite equip drop rope hope power quiet",
    description: "Complete the top row with q and p."
  },
  {
    id: "typing-club-7",
    title: "Top Row Real Words",
    category: "Basics: Top Row",
    difficulty: "beginner",
    text: "red use rude fur runner sure under user standard computer super rules turn trust true run rust rural",
    description: "Incorporate the top row into real words."
  },

  // BASICS: BOTTOM ROW
  {
    id: "typing-club-basics-11",
    title: "Lesson 11: v & m",
    category: "Basics: Bottom Row",
    difficulty: "beginner",
    text: "v m v m v m v m vv mm vm mv v m vv mm v v m m v m v m vv mm",
    description: "Move your index fingers down to v and m."
  },
  {
    id: "typing-club-practice-10",
    title: "Practice: v & m",
    category: "Basics: Bottom Row",
    difficulty: "beginner",
    text: "have give live move more some time make them from him room game same came home name form",
    description: "Practice v and m with common words."
  },
  {
    id: "typing-club-basics-12",
    title: "Lesson 12: b & n",
    category: "Basics: Bottom Row",
    difficulty: "beginner",
    text: "b n b n b n b n bb nn bn nb b n bb nn b b n n b n b n bb nn",
    description: "Stretch your left index finger to b and right index finger to n."
  },
  {
    id: "typing-club-practice-11",
    title: "Practice: b & n",
    category: "Basics: Bottom Row",
    difficulty: "beginner",
    text: "can run sun fun man men pen ten pan bin ban ben bound round sound bound back bank rank bone",
    description: "Practice b and n with common words."
  },
  {
    id: "typing-club-basics-13",
    title: "Lesson 13: c & ,",
    category: "Basics: Bottom Row",
    difficulty: "beginner",
    text: "c , c , c , c , cc ,, c, ,c c , cc ,, c c , , c , c , cc ,,",
    description: "Move your middle fingers down to c and , (comma)."
  },
  {
    id: "typing-club-basics-14",
    title: "Lesson 14: x & .",
    category: "Basics: Bottom Row",
    difficulty: "beginner",
    text: "x . x . x . x . xx .. x. .x x . xx .. x x . . x . x . xx ..",
    description: "Move your ring fingers down to x and . (period)."
  },
  {
    id: "typing-club-basics-15",
    title: "Lesson 15: z & /",
    category: "Basics: Bottom Row",
    difficulty: "beginner",
    text: "z / z / z / z / zz // z/ /z z / zz // z z / / z / z / zz //",
    description: "Move your pinky fingers down to z and / (slash)."
  },
  {
    id: "typing-club-9",
    title: "Bottom Row Real Words",
    category: "Basics: Bottom Row",
    difficulty: "beginner",
    text: "cam mac mice clan milk calm mud muscle memory charm clean class clear click comb come micro crown comic",
    description: "Practice words utilizing the entire bottom row."
  },

  // MASTERY: N-GRAMS & WORDS
  {
    id: "mastery-ngrams-1",
    title: "Most Common N-Grams",
    category: "Mastery: N-Grams",
    difficulty: "intermediate",
    text: "th he in er an re nd at on nt ha es st en ed to it ou ea hi is or ti as te et ng of al de se le sa si ar ve ra ro fi",
    description: "Practice the most frequent 2-letter combinations (bigrams) in the English language."
  },
  {
    id: "mastery-words-1",
    title: "Top 50 English Words",
    category: "Mastery: N-Grams",
    difficulty: "intermediate",
    text: "the of to and a in is it you that he was for on are as with his they i at be this have from or one had by word but not what all were we when your can said there use an each which she do how their if will up other about out many then them these so some her",
    description: "Type the 50 most commonly used words in English."
  },

  // PRO TIPS: SENTENCES
  {
    id: "pro-tips-1",
    title: "Tip 1: Safety First",
    category: "Pro Tips: Sentences",
    difficulty: "intermediate",
    text: "dont take a lamborghini from didy",
    description: "Type meaningful sentences about personal safety."
  },
  {
    id: "pro-tips-2",
    title: "Tip 2: Looking Away",
    category: "Pro Tips: Sentences",
    difficulty: "intermediate",
    text: "dont go near epstien",
    description: "Type meaningful sentences about keeping your eyes on the screen."
  },
  {
    id: "pro-tips-3",
    title: "Tip 3: Rhythm over Speed",
    category: "Pro Tips: Sentences",
    difficulty: "intermediate",
    text: "bro touched grass once and called it character development",
    description: "Type meaningful sentences about relationship rhythm."
  },
  {
    id: "pro-tips-4",
    title: "Tip 4: Accuracy First",
    category: "Pro Tips: Sentences",
    difficulty: "intermediate",
    text: "if your partner doesn't know your coffee order, they are a federal agent.",
    description: "Type meaningful sentences about partner accuracy."
  },
  {
    id: "pro-tips-5",
    title: "Tip 5: Relax your hands",
    category: "Pro Tips: Sentences",
    difficulty: "intermediate",
    text: "my therapist told me to touch grass, so I typed about it instead.",
    description: "Type meaningful sentences about relaxing your mental health."
  },

  // ADVANCED: SHIFT & CAPS
  {
    id: "advanced-shift-1",
    title: "Left & Right Shift",
    category: "Advanced: Shift & Caps",
    difficulty: "intermediate",
    text: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
    description: "Use your opposing pinky on the Shift key to capitalize letters."
  },
  {
    id: "typing-club-10",
    title: "Shift Capitalization Words",
    category: "Advanced: Shift & Caps",
    difficulty: "intermediate",
    text: "Dad Sad Jkl; Hello World France Germany London Quick Brown Fox Jumped Over Lazy Dog",
    description: "Practice capitalizing words using the correct shift keys."
  },

  // ADVANCED: NUMBERS & SYMBOLS
  {
    id: "typing-club-11",
    title: "Number Row Target Practice",
    category: "Advanced: Numbers & Symbols",
    difficulty: "intermediate",
    text: "1 2 3 4 5 6 7 8 9 0 100 250 1984 2026 555-0199 10% discount check balance $92.50",
    description: "Familiarize yourself with the vertical stretches needed for numerical keys."
  },
  {
    id: "typing-club-12",
    title: "Code Symbols & Operators",
    category: "Advanced: Numbers & Symbols",
    difficulty: "advanced",
    text: "const user = { id: 1, dev: true }; if (x !== y) { return [a, b]; } => console.log('ok');",
    description: "Type curly brackets, parentheses, semicolons, and logic operators. Crucial for developer ergonomics."
  }
];

export const CODING_LESSONS: CodingLesson[] = [
  {
    id: "py-basics",
    language: "python",
    title: "List Comprehension & Formatting",
    difficulty: "beginner",
    code: `squares = [x ** 2 for x in range(10) if x % 2 == 0]
print(f"Aggregated square numbers: {squares}")`,
    explanation: "List comprehensions provide a powerful, mathematically elegant syntax to create new lists in a single readable line in Python.",
    snippet_type: "Defines a clean inline map filter combination block."
  },
  {
    id: "py-oop",
    language: "python",
    title: "Object-Oriented Initialization",
    difficulty: "intermediate",
    code: `class Developer:
    def __init__(self, name, languages):
        self.name = name
        self.languages = languages
        self.wpm = 60

    def code(self):
        return f"{self.name} is keying logic..."`,
    explanation: "Python initialization is managed by the magic double-underscore method '__init__'. Note the explicit usage of 'self' as the first parameter.",
    snippet_type: "A standard clean Python class definition."
  },
  {
    id: "js-promise",
    language: "javascript",
    title: "Asynchronous Fetch Pattern",
    difficulty: "intermediate",
    code: `const fetchUserData = async (userId) => {
  try {
    const raw = await fetch(\`/api/v1/users/\${userId}\`);
    if (!raw.ok) throw new Error("HTTP connection error");
    return await raw.json();
  } catch (err) {
    console.warn("Diagnostic failure:", err.message);
  }
};`,
    explanation: "Combines modern JavaScript asynchronous arrow function, standard fetch API client, and synchronous-looking try-catch error safety cascades.",
    snippet_type: "Reusable JSON fetch utility block."
  },
  {
    id: "ts-generic",
    language: "typescript",
    title: "TypeScript Generics & Guards",
    difficulty: "advanced",
    code: `interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
}

function processResponse<U>(res: ApiResponse<U>): U {
  if (res.status === "error") {
    throw new Error("Generic API parsing exception");
  }
  return res.data;
}`,
    explanation: "Leverages type variables <T> and <U> to capture argument types, giving complete compile-time type-safety over REST schemas.",
    snippet_type: "Generic client logic structure."
  },
  {
    id: "css-layout",
    language: "html-css",
    title: "HTML Tailwind Flex Card",
    difficulty: "beginner",
    code: `<div class="max-w-sm rounded-2xl bg-indigo-950 p-6 shadow-xl border border-indigo-500/30">
  <h3 class="text-lg font-bold text-indigo-200">Interactive Canvas</h3>
  <p class="text-sm text-slate-400 mt-2">Tailwind styles compiled on our live sandboxed preview!</p>
  <button class="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-bold transition">Click Active</button>
</div>`,
    explanation: "Renders a stunning modern card layout natively supporting Tailwind utility classes, complete with embedded interactives.",
    snippet_type: "Visual components definition."
  },
  {
    id: "sql-join",
    language: "sql",
    title: "Aggregate Joins & Filtering",
    difficulty: "intermediate",
    code: `SELECT user_id, COUNT(id) AS completions 
FROM typing_logs 
WHERE accuracy >= 95.0 
GROUP BY user_id 
HAVING COUNT(id) > 10 
ORDER BY completions DESC;`,
    explanation: "Groups practice statistics records, isolates entries with outstanding feedback scores, and ensures only persistent users are sorted.",
    snippet_type: "Analytics query structure."
  }
];

export const SHORTCUT_LESSONS: ShortcutLesson[] = [
  {
    id: "shortcut-delete-word",
    platform: "Windows/Linux",
    title: "Delete Entire Word",
    keys: ["Control", "Backspace"],
    description: "Deletes the entire word to the left of the cursor, saving you from hitting backspace multiple times.",
    context: "Word-level text deletion."
  },
  {
    id: "shortcut-move-word-right",
    platform: "Windows/Linux",
    title: "Jump Word Right",
    keys: ["Control", "ArrowRight"],
    description: "Moves the cursor exactly one word to the right, skipping over characters quickly.",
    context: "Fast cursor navigation."
  },
  {
    id: "shortcut-move-word-left",
    platform: "Windows/Linux",
    title: "Jump Word Left",
    keys: ["Control", "ArrowLeft"],
    description: "Moves the cursor exactly one word to the left.",
    context: "Fast cursor navigation."
  },
  {
    id: "shortcut-select-all",
    platform: "Universal",
    title: "Select All",
    keys: ["Control", "a"],
    description: "Selects all the text in the current document or input field.",
    context: "Bulk text manipulation."
  },
  {
    id: "shortcut-undo",
    platform: "Universal",
    title: "Undo Action",
    keys: ["Control", "z"],
    description: "Undoes the last action or text edit you performed.",
    context: "Error correction."
  },
  {
    id: "shortcut-copicut",
    platform: "VS Code",
    title: "Essential Selection & Movement",
    keys: ["Control", "Shift", "ArrowRight"],
    description: "Quickly select the entire word stretching right from your current flashing cursor.",
    context: "Word-by-word active text highlights."
  },
  {
    id: "shortcut-save",
    platform: "Windows/Linux",
    title: "Force Write & Save Content",
    keys: ["Control", "s"],
    description: "Write current edits directly to the host files. The muscle memory backup drill.",
    context: "Universal document saving."
  },
  {
    id: "shortcut-search",
    platform: "Browser",
    title: "Text In-Page Finder Search",
    keys: ["Control", "f"],
    description: "Draw the browser-native page search interface. Enter keyword and step through occurrences.",
    context: "Find target phrases in page."
  },
  {
    id: "shortcut-terminal",
    platform: "VS Code",
    title: "In-Editor Background Terminal Toggle",
    keys: ["Control", "`"],
    description: "Toggles the integrated node terminal drawer inside VS Code instantly without mouse clicks.",
    context: "Integrated system terminal access."
  }
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: "streak-3",
    title: "Dedicated Typist",
    description: "Maintain a 3-day typing streak online",
    icon: "🔥",
    requirementType: "streak",
    requirementValue: 3
  },
  {
    id: "streak-7",
    title: "Undefeated Rhythm",
    description: "Achieve a 7-day typing streak logs",
    icon: "⚡",
    requirementType: "streak",
    requirementValue: 7
  },
  {
    id: "wpm-45",
    title: "Cadence Climber",
    description: "Reach an active speed test of 45+ WPM",
    icon: "🚀",
    requirementType: "wpm",
    requirementValue: 45
  },
  {
    id: "wpm-70",
    title: "Speed Demon",
    description: "Averaged an exceptional 70+ WPM on any practice material",
    icon: "🏎️",
    requirementType: "wpm",
    requirementValue: 70
  },
  {
    id: "acc-95",
    title: "Pristine Fingertips",
    description: "Complete any customized typing run with 95%+ accuracy",
    icon: "🎯",
    requirementType: "accuracy",
    requirementValue: 95
  },
  {
    id: "acc-99",
    title: "Absolute Precision",
    description: "Finish a typing lesson with a flawless 99%+ accuracy score",
    icon: "💎",
    requirementType: "accuracy",
    requirementValue: 99
  },
  {
    id: "xp-1000",
    title: "Keystroke Collector",
    description: "Acquire a total of 1,000 XP in practice",
    icon: "👑",
    requirementType: "xp",
    requirementValue: 1000
  },
  {
    id: "lessons-5",
    title: "Grit and Habit",
    description: "Complete 5 standard or AI adaptive lessons",
    icon: "📚",
    requirementType: "lessons",
    requirementValue: 5
  }
];
