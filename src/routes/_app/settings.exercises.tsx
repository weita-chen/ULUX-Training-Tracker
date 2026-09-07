import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  archiveCustomExercise,
  createCustomExercise,
  listCustomExercises,
  updateCustomExercise,
} from "@/lib/api/catalog";
import { defaultMeasurement, trainingTypeLabel } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, DialogFrame } from "@/components/ui/alert-dialog";
import {
  CustomExerciseFields,
} from "@/components/custom-exercise-fields";
import { queryClient } from "@/lib/query";
import type { Exercise } from "@/lib/types";

export const Route = createFileRoute("/_app/settings/exercises")({
  component: CustomExercisesPage,
});

function CustomExercisesPage() {
  const list = useQuery({
    queryKey: ["custom-exercises"],
    queryFn: () => listCustomExercises(),
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [nameZh, setNameZh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [notes, setNotes] = useState("");
  const [trainingType, setTrainingType] = useState("weight");
  const [measurement, setMeasurement] = useState<string>(defaultMeasurement("weight"));
  const [delId, setDelId] = useState<number | null>(null);

  function startCreate() {
    setEditing(null);
    setNameZh("");
    setNameEn("");
    setNotes("");
    setTrainingType("weight");
    setMeasurement(defaultMeasurement("weight"));
    setOpen(true);
  }
  function startEdit(ex: Exercise) {
    setEditing(ex);
    setNameZh(ex.nameZh);
    setNameEn(ex.nameEn);
    setNotes(ex.notes ?? "");
    setTrainingType(ex.trainingType);
    setMeasurement(String(ex.measurement));
    setOpen(true);
  }

  async function save() {
    try {
      if (editing) {
        await updateCustomExercise({
          data: { id: editing.id, nameZh, nameEn, notes, trainingType, measurement },
        });
        toast("已更新");
      } else {
        await createCustomExercise({
          data: { nameZh, nameEn, notes, trainingType, measurement },
        });
        toast("已新增動作");
      }
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["custom-exercises"] });
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "無法儲存");
    }
  }

  async function remove() {
    if (delId == null) return;
    try {
      const r = await archiveCustomExercise({ data: { id: delId } });
      toast(r.archived ? "已封存（歷史紀錄仍保留）" : "已刪除");
      setDelId(null);
      await queryClient.invalidateQueries({ queryKey: ["custom-exercises"] });
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "無法刪除");
    }
  }

  return (
    <div>
      <Link to="/settings" className="text-sm text-stone">
        ← 設定
      </Link>
      <div className="mt-3 flex items-end justify-between">
        <h1 className="font-display text-3xl tracking-tight">自訂動作</h1>
        <Button size="sm" onClick={startCreate}>
          新增
        </Button>
      </div>
      <p className="mt-2 text-sm text-ink-soft">
        訓練中也能直接新增。這裡可以整理、改名或刪除。
      </p>
      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
        {(list.data ?? []).length === 0 ? (
          <li className="px-4 py-8 text-sm text-stone">還沒有自訂動作。</li>
        ) : (
          (list.data ?? []).map((ex) => (
            <li key={ex.id} className="flex items-center justify-between px-4 py-3">
              <button type="button" className="text-left" onClick={() => startEdit(ex)}>
                <div className="text-sm font-medium">{ex.nameZh}</div>
                <div className="text-xs text-stone">
                  {trainingTypeLabel(ex.trainingType)}
                  {ex.nameEn ? ` · ${ex.nameEn}` : ""}
                </div>
              </button>
              <button
                type="button"
                className="text-xs text-danger"
                onClick={() => setDelId(ex.id)}
              >
                刪除
              </button>
            </li>
          ))
        )}
      </ul>

      <DialogFrame open={open} onOpenChange={setOpen}>
        <h2 className="font-display text-xl">{editing ? "編輯動作" : "新增動作"}</h2>
        <div className="mt-4">
          <CustomExerciseFields
            nameZh={nameZh}
            nameEn={nameEn}
            notes={notes}
            trainingType={trainingType}
            measurement={measurement}
            onNameZh={setNameZh}
            onNameEn={setNameEn}
            onNotes={setNotes}
            onTrainingType={setTrainingType}
            onMeasurement={setMeasurement}
          />
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button className="flex-1" onClick={save} disabled={!nameZh.trim()}>
            儲存
          </Button>
        </div>
      </DialogFrame>

      <ConfirmDialog
        open={delId != null}
        onOpenChange={(v) => !v && setDelId(null)}
        title="刪除此動作？"
        description="若已有歷史紀錄，動作會被封存而不是真正刪除。"
        confirmLabel="刪除"
        danger
        onConfirm={remove}
      />
    </div>
  );
}
