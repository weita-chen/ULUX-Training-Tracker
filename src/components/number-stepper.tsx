import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function NumberStepper({
  value,
  onChange,
  step = 1,
  min,
  max,
  decimals = 0,
  suffix,
  ariaLabel,
}: {
  value: number | null;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  decimals?: number;
  suffix?: string;
  ariaLabel?: string;
}) {
  const display =
    value === null || value === undefined
      ? ""
      : decimals > 0
        ? String(Math.round(value * 10 ** decimals) / 10 ** decimals)
        : String(value);

  function clamp(n: number) {
    if (min !== undefined) n = Math.max(min, n);
    if (max !== undefined) n = Math.min(max, n);
    return n;
  }

  return (
    <div className="grid grid-cols-[3.25rem_1fr_3.25rem] items-stretch overflow-hidden rounded-xl border border-line bg-surface">
      <button
        type="button"
        aria-label="減少"
        className="grid place-items-center text-ink hover:bg-mist active:bg-mist"
        onClick={() => onChange(clamp((value ?? 0) - step))}
      >
        <Minus className="size-5" strokeWidth={1.75} />
      </button>
      <div className="relative border-x border-line">
        <input
          aria-label={ariaLabel}
          inputMode="decimal"
          value={display}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d.]/g, "");
            if (raw === "") {
              onChange(0);
              return;
            }
            const n = Number(raw);
            if (Number.isFinite(n)) onChange(clamp(n));
          }}
          className={cn(
            "h-14 w-full bg-transparent text-center font-display text-2xl tabular-nums text-ink",
            "focus:outline-none",
            suffix ? "pr-8" : "",
          )}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone">
            {suffix}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="增加"
        className="grid place-items-center text-ink hover:bg-mist active:bg-mist"
        onClick={() => onChange(clamp((value ?? 0) + step))}
      >
        <Plus className="size-5" strokeWidth={1.75} />
      </button>
    </div>
  );
}
