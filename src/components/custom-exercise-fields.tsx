import { TRAINING_TYPES, MEASUREMENT_OPTIONS, defaultMeasurement } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type CustomExercisePayload = {
  nameZh: string;
  nameEn?: string;
  notes?: string;
  trainingType: string;
  measurement: string;
};

export function CustomExerciseFields({
  nameZh,
  nameEn,
  notes,
  trainingType,
  measurement,
  onNameZh,
  onNameEn,
  onNotes,
  onTrainingType,
  onMeasurement,
  showType = true,
  showNotes = true,
}: {
  nameZh: string;
  nameEn: string;
  notes?: string;
  trainingType: string;
  measurement: string;
  onNameZh: (v: string) => void;
  onNameEn: (v: string) => void;
  onNotes?: (v: string) => void;
  onTrainingType: (v: string) => void;
  onMeasurement: (v: string) => void;
  showType?: boolean;
  showNotes?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>名稱</Label>
        <Input
          value={nameZh}
          onChange={(e) => onNameZh(e.target.value)}
          placeholder="例如：網球私教"
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label>英文（選填）</Label>
        <Input value={nameEn} onChange={(e) => onNameEn(e.target.value)} />
      </div>
      {showType ? (
        <div className="space-y-2">
          <Label>類型</Label>
          <div className="grid grid-cols-2 gap-2">
            {TRAINING_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onTrainingType(t.id);
                  onMeasurement(defaultMeasurement(t.id));
                }}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left text-sm",
                  trainingType === t.id
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-surface",
                )}
              >
                {t.zh}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="space-y-2">
        <Label>怎麼記</Label>
        <div className="grid grid-cols-2 gap-2">
          {MEASUREMENT_OPTIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onMeasurement(m.id)}
              className={cn(
                "rounded-xl border px-3 py-2 text-left",
                measurement === m.id
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-surface",
              )}
            >
              <div className="text-sm">{m.zh}</div>
              <div
                className={cn(
                  "mt-0.5 text-[11px]",
                  measurement === m.id ? "text-paper/70" : "text-stone",
                )}
              >
                {m.hint}
              </div>
            </button>
          ))}
        </div>
      </div>
      {showNotes && onNotes ? (
        <div className="space-y-2">
          <Label>備註（選填）</Label>
          <Input value={notes ?? ""} onChange={(e) => onNotes(e.target.value)} />
        </div>
      ) : null}
    </div>
  );
}

export function CustomExerciseSubmit({
  disabled,
  busy,
  onClick,
  label = "加入這場訓練",
}: {
  disabled: boolean;
  busy?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <Button className="mt-6 w-full" onClick={onClick} disabled={disabled || busy}>
      {busy ? "儲存中…" : label}
    </Button>
  );
}
