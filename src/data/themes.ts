export type ThemeId = 'cosmic' | 'terminal' | 'sepia' | 'aurora' | 'sakura' | 'blueblack';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bg: string;
  cardBg: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  accentHover: string;
  accentSolid: string;
  correctText: string;
  correctBg: string;
  errorText: string;
  errorBg: string;
  border: string;
  subBorder: string;
  keyboardBg: string;
  keyBg: string;
  keyActive: string;
  isLight: boolean;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'cosmic',
    name: 'Cosmic Midnight',
    bg: 'bg-[#07090e]',
    cardBg: 'bg-[#0b0f19]/90',
    text: 'text-[#E2E8F0]',
    textMuted: 'text-[#94A3B8]',
    accent: 'indigo',
    accentText: 'text-indigo-400',
    accentBg: 'bg-indigo-600/15',
    accentBorder: 'border-indigo-500/25',
    accentHover: 'hover:bg-indigo-600/25',
    accentSolid: 'bg-indigo-600 hover:bg-indigo-500',
    correctText: 'text-emerald-400',
    correctBg: 'bg-emerald-550/10',
    errorText: 'text-rose-450 border-b border-rose-500/30',
    errorBg: 'bg-rose-500/15',
    border: 'border-slate-800/80',
    subBorder: 'border-slate-900',
    keyboardBg: 'bg-[#0a0c10]',
    keyBg: 'bg-slate-900/80 text-slate-300 border-slate-950',
    keyActive: 'bg-indigo-600/30 text-indigo-300 border-indigo-500',
    isLight: false
  },
  {
    id: 'terminal',
    name: 'Matrix Console',
    bg: 'bg-black',
    cardBg: 'bg-[#050505] border border-emerald-900/50',
    text: 'text-emerald-400 font-mono',
    textMuted: 'text-emerald-800 font-mono',
    accent: 'emerald',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-950/30',
    accentBorder: 'border-emerald-855/35',
    accentHover: 'hover:bg-emerald-900/25',
    accentSolid: 'bg-emerald-600 hover:bg-emerald-555 text-black font-black',
    correctText: 'text-white bg-emerald-900/40 border-b border-emerald-400 font-bold',
    correctBg: 'bg-emerald-950/35',
    errorText: 'text-amber-500 font-bold underline decoration-amber-500 decoration-2',
    errorBg: 'bg-amber-500/20',
    border: 'border-emerald-950/80',
    subBorder: 'border-emerald-950/40',
    keyboardBg: 'bg-black border border-emerald-950',
    keyBg: 'bg-[#030303] text-emerald-550 border-emerald-955',
    keyActive: 'bg-emerald-600/35 text-white border-emerald-400',
    isLight: false
  },
  {
    id: 'sepia',
    name: 'Warm Sepia',
    bg: 'bg-[#FAF6EE]',
    cardBg: 'bg-[#F2EAD9] border border-[#DECFB5]',
    text: 'text-[#2e261f]',
    textMuted: 'text-[#82725e]',
    accent: 'amber',
    accentText: 'text-amber-800',
    accentBg: 'bg-amber-600/10',
    accentBorder: 'border-amber-700/20',
    accentHover: 'hover:bg-amber-600/15',
    accentSolid: 'bg-amber-700 hover:bg-amber-600 text-white',
    correctText: 'text-emerald-700 font-bold',
    correctBg: 'bg-emerald-800/10',
    errorText: 'text-rose-700 font-bold underline decoration-rose-600',
    errorBg: 'bg-rose-500/10',
    border: 'border-[#DECFB5]',
    subBorder: 'border-[#eae0cc]',
    keyboardBg: 'bg-[#eae0cc] border border-[#d5c3a3]',
    keyBg: 'bg-[#fcfbf9] text-[#2e261f] border-[#cfc1a5]',
    keyActive: 'bg-amber-700/20 text-amber-800 border-amber-600',
    isLight: true
  },
  {
    id: 'aurora',
    name: 'Arctic Aurora',
    bg: 'bg-[#0b0f14]',
    cardBg: 'bg-[#10171f]/95 border border-[#1b2b3d]',
    text: 'text-cyan-100',
    textMuted: 'text-cyan-800',
    accent: 'cyan',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-950/20',
    accentBorder: 'border-cyan-800/25',
    accentHover: 'hover:bg-cyan-900/30',
    accentSolid: 'bg-cyan-600 hover:bg-cyan-500',
    correctText: 'text-teal-355 font-bold',
    correctBg: 'bg-teal-950/50',
    errorText: 'text-orange-400 font-bold border-b border-orange-500/40',
    errorBg: 'bg-orange-500/15',
    border: 'border-[#1b2b3d]/90',
    subBorder: 'border-[#101f2e]',
    keyboardBg: 'bg-[#0f1720]',
    keyBg: 'bg-[#121c27] text-cyan-200/90 border-cyan-950',
    keyActive: 'bg-cyan-950/45 text-cyan-300 border-cyan-500',
    isLight: false
  },
  {
    id: 'sakura',
    name: 'Sunset Sakura',
    bg: 'bg-[#130d1a]',
    cardBg: 'bg-[#1c1326]/95 border border-[#35234a]',
    text: 'text-fuchsia-100',
    textMuted: 'text-fuchsia-800',
    accent: 'fuchsia',
    accentText: 'text-fuchsia-400',
    accentBg: 'bg-fuchsia-950/25',
    accentBorder: 'border-fuchsia-800/30',
    accentHover: 'hover:bg-fuchsia-900/30',
    accentSolid: 'bg-fuchsia-600 hover:bg-fuchsia-500',
    correctText: 'text-rose-400 font-black',
    correctBg: 'bg-rose-950/40',
    errorText: 'text-amber-400 font-bold border-b border-amber-500/40',
    errorBg: 'bg-amber-500/15',
    border: 'border-[#35234a]',
    subBorder: 'border-[#241733]',
    keyboardBg: 'bg-[#191122]',
    keyBg: 'bg-[#20152c] text-fuchsia-200/90 border-[#120a1c]',
    keyActive: 'bg-fuchsia-950/45 text-fuchsia-300 border-fuchsia-500',
    isLight: false
  },
  {
    id: 'blueblack',
    name: 'Neon Blue & Black',
    bg: 'bg-black',
    cardBg: 'bg-[#050505]/90 border border-blue-950/60',
    text: 'text-blue-100',
    textMuted: 'text-blue-400/50',
    accent: 'blue',
    accentText: 'text-blue-400 font-semibold',
    accentBg: 'bg-blue-950/40',
    accentBorder: 'border-blue-900/30',
    accentHover: 'hover:bg-blue-900/20',
    accentSolid: 'bg-blue-600 hover:bg-blue-500',
    correctText: 'text-emerald-400 font-bold',
    correctBg: 'bg-emerald-950/20',
    errorText: 'text-rose-450 border-b border-rose-500/30 font-semibold',
    errorBg: 'bg-rose-500/15',
    border: 'border-slate-900/80',
    subBorder: 'border-slate-950',
    keyboardBg: 'bg-[#02050f] border border-blue-950/30',
    keyBg: 'bg-[#050b18] text-blue-200 border-blue-950/70',
    keyActive: 'bg-blue-500/35 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    isLight: false
  }
];
