import { useMemo } from "react";
import { KeyboardLayout, KeyStats } from "../types";

interface KeyboardProps {
  activeKeys: Set<string>;
  layout: KeyboardLayout;
  keyStats?: Record<string, KeyStats>;
  justWrongKey?: string | null;
  themeId?: string;
}

// Layout mappings based on standard QWERTY key matrix positions
// Row mappings which represent [QWERTY label, Dvorak label, Colemak label, width multiplier]
type KeyRowItem = [string, string, string, string?];

const ROW_1: KeyRowItem[] = [
  ["`", "`", "`", "w-10"],
  ["1", "1", "1", "w-10"],
  ["2", "2", "2", "w-10"],
  ["3", "3", "3", "w-10"],
  ["4", "4", "4", "w-10"],
  ["5", "5", "5", "w-10"],
  ["6", "6", "6", "w-10"],
  ["7", "7", "7", "w-10"],
  ["8", "8", "8", "w-10"],
  ["9", "9", "9", "w-10"],
  ["0", "0", "0", "w-10"],
  ["-", "[", "-", "w-10"],
  ["=", "]", "=", "w-10"],
  ["Backspace", "Backspace", "Backspace", "flex-1 min-w-[60px]"],
];

const ROW_2: KeyRowItem[] = [
  ["Tab", "Tab", "Tab", "w-14"],
  ["q", "'", "q", "w-10"],
  ["w", ",", "w", "w-10"],
  ["e", ".", "f", "w-10"],
  ["r", "p", "p", "w-10"],
  ["t", "y", "g", "w-10"],
  ["y", "f", "j", "w-10"],
  ["u", "g", "l", "w-10"],
  ["i", "c", "u", "w-10"],
  ["o", "r", "y", "w-10"],
  ["p", "l", ";", "w-10"],
  ["[", "/", "[", "w-10"],
  ["]", "=", "]", "w-10"],
  ["\\", "\\", "\\", "flex-grow"],
];

const ROW_3: KeyRowItem[] = [
  ["CapsLock", "CapsLock", "CapsLock", "w-[72px]"],
  ["a", "a", "a", "w-10"],
  ["s", "o", "r", "w-10"],
  ["d", "e", "s", "w-10"],
  ["f", "u", "t", "w-10"],
  ["g", "i", "d", "w-10"],
  ["h", "d", "h", "w-10"],
  ["j", "h", "n", "w-10"],
  ["k", "t", "e", "w-10"],
  ["l", "n", "i", "w-10"],
  [";", "s", "o", "w-10"],
  ["'", "-", "'", "w-10"],
  ["Enter", "Enter", "Enter", "flex-grow min-w-[70px]"],
];

const ROW_4: KeyRowItem[] = [
  ["Shift", "Shift", "Shift", "w-[90px]"],
  ["z", ";", "z", "w-10"],
  ["x", "q", "x", "w-10"],
  ["c", "j", "c", "w-10"],
  ["v", "k", "v", "w-10"],
  ["b", "x", "b", "w-10"],
  ["n", "b", "k", "w-10"],
  ["m", "m", "m", "w-10"],
  [",", "w", ",", "w-10"],
  [".", "v", ".", "w-10"],
  ["/", "z", "/", "w-10"],
  ["Shift", "Shift", "Shift", "flex-grow"],
];

export default function Keyboard({ activeKeys, layout, keyStats = {}, justWrongKey, themeId = 'cosmic' }: KeyboardProps) {
  
  // Get active label based on Layout
  const getKeyLabel = (item: KeyRowItem, option: KeyboardLayout): string => {
    if (option === 'dvorak') return item[1];
    if (option === 'colemak') return item[2];
    return item[0];
  };

  // Helper to color keys by health level or active pressed states
  const getKeyStyle = (item: KeyRowItem) => {
    const rawLabel = item[0].toLowerCase();
    const currentLabel = getKeyLabel(item, layout).toLowerCase();
    
    // Check if key is pressed physically
    const isActive = activeKeys.has(rawLabel) || activeKeys.has(currentLabel);
    
    // Check if key was just flagged as an immediate mistyped character
    const isError = justWrongKey && (justWrongKey.toLowerCase() === rawLabel || justWrongKey.toLowerCase() === currentLabel);

    if (isActive) {
      if (themeId === 'terminal') return "bg-emerald-500 border-emerald-400 text-black font-bold scale-95 shadow-inner shadow-emerald-700/50";
      if (themeId === 'sepia') return "bg-amber-700 border-amber-850 text-white scale-95 shadow-inner shadow-amber-900/55";
      if (themeId === 'aurora') return "bg-cyan-500 border-cyan-400 text-[#0b0f14] scale-95 shadow-inner shadow-cyan-700/50";
      if (themeId === 'sakura') return "bg-fuchsia-600 border-fuchsia-500 text-white scale-95 shadow-inner shadow-fuchsia-800/50";
      return "bg-indigo-600 border-indigo-500 text-white scale-95 shadow-inner shadow-indigo-700/50";
    }
    
    if (isError) {
      return "bg-rose-600 border-rose-700 text-white animate-pulse shadow-inner shadow-rose-900/50";
    }

    // Examine recorded character diagnostic metrics
    const stat = keyStats[currentLabel] || keyStats[rawLabel];
    if (stat && stat.attempts > 2) {
      const accuracy = (stat.attempts - stat.errors) / stat.attempts;
      const averageLatencyMs = stat.totalLatencyMs / stat.attempts;

      // Classify thermal metrics
      if (accuracy < 0.85) {
        return "bg-rose-500/15 border-rose-450/40 text-rose-400 hover:bg-rose-500/25"; // High priority weak key
      }
      if (accuracy < 0.94 || averageLatencyMs > 600) {
        return themeId === 'sepia'
          ? "bg-amber-600/10 border-amber-700/30 text-amber-800 hover:bg-amber-600/20"
          : "bg-amber-500/15 border-amber-400 text-amber-300 hover:bg-amber-500/25"; // Medium difficulty lag / slow keys
      }
      // Extremely well practiced keys
      if (accuracy >= 0.97 && stat.attempts > 10) {
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20";
      }
    }

    // Default neutral styling based on theme
    const specialKeys = ["tab", "backspace", "capslock", "enter", "shift", "space"];
    const isSpecial = specialKeys.includes(rawLabel);

    if (themeId === 'terminal') {
      return isSpecial
        ? "bg-[#091509] border-emerald-950/60 text-emerald-600 hover:bg-[#0c220c]"
        : "bg-black border-emerald-950/40 text-emerald-400/80 hover:bg-[#060c06]";
    }
    if (themeId === 'sepia') {
      return isSpecial
        ? "bg-[#ecdcb9]/80 border-[#cfc1a5] text-[#5c4a37] hover:bg-[#dfd2be]"
        : "bg-[#fffdfa] border-[#dfd2be] text-[#2e261f] hover:bg-white";
    }
    if (themeId === 'aurora') {
      return isSpecial
        ? "bg-[#13202e] border-[#1b2b3d] text-cyan-400/75 hover:bg-[#192b3f]"
        : "bg-[#10171f] border-[#1b2b3d]/60 text-cyan-200/80 hover:bg-[#151f2a]";
    }
    if (themeId === 'sakura') {
      return isSpecial
        ? "bg-[#1d1227]/90 border-[#35234a] text-fuchsia-400/75 hover:bg-[#251833]"
        : "bg-[#161021] border-[#311f45]/65 text-fuchsia-200/80 hover:bg-[#1c132b]";
    }

    // Cosmic Theme Default (and fallback)
    return isSpecial
      ? "bg-slate-800 border-slate-700/80 text-slate-400 hover:bg-slate-750"
      : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850";
  };

  const renderKey = (item: KeyRowItem, index: number) => {
    const [qwertyLabel] = item;
    const label = getKeyLabel(item, layout);
    const styleClass = getKeyStyle(item);
    const widthClass = item[3] || "w-10";

    const isSystemKey = ["Tab", "Backspace", "CapsLock", "Enter", "Shift", "Space"].includes(qwertyLabel);

    return (
      <div
        key={`${qwertyLabel}-${index}`}
        id={`kb-key-${qwertyLabel.replace(/[^a-zA-Z0-9]/g, "")}`}
        className={`h-9 border-b-2 font-mono flex items-center justify-center rounded text-xs select-none transition-all duration-75 cursor-pointer font-medium active:scale-95 ${widthClass} ${styleClass}`}
      >
        <span className={isSystemKey ? "text-[10px]" : "text-xs font-semibold uppercase"}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto">
      {/* Keyboard Status Meta */}
      <div className="flex items-center justify-between mb-3 px-1 text-[10px] font-mono text-slate-500">
        <div>ACTIVE LAYOUT: <span className="text-amber-400 font-bold uppercase">{layout}</span></div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-400 inline-block"></span> Weak key (Acc &lt; 85%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-400 inline-block"></span> Slow key (Acc &lt; 94% / Latency &gt; 600ms)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 inline-block"></span> Mastered key (&ge; 97%)
          </span>
        </div>
      </div>

      {/* Rows stack */}
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1 justify-center w-full">{ROW_1.map((k, i) => renderKey(k, i))}</div>
        <div className="flex gap-1 justify-center w-full">{ROW_2.map((k, i) => renderKey(k, i))}</div>
        <div className="flex gap-1 justify-center w-full">{ROW_3.map((k, i) => renderKey(k, i))}</div>
        <div className="flex gap-1 justify-center w-full">{ROW_4.map((k, i) => renderKey(k, i))}</div>
        
        {/* Space Row */}
        <div className="flex gap-1 justify-center w-full mt-0.5">
          <div
            id="kb-key-space"
            className={`h-9 border-b-2 flex items-center justify-center rounded select-none cursor-pointer transition-all duration-75 w-1/2 ${
              activeKeys.has("space") || activeKeys.has(" ")
                ? "bg-amber-500 border-amber-600 scale-95 shadow-inner"
                : "bg-slate-900 border-slate-800 hover:bg-slate-850"
            }`}
          >
            <span className="text-[10px] text-slate-500 font-mono">SPACE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
