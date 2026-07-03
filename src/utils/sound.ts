// Audio synthesis and file playback utility using Web Audio API for typing sounds
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume context if suspended (browser security autoplays)
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

const audioBuffers = new Map<string, AudioBuffer>();

export async function preloadAudioClip(url: string) {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (audioBuffers.has(url)) return audioBuffers.get(url);
  
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    audioBuffers.set(url, audioBuffer);
    return audioBuffer;
  } catch (error) {
    console.error("Failed to load audio clip:", url, error);
  }
}

export function playAudioClip(url: string, volume: number = 1.0) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const buffer = audioBuffers.get(url);
    if (!buffer) {
      // Load it asynchronously for next time, fallback to click for now
      preloadAudioClip(url);
      playKeyClickSound();
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    source.start();
  } catch (error) {
    console.debug("Audio play blocked", error);
  }
}

export function playKeyClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // A crisp mechanical click
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.setValueAtTime(800, ctx.currentTime + 0.005);
    osc.frequency.setValueAtTime(1000, ctx.currentTime + 0.01);

    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (error) {
    console.debug("Audio play blocked", error);
  }
}

export function playKeyThudSound() { 
  try { 
    const ctx = getAudioContext(); 
    if (!ctx) return; 
    const osc = ctx.createOscillator(); 
    const gainNode = ctx.createGain(); 
    osc.connect(gainNode); 
    gainNode.connect(ctx.destination); 
    osc.type = "triangle"; 
    osc.frequency.setValueAtTime(150, ctx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.12); 
    gainNode.gain.setValueAtTime(0.12, ctx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15); 
    osc.start(); 
    osc.stop(ctx.currentTime + 0.16); 
  } catch (e) {} 
}

export function playKeyMoanSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // A synthesized comic "moan" sweep
    osc.type = "sine";
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(350, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (error) {
    console.debug("Audio play blocked", error);
  }
}

export const AUDIO_PACKS: Record<string, string> = {
  typewriter: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2c5d1cb374.mp3?filename=typewriter-key-1-44719.mp3',
  retro: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=bubble-sound-43207.mp3',
  bubble: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_34b4ce63b7.mp3?filename=water-drop-44709.mp3',
};

export function playTypingSound(type: string = 'click') {
  if (type === 'thud') {
    playKeyThudSound();
  } else if (type === 'moan') {
    playKeyMoanSound();
  } else if (type === 'click') {
    playKeyClickSound();
  } else if (AUDIO_PACKS[type]) {
    playAudioClip(AUDIO_PACKS[type]);
  } else {
    // Default fallback
    playKeyClickSound();
  }
}

export function preloadAllPacks() {
  Object.values(AUDIO_PACKS).forEach(url => preloadAudioClip(url));
}
