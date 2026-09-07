import { useRef } from "react";
import { cn } from "@/lib/utils";

export function PinInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const digits = (value + "    ").slice(0, 4).split("");

  function setAt(i: number, char: string) {
    const next = value.split("");
    next[i] = char;
    const joined = next.join("").replace(/\D/g, "").slice(0, 4);
    onChange(joined);
    if (char && i < 3) refs[i + 1].current?.focus();
  }

  return (
    <div className="flex justify-center gap-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          disabled={disabled}
          maxLength={1}
          value={d.trim()}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(-1);
            setAt(i, v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i].trim() && i > 0) {
              refs[i - 1].current?.focus();
            }
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
            if (text) {
              e.preventDefault();
              onChange(text);
              refs[Math.min(text.length, 3)].current?.focus();
            }
          }}
          className={cn(
            "h-14 w-12 rounded-xl border border-line bg-surface text-center font-display text-2xl text-ink tabular-nums",
            "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
          )}
        />
      ))}
    </div>
  );
}
