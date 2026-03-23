import { useState, useRef, useCallback } from "react";

export type VoiceStatus = "idle" | "listening" | "processing" | "done" | "error" | "unsupported";

interface UseVoiceInputOptions {
  lang?: string;           // BCP-47 language tag, e.g. "zh-CN", "zh-HK"
  onResult: (text: string) => void;
  onError?: (msg: string) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function useVoiceInput({ lang = "zh-CN", onResult, onError }: UseVoiceInputOptions) {
  const SpeechRecognition = getSpeechRecognition();
  const supported = !!SpeechRecognition;

  const [status, setStatus] = useState<VoiceStatus>(supported ? "idle" : "unsupported");
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const start = useCallback(() => {
    if (!SpeechRecognition || status === "listening") return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus("listening");
      setInterimText("");
    };

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (interim) setInterimText(interim);
      if (final) {
        setInterimText("");
        setStatus("processing");
        onResult(final.trim());
        setTimeout(() => setStatus("idle"), 600);
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setInterimText("");
      if (e.error === "no-speech") {
        setStatus("idle");
      } else if (e.error === "not-allowed" || e.error === "permission-denied") {
        setStatus("error");
        onError?.("请在浏览器设置中允许使用麦克风");
      } else {
        setStatus("error");
        onError?.(e.error);
        setTimeout(() => setStatus("idle"), 2000);
      }
    };

    recognition.onend = () => {
      setInterimText("");
      setStatus((s) => (s === "listening" ? "idle" : s));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [SpeechRecognition, lang, onResult, onError, status]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setStatus("idle");
    setInterimText("");
  }, []);

  const toggle = useCallback(() => {
    if (status === "listening") stop();
    else start();
  }, [status, start, stop]);

  return { status, interimText, supported, start, stop, toggle };
}

/** Map app dialect to BCP-47 language tag for SpeechRecognition */
export const DIALECT_LANG: Record<string, string> = {
  mandarin:     "zh-CN",
  shanghainese: "zh-CN",   // no dedicated WuYue code in browsers
  cantonese:    "zh-HK",   // Cantonese Hong Kong
  sichuan:      "zh-CN",
  northeast:    "zh-CN",
};
