import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronLeft, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getProfile } from "@/lib/api/profile";
import { listCatalog, createCustomExercise } from "@/lib/api/catalog";
import {
  addEntry,
  addSet,
  deleteEntry,
  deleteSession,
  deleteSet,
  getSession,
  lastSetsForExercise,
  recentExercises,
  updateSession,
  updateSet,
} from "@/lib/api/workouts";
import { trainingTypeLabel, defaultMeasurement } from "@/lib/constants";
import { formatDuration, formatKg } from "@/lib/format";
import { BrandSplash } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { ExerciseName } from "@/components/exercise-name";
import { NumberStepper } from "@/components/number-stepper";
import { Textarea } from "@/components/ui/textarea";
import { CustomExerciseFields, CustomExerciseSubmit } from "@/components/custom-exercise-fields";
import { queryClient } from "@/lib/query";
import { cn } from "@/lib/utils";
import type { Exercise, WorkoutEntry, WorkoutSet } from "@/lib/types";

export const Route = createFileRoute("/workout/$sessionId")({
  component: WorkoutPage,
});

function WorkoutPage() {
  const { sessionId } = Route.useParams();
  const id = Number(sessionId);
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    enabled: !!user,
  });
  const session = useQuery({
    queryKey: ["session", id],
    queryFn: () => getSession({ data: { id } }),
    enabled: !!user && Number.isFinite(id),
  });

  if (isPending) return <BrandSplash />;
  if (!user) return <RedirectToSignIn />;
  if (profile.isLoading || session.isLoading) return <BrandSplash />;
  if (!profile.data) {
    window.location.assign("/onboarding");
    return null;
  }
  if (!session.data) {
    return (
      <main className="grid min-h-dvh place-items-center px-6">
        <p>找不到這筆訓練。</p>
        <Link to="/" className="mt-4 text-sm text-stone">
          回首頁
        </Link>
      </main>
    );
  }
  return <WorkoutEditor sessionId={id} />;
}

function WorkoutEditor({ sessionId }: { sessionId: number }) {
  const navigate = useNavigate();
  const sessionQ = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => getSession({ data: { id: sessionId } }),
  });
  const catalog = useQuery({ queryKey: ["catalog"], queryFn: () => listCatalog() });
  const recent = useQuery({
    queryKey: ["recent-exercises"],
    queryFn: () => recentExercises({ data: {} }),
  });
  const [picker, setPicker] = useState(false);
  const [editing, setEditing] = useState<{
    entry: WorkoutEntry;
    set: WorkoutSet | null;
  } | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const session = sessionQ.data;

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
    await queryClient.invalidateQueries({ queryKey: ["open-session"] });
    await queryClient.invalidateQueries({ queryKey: ["stats"] });
  }

  async function complete() {
    await updateSession({
      data: { id: sessionId, complete: true, notes: notes ?? session?.notes },
    });
    await refresh();
    toast("訓練已儲存");
    navigate({ to: "/" });
  }

  async function remove() {
    await deleteSession({ data: { id: sessionId } });
    await queryClient.invalidateQueries();
    navigate({ to: "/" });
  }

  if (!session) return <BrandSplash />;
  const noteValue = notes ?? session.notes ?? "";

  return (
    <div className="min-h-dvh bg-paper pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-paper/95 px-3 py-2 backdrop-blur-sm">
        <Link to="/" className="grid size-11 place-items-center">
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">
            {trainingTypeLabel(session.trainingType)}
          </div>
          <div className="text-[11px] text-stone">
            {session.endedAt ? "歷史紀錄" : "進行中"} · 重量單位 kg
          </div>
        </div>
        <button
          type="button"
          className="grid size-11 place-items-center text-stone"
          onClick={() => setConfirmDel(true)}
          aria-label="刪除訓練"
        >
          <Trash2 className="size-4" />
        </button>
        <Button size="sm" onClick={complete}>
          <Check className="size-4" />
          完成
        </Button>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-5">
        {session.entries.length === 0 ? (
          <p className="py-10 text-center text-sm text-stone">
            從下方加入第一個動作。
          </p>
        ) : null}

        <div className="space-y-8">
          {session.entries.map((entry) => (
            <section key={entry.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <ExerciseName zh={entry.exercise.nameZh} en={entry.exercise.nameEn} />
                  <div className="mt-0.5 text-xs text-stone">
                    {entry.equipment?.nameZh}
                    {entry.equipment?.slug === "dumbbell" ? " · 重量為總重量" : ""}
                    {entry.exercise.measurement === "bodyweight" ? " · 可加外部負重" : ""}
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs text-stone"
                  onClick={async () => {
                    await deleteEntry({ data: { id: entry.id } });
                    await refresh();
                  }}
                >
                  移除
                </button>
              </div>
              <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
                {entry.sets.map((set) => (
                  <li key={set.id}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-3 text-left"
                      onClick={() => setEditing({ entry, set })}
                    >
                      <span className="w-6 text-xs tabular-nums text-stone">{set.setNumber}</span>
                      <span className="flex-1 font-display text-lg tabular-nums">
                        {formatSet(set, entry.exercise.measurement)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-2 flex h-11 w-full items-center justify-center gap-1 rounded-xl text-sm text-accent"
                onClick={() => setEditing({ entry, set: null })}
              >
                <Plus className="size-4" /> 新增一組
              </button>
            </section>
          ))}
        </div>

        <Button
          variant="secondary"
          className="mt-8 w-full"
          size="lg"
          onClick={() => setPicker(true)}
        >
          <Plus className="size-4" />
          新增動作
        </Button>

        <div className="mt-8">
          <div className="text-xs tracking-[0.18em] text-stone">備註</div>
          <Textarea
            className="mt-2"
            placeholder="例如：今天特別有力。"
            value={noteValue}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() =>
              updateSession({ data: { id: sessionId, notes: noteValue } })
            }
          />
        </div>
      </div>

      {picker && catalog.data ? (
        <ExercisePicker
          trainingType={session.trainingType}
          exercises={catalog.data.exercises}
          muscles={catalog.data.muscles}
          recent={recent.data ?? []}
          onClose={() => setPicker(false)}
          onPick={async (exercise, equipmentId) => {
            const { id: entryId } = await addEntry({
              data: {
                sessionId,
                exerciseId: exercise.id,
                equipmentId,
              },
            });
            const last = await lastSetsForExercise({ data: { exerciseId: exercise.id } });
            if (last.sets.length > 0) {
              const first = last.sets[0];
              await addSet({
                data: {
                  entryId,
                  weight: first.weight,
                  additionalWeight: first.additionalWeight,
                  isBodyweight: first.isBodyweight,
                  reps: first.reps,
                  durationSeconds: first.durationSeconds,
                  distanceM: first.distanceM,
                },
              });
            }
            setPicker(false);
            await refresh();
          }}
        />
      ) : null}

      {editing ? (
        <SetEditor
          entry={editing.entry}
          initial={editing.set}
          onClose={() => setEditing(null)}
          onSave={async (payload) => {
            if (editing.set) {
              await updateSet({ data: { id: editing.set.id, ...payload } });
            } else {
              await addSet({ data: { entryId: editing.entry.id, ...payload } });
            }
            setEditing(null);
            await refresh();
          }}
          onDelete={
            editing.set
              ? async () => {
                  await deleteSet({ data: { id: editing.set!.id } });
                  setEditing(null);
                  await refresh();
                }
              : undefined
          }
        />
      ) : null}

      <ConfirmDialog
        open={confirmDel}
        onOpenChange={setConfirmDel}
        title="刪除整場訓練？"
        description="此場次與所有組數都會刪除，且無法復原。"
        confirmLabel="刪除"
        danger
        onConfirm={remove}
      />
    </div>
  );
}

function formatSet(set: WorkoutSet, measurement: string) {
  if (measurement === "duration") return formatDuration(set.durationSeconds);
  if (measurement === "distance_duration") {
    const km = set.distanceM != null ? `${Math.round((set.distanceM / 1000) * 100) / 100} km` : "";
    const dur = formatDuration(set.durationSeconds);
    return [km, dur].filter(Boolean).join(" · ");
  }
  if (measurement === "bodyweight") {
    const extra = set.additionalWeight ? `+${formatKg(set.additionalWeight)} kg` : "";
    return `徒手${extra} × ${set.reps ?? 0}`;
  }
  return `${formatKg(set.weight)} kg × ${set.reps ?? 0}`;
}

function ExercisePicker({
  trainingType,
  exercises,
  muscles,
  recent,
  onClose,
  onPick,
}: {
  trainingType: string;
  exercises: Exercise[];
  muscles: { id: number; slug: string; nameZh: string }[];
  recent: Exercise[];
  onClose: () => void;
  onPick: (ex: Exercise, equipmentId?: number | null) => void;
}) {
  const isWeight = trainingType === "weight";
  const [step, setStep] = useState<"cat" | "ex" | "eq" | "create">(
    isWeight ? "cat" : "ex",
  );
  const [muscle, setMuscle] = useState<number | "custom" | "recent" | null>(null);
  const [picked, setPicked] = useState<Exercise | null>(null);
  const [q, setQ] = useState("");
  const [nameZh, setNameZh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [measurement, setMeasurement] = useState<string>(defaultMeasurement(trainingType));
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    let list = exercises.filter((e) => e.trainingType === trainingType);
    if (muscle === "custom") list = list.filter((e) => !e.isSystem);
    else if (muscle === "recent") {
      const ids = new Set(recent.filter((e) => e.trainingType === trainingType).map((e) => e.id));
      list = list.filter((e) => ids.has(e.id));
    } else if (typeof muscle === "number") {
      list = list.filter((e) => e.muscles.some((m) => m.id === muscle));
    }
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = exercises.filter(
        (e) =>
          e.trainingType === trainingType &&
          (e.nameZh.toLowerCase().includes(s) || e.nameEn.toLowerCase().includes(s)),
      );
    }
    return list;
  }, [exercises, muscle, q, recent, trainingType]);

  const showCats = isWeight && !q.trim() && step === "cat";

  async function saveCustom() {
    if (!nameZh.trim()) return;
    setBusy(true);
    try {
      const created = await createCustomExercise({
        data: {
          nameZh,
          nameEn,
          trainingType,
          measurement,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
      await queryClient.invalidateQueries({ queryKey: ["custom-exercises"] });
      onPick(created, created.equipment[0]?.id ?? null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "無法新增動作");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper">
      <header className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          className="grid size-11 place-items-center"
          onClick={() => {
            if (step === "create") {
              setStep(isWeight && !q.trim() ? "cat" : "ex");
              return;
            }
            if (step === "eq") {
              setStep("ex");
              setPicked(null);
              return;
            }
            if (step === "ex" && isWeight && !q.trim()) {
              setStep("cat");
              return;
            }
            onClose();
          }}
        >
          <X className="size-5" />
        </button>
        <div className="flex-1 font-medium">
          {step === "create" ? "新增自訂動作" : "選擇動作"}
        </div>
      </header>
      {step !== "create" ? (
        <div className="px-4">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              if (e.target.value.trim()) setStep("ex");
            }}
            placeholder="搜尋動作"
            className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-base"
          />
        </div>
      ) : null}
      <div className="mt-3 flex-1 overflow-y-auto px-4 pb-10">
        {step === "create" ? (
          <div>
            <CustomExerciseFields
              nameZh={nameZh}
              nameEn={nameEn}
              trainingType={trainingType}
              measurement={measurement}
              onNameZh={setNameZh}
              onNameEn={setNameEn}
              onTrainingType={() => undefined}
              onMeasurement={setMeasurement}
              showType={false}
              showNotes={false}
            />
            <CustomExerciseSubmit
              disabled={!nameZh.trim()}
              busy={busy}
              onClick={saveCustom}
              label="加入這場訓練"
            />
          </div>
        ) : showCats ? (
          <div className="grid grid-cols-2 gap-2">
            {recent.some((e) => e.trainingType === trainingType) ? (
              <button
                type="button"
                className="rounded-2xl border border-line bg-surface px-4 py-4 text-left"
                onClick={() => {
                  setMuscle("recent");
                  setStep("ex");
                }}
              >
                最近
              </button>
            ) : null}
            {muscles.map((m) => (
              <button
                key={m.id}
                type="button"
                className="rounded-2xl border border-line bg-surface px-4 py-4 text-left"
                onClick={() => {
                  setMuscle(m.id);
                  setStep("ex");
                }}
              >
                {m.nameZh}
              </button>
            ))}
            <button
              type="button"
              className="rounded-2xl border border-line bg-surface px-4 py-4 text-left"
              onClick={() => {
                setMuscle("custom");
                setStep("ex");
              }}
            >
              自訂動作
            </button>
            <button
              type="button"
              className="rounded-2xl border border-dashed border-ink/30 bg-accent-soft px-4 py-4 text-left"
              onClick={() => {
                setNameZh("");
                setNameEn("");
                setMeasurement(defaultMeasurement(trainingType));
                setStep("create");
              }}
            >
              ＋ 現場新增
            </button>
          </div>
        ) : step === "eq" && picked ? (
          <div className="space-y-2">
            <p className="mb-3 text-sm text-ink-soft">
              {picked.nameZh} — 選擇器材
            </p>
            {picked.equipment.map((eq) => (
              <button
                key={eq.id}
                type="button"
                className="flex h-14 w-full items-center rounded-2xl border border-line bg-surface px-4"
                onClick={() => onPick(picked, eq.id)}
              >
                {eq.nameZh}
                <span className="ml-2 text-xs text-stone">{eq.nameEn}</span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            {isWeight && !q.trim() ? (
              <button
                type="button"
                className="mb-3 text-sm text-stone"
                onClick={() => setStep("cat")}
              >
                ← 部位
              </button>
            ) : null}
            {recent.filter((e) => e.trainingType === trainingType).length > 0 &&
            !isWeight &&
            !q.trim() &&
            muscle !== "recent" ? (
              <div className="mb-4">
                <div className="mb-2 text-xs tracking-widest text-stone">最近</div>
                <div className="flex flex-wrap gap-2">
                  {recent
                    .filter((e) => e.trainingType === trainingType)
                    .slice(0, 6)
                    .map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm"
                        onClick={() => onPick(ex, ex.equipment[0]?.id ?? null)}
                      >
                        {ex.nameZh}
                      </button>
                    ))}
                </div>
              </div>
            ) : null}
            <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
              {filtered.map((ex) => (
                <li key={ex.id}>
                  <button
                    type="button"
                    className="flex w-full items-center px-4 py-3 text-left"
                    onClick={() => {
                      if (ex.equipment.length > 1) {
                        setPicked(ex);
                        setStep("eq");
                      } else {
                        onPick(ex, ex.equipment[0]?.id ?? null);
                      }
                    }}
                  >
                    <ExerciseName zh={ex.nameZh} en={ex.nameEn} size="sm" />
                  </button>
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="px-4 py-8 text-sm text-stone">沒有符合的動作</li>
              ) : null}
            </ul>
            <button
              type="button"
              className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl border border-dashed border-ink/30 text-sm"
              onClick={() => {
                setNameZh(q.trim());
                setNameEn("");
                setMeasurement(defaultMeasurement(trainingType));
                setStep("create");
              }}
            >
              ＋ 新增自訂動作
              {q.trim() ? `「${q.trim()}」` : ""}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SetEditor({
  entry,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  entry: WorkoutEntry;
  initial: WorkoutSet | null;
  onClose: () => void;
  onSave: (p: {
    weight?: number | null;
    additionalWeight?: number | null;
    isBodyweight?: boolean;
    reps?: number | null;
    durationSeconds?: number | null;
    distanceM?: number | null;
  }) => void;
  onDelete?: () => void;
}) {
  const m = entry.exercise.measurement;
  const last = initial ?? entry.sets[entry.sets.length - 1] ?? null;
  const [weight, setWeight] = useState(last?.weight ?? 20);
  const [extra, setExtra] = useState(last?.additionalWeight ?? 0);
  const [reps, setReps] = useState(last?.reps ?? 8);
  const [minutes, setMinutes] = useState(
    last?.durationSeconds ? Math.floor(last.durationSeconds / 60) : 30,
  );
  const [km, setKm] = useState(last?.distanceM ? last.distanceM / 1000 : 5);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-overlay">
      <div className="rounded-t-3xl bg-surface px-5 pb-8 pt-5">
        <div className="flex items-center justify-between">
          <div className="font-medium">
            {initial ? `第 ${initial.setNumber} 組` : "新增一組"}
          </div>
          <button type="button" className="grid size-11 place-items-center" onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>
        <p className="text-sm text-stone">
          {entry.exercise.nameZh}
          {entry.equipment?.slug === "dumbbell" ? " · 請輸入總重量" : ""}
        </p>

        <div className="mt-5 space-y-5">
          {m === "weight_reps" ? (
            <>
              <Field label="重量">
                <NumberStepper
                  value={weight}
                  onChange={setWeight}
                  step={2.5}
                  min={0}
                  decimals={1}
                  suffix="kg"
                  ariaLabel="重量"
                />
              </Field>
              <Field label="次數">
                <NumberStepper value={reps} onChange={setReps} step={1} min={0} ariaLabel="次數" />
              </Field>
            </>
          ) : null}
          {m === "bodyweight" ? (
            <>
              <Field label="額外負重">
                <NumberStepper
                  value={extra}
                  onChange={setExtra}
                  step={2.5}
                  min={0}
                  decimals={1}
                  suffix="kg"
                  ariaLabel="額外負重"
                />
              </Field>
              <p className="text-xs text-stone">0 kg 代表純徒手。</p>
              <Field label="次數">
                <NumberStepper value={reps} onChange={setReps} step={1} min={0} ariaLabel="次數" />
              </Field>
            </>
          ) : null}
          {m === "duration" ? (
            <Field label="時間（分鐘）">
              <NumberStepper value={minutes} onChange={setMinutes} step={1} min={0} ariaLabel="分鐘" />
            </Field>
          ) : null}
          {m === "distance_duration" ? (
            <>
              <Field label="距離">
                <NumberStepper
                  value={km}
                  onChange={setKm}
                  step={0.5}
                  min={0}
                  decimals={2}
                  suffix="km"
                  ariaLabel="距離"
                />
              </Field>
              <Field label="時間（分鐘）">
                <NumberStepper value={minutes} onChange={setMinutes} step={1} min={0} ariaLabel="分鐘" />
              </Field>
            </>
          ) : null}
        </div>

        <div className="mt-6 flex gap-2">
          {onDelete ? (
            <Button variant="outline" className="flex-1" onClick={onDelete}>
              刪除
            </Button>
          ) : null}
          <Button
            className="flex-1"
            onClick={() =>
              onSave({
                weight: m === "weight_reps" ? weight : null,
                additionalWeight: m === "bodyweight" ? extra : null,
                isBodyweight: m === "bodyweight",
                reps: m === "weight_reps" || m === "bodyweight" ? reps : null,
                durationSeconds:
                  m === "duration" || m === "distance_duration" ? minutes * 60 : null,
                distanceM: m === "distance_duration" ? km * 1000 : null,
              })
            }
          >
            儲存
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs tracking-widest text-stone">{label}</div>
      {children}
    </div>
  );
}
