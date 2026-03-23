import { Mic, MicOff, Loader } from "lucide-react";
import { VoiceStatus } from "../hooks/useVoiceInput";

interface VoiceButtonProps {
  status: VoiceStatus;
  interimText: string;
  supported: boolean;
  onToggle: () => void;
  /** visual variant to match each mode */
  variant?: "standard" | "children" | "elderly";
  /** Show a floating "I'm listening" tooltip above the button */
  showTooltip?: boolean;
}

const PULSE_RING =
  "absolute inset-0 rounded-full animate-ping opacity-60";

export function VoiceButton({
  status,
  interimText,
  supported,
  onToggle,
  variant = "standard",
  showTooltip = true,
}: VoiceButtonProps) {
  if (!supported) return null;

  const isListening   = status === "listening";
  const isProcessing  = status === "processing";
  const isError       = status === "error";

  /* ── variant styles ── */
  const sizes = {
    standard: { btn: "w-9 h-9",  icon: 17, ring: "w-9 h-9" },
    children: { btn: "w-11 h-11", icon: 22, ring: "w-11 h-11" },
    elderly:  { btn: "w-14 h-14", icon: 28, ring: "w-14 h-14" },
  }[variant];

  const colors = {
    standard: {
      idle:       "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-500",
      listening:  "bg-red-500 text-white shadow-lg shadow-red-200",
      processing: "bg-green-500 text-white",
      error:      "bg-red-100 text-red-500",
    },
    children: {
      idle:       "bg-purple-100 text-purple-400 hover:bg-purple-200",
      listening:  "bg-red-400 text-white shadow-lg shadow-red-200",
      processing: "bg-green-400 text-white",
      error:      "bg-red-100 text-red-500",
    },
    elderly: {
      idle:       "bg-green-100 text-green-600 hover:bg-green-200",
      listening:  "bg-red-500 text-white shadow-xl shadow-red-300",
      processing: "bg-green-600 text-white",
      error:      "bg-red-100 text-red-600",
    },
  }[variant];

  const activeColor =
    isListening   ? colors.listening  :
    isProcessing  ? colors.processing :
    isError       ? colors.error      :
    colors.idle;

  const tooltipTexts = {
    standard: { listening: "正在聆听...", interim: interimText, error: "出错了" },
    children:  { listening: "说话吧！我在听 🎤", interim: interimText, error: "哎呀，出错了" },
    elderly:   { listening: "正在聆听，请说话", interim: interimText, error: "语音识别出错" },
  }[variant];

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse ring when listening */}
      {isListening && (
        <span
          className={`${PULSE_RING} ${sizes.ring}`}
          style={{
            backgroundColor:
              variant === "children" ? "#f87171" : "#ef4444",
          }}
        />
      )}

      <button
        type="button"
        onClick={onToggle}
        title={isListening ? "点击停止" : "点击语音输入"}
        className={`relative ${sizes.btn} rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 select-none ${activeColor}`}
        style={{ flexShrink: 0 }}
      >
        {isProcessing ? (
          <Loader size={sizes.icon} className="animate-spin" />
        ) : isListening ? (
          <MicOff size={sizes.icon} />
        ) : (
          <Mic size={sizes.icon} />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (isListening || isProcessing) && (
        <div
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl shadow-lg pointer-events-none z-50"
          style={{
            backgroundColor:
              variant === "children" ? "#7c3aed" :
              variant === "elderly"  ? "#15803d" : "#1f2937",
            color: "white",
            fontSize:
              variant === "elderly" ? "1rem" : "0.75rem",
          }}
        >
          {isListening
            ? interimText
              ? `"${interimText}"`
              : tooltipTexts.listening
            : isProcessing
            ? "识别中..."
            : ""}
          {/* caret */}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
            style={{
              borderTopColor:
                variant === "children" ? "#7c3aed" :
                variant === "elderly"  ? "#15803d" : "#1f2937",
            }}
          />
        </div>
      )}
    </div>
  );
}
