import { TRAINING_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TrainingTypePicker({
  disabled,
  onPick,
}: {
  disabled?: boolean;
  onPick: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TRAINING_TYPES.map((t) => (
        <button
          key={t.id}
          type="button"
          disabled={disabled}
          onClick={() => onPick(t.id)}
          className={cn(
            "min-h-24 rounded-2xl border border-line bg-surface px-4 py-5 text-left",
            "transition-colors hover:border-ink/20 hover:bg-mist/40 disabled:opacity-50",
          )}
        >
          <div className="font-medium">{t.zh}</div>
          <div className="mt-1 text-xs text-stone">{t.en}</div>
        </button>
      ))}
    </div>
  );
}
