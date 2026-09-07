import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { deleteInbody, listInbody, saveInbody } from "@/lib/api/inbody";
import {
  INBODY_CHART_METRICS,
  INBODY_COMMON,
  INBODY_COMPOSITION,
  INBODY_REQUIRED,
  INBODY_SEGMENTAL,
  LOWER_IS_BETTER,
  type InbodyField,
  type InbodyFieldKey,
} from "@/lib/inbody-fields";
import { formatDisplayDate, formatShortDate, taipeiDateISO, toNum } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/lib/query";
import { cn } from "@/lib/utils";
import type { InbodyMeasurement } from "@/lib/types";

export const Route = createFileRoute("/_app/inbody")({ component: InbodyPage });

type Draft = Record<InbodyFieldKey, string> & { measuredOn: string; notes: string };

function emptyDraft(date = taipeiDateISO()): Draft {
  const d = { measuredOn: date, notes: "" } as Draft;
  for (const f of [
    ...INBODY_REQUIRED,
    ...INBODY_COMMON,
    ...INBODY_COMPOSITION,
    ...INBODY_SEGMENTAL,
  ]) {
    d[f.key] = "";
  }
  return d;
}

function fromRecord(r: InbodyMeasurement): Draft {
  const d = emptyDraft(r.measuredOn);
  d.notes = r.notes ?? "";
  const src = r as unknown as Record<string, unknown>;
  for (const f of [
    ...INBODY_REQUIRED,
    ...INBODY_COMMON,
    ...INBODY_COMPOSITION,
    ...INBODY_SEGMENTAL,
  ]) {
    const v = src[f.key];
    d[f.key] = v == null || v === "" ? "" : String(v);
  }
  return d;
}

function InbodyPage() {
  const list = useQuery({ queryKey: ["inbody"], queryFn: () => listInbody() });
  const rows = list.data ?? [];
  const [mode, setMode] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft());
  const [busy, setBusy] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [metric, setMetric] = useState<InbodyFieldKey>("pbf");
  const [advanced, setAdvanced] = useState(false);

  const latest = rows[0] ?? null;
  const prev = rows[1] ?? null;
  const chrono = useMemo(() => [...rows].reverse(), [rows]);

  const chartData = useMemo(() => {
    return chrono
      .map((r) => ({
        date: r.measuredOn,
        value: (r as unknown as Record<string, unknown>)[metric] as number | null,
      }))
      .filter((p) => p.value != null);
  }, [chrono, metric]);

  function openNew() {
    setEditingId(null);
    setDraft(emptyDraft());
    setAdvanced(false);
    setMode("form");
  }

  function openEdit(r: InbodyMeasurement) {
    setEditingId(r.id);
    setDraft(fromRecord(r));
    setAdvanced(false);
    setMode("form");
  }

  async function save() {
    setBusy(true);
    try {
      const values: Partial<Record<InbodyFieldKey, number | null>> = {};
      for (const f of [
        ...INBODY_REQUIRED,
        ...INBODY_COMMON,
        ...INBODY_COMPOSITION,
        ...INBODY_SEGMENTAL,
      ]) {
        const raw = draft[f.key].trim();
        values[f.key] = raw === "" ? null : toNum(raw.replace(",", "."));
      }
      await saveInbody({
        data: {
          id: editingId ?? undefined,
          measuredOn: draft.measuredOn,
          values,
          notes: draft.notes,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["inbody"] });
      toast(editingId ? "已更新測量" : "已記錄測量");
      setMode("list");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "無法儲存");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (deleteId == null) return;
    setBusy(true);
    try {
      await deleteInbody({ data: { id: deleteId } });
      await queryClient.invalidateQueries({ queryKey: ["inbody"] });
      toast("已刪除");
      setDeleteId(null);
      if (editingId === deleteId) setMode("list");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "無法刪除");
    } finally {
      setBusy(false);
    }
  }

  if (mode === "form") {
    return (
      <div>
        <button
          type="button"
          className="flex min-h-11 items-center gap-1 text-sm text-stone"
          onClick={() => setMode("list")}
        >
          <ChevronLeft className="size-4" />
          返回
        </button>
        <h1 className="mt-3 font-display text-3xl tracking-tight">
          {editingId ? "編輯測量" : "新增測量"}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">對照 InBody 報告書填入即可。</p>

        <div className="mt-8 space-y-5">
          <div>
            <Label htmlFor="measured-on">測量日期</Label>
            <Input
              id="measured-on"
              type="date"
              className="mt-1.5"
              max={taipeiDateISO()}
              value={draft.measuredOn}
              onChange={(e) => setDraft((d) => ({ ...d, measuredOn: e.target.value }))}
            />
          </div>

          <section>
            <h2 className="text-xs tracking-[0.18em] text-stone">必填</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {INBODY_REQUIRED.map((f) => (
                <NumField
                  key={f.key}
                  field={f}
                  value={draft[f.key]}
                  onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs tracking-[0.18em] text-stone">常用選填</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {INBODY_COMMON.map((f) => (
                <NumField
                  key={f.key}
                  field={f}
                  value={draft[f.key]}
                  onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
                />
              ))}
            </div>
          </section>

          <button
            type="button"
            className="text-xs tracking-[0.18em] text-stone"
            onClick={() => setAdvanced((v) => !v)}
          >
            進階數據 {advanced ? "▾" : "▸"}
          </button>

          {advanced ? (
            <>
              <section>
                <h2 className="text-xs tracking-[0.18em] text-stone">身體組成</h2>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {INBODY_COMPOSITION.map((f) => (
                    <NumField
                      key={f.key}
                      field={f}
                      value={draft[f.key]}
                      onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
                    />
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-xs tracking-[0.18em] text-stone">節段肌肉量</h2>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {INBODY_SEGMENTAL.map((f) => (
                    <NumField
                      key={f.key}
                      field={f}
                      value={draft[f.key]}
                      onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
                    />
                  ))}
                </div>
              </section>
            </>
          ) : null}

          <div>
            <Label htmlFor="inbody-notes">備註</Label>
            <Textarea
              id="inbody-notes"
              className="mt-1.5"
              rows={3}
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              placeholder="儀器型號、測量條件…"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-2 pb-6">
          <Button variant="ghost" className="flex-1" onClick={() => setMode("list")}>
            取消
          </Button>
          <Button className="flex-1" onClick={save} disabled={busy}>
            儲存
          </Button>
        </div>
        {editingId ? (
          <button
            type="button"
            className="mb-8 w-full py-3 text-sm text-danger"
            onClick={() => setDeleteId(editingId)}
          >
            刪除此筆
          </button>
        ) : null}

        <ConfirmDialog
          open={deleteId != null}
          onOpenChange={(v) => {
            if (!v) setDeleteId(null);
          }}
          title="刪除這筆測量？"
          description="刪除後無法復原。"
          confirmLabel="刪除"
          danger
          onConfirm={() => void confirmDelete()}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-tight">InBody 數據</h1>
          <p className="mt-1 text-sm text-ink-soft">自己登錄報告，看身體組成怎麼變。</p>
        </div>
        <Button size="sm" onClick={openNew} className="shrink-0">
          <Plus className="size-4" />
          新增
        </Button>
      </div>

      {latest ? (
        <section className="mt-8 grid grid-cols-2 gap-3">
          {INBODY_REQUIRED.map((f) => {
            const value = (latest as unknown as Record<string, number>)[f.key];
            const before = prev
              ? ((prev as unknown as Record<string, number | null>)[f.key] ?? null)
              : null;
            return (
              <MetricCard
                key={f.key}
                field={f}
                value={value}
                previous={before}
              />
            );
          })}
        </section>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-line px-5 py-12 text-center">
          <p className="text-sm text-ink-soft">還沒有測量紀錄。</p>
          <p className="mt-1 text-sm text-stone">量完 InBody 後，把數字記在這裡。</p>
          <Button className="mt-6" onClick={openNew}>
            新增第一筆
          </Button>
        </div>
      )}

      {chartData.length >= 2 ? (
        <section className="mt-10">
          <h2 className="text-xs tracking-[0.18em] text-stone">變化曲線</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {INBODY_CHART_METRICS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMetric(m.key)}
                className={cn(
                  "h-8 rounded-full px-3 text-xs",
                  metric === m.key ? "bg-accent text-accent-fg" : "bg-mist text-ink-soft",
                )}
              >
                {m.zh}
              </button>
            ))}
          </div>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#e7e3d8" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => formatShortDate(String(v))}
                  tick={{ fill: "#8a8680", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8a8680", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fffdf8",
                    border: "1px solid #d9d4c8",
                    borderRadius: 12,
                  }}
                  labelFormatter={(v) => formatDisplayDate(String(v))}
                  formatter={(v) => {
                    const field = INBODY_CHART_METRICS.find((m) => m.key === metric);
                    const unit =
                      [...INBODY_REQUIRED, ...INBODY_COMMON].find((f) => f.key === metric)
                        ?.unit ?? "";
                    return [`${v}${unit ? ` ${unit}` : ""}`, field?.zh ?? ""];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#243f34"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#243f34" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      {rows.length ? (
        <section className="mt-10 pb-8">
          <h2 className="text-xs tracking-[0.18em] text-stone">歷史紀錄</h2>
          <ul className="mt-3 divide-y divide-line">
            {rows.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  className="flex min-h-16 w-full items-center justify-between py-3 text-left"
                  onClick={() => openEdit(r)}
                >
                  <div>
                    <div className="text-sm">{formatDisplayDate(r.measuredOn)}</div>
                    <div className="mt-0.5 text-xs text-stone">
                      肌 {fmt(r.smmKg)} kg · 脂 {fmt(r.pbf)}%
                      {r.weightKg != null ? ` · ${fmt(r.weightKg)} kg` : ""}
                    </div>
                  </div>
                  <div className="text-right text-xs text-stone">
                    內臟 {fmt(r.visceralFatLevel)}
                    {r.inbodyScore != null ? (
                      <div>分數 {fmt(r.inbodyScore)}</div>
                    ) : null}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ConfirmDialog
        open={deleteId != null}
        onOpenChange={(v) => {
          if (!v) setDeleteId(null);
        }}
        title="刪除這筆測量？"
        description="刪除後無法復原。"
        confirmLabel="刪除"
        danger
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}

function fmt(n: number | null | undefined): string {
  if (n == null) return "—";
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function deltaText(current: number, previous: number | null, key: InbodyFieldKey) {
  if (previous == null) return null;
  const d = Math.round((current - previous) * 100) / 100;
  if (d === 0) return { text: "持平", good: true };
  const lowerBetter = LOWER_IS_BETTER.has(key);
  const good = lowerBetter ? d < 0 : d > 0;
  const sign = d > 0 ? "+" : "";
  return { text: `${sign}${d}`, good };
}

function MetricCard({
  field,
  value,
  previous,
}: {
  field: InbodyField;
  value: number;
  previous: number | null;
}) {
  const delta = deltaText(value, previous, field.key);
  return (
    <div className="rounded-2xl border border-line bg-surface px-4 py-4">
      <div className="text-[11px] tracking-widest text-stone">{field.zh}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-3xl tabular-nums">{fmt(value)}</span>
        <span className="text-xs text-stone">{field.unit}</span>
      </div>
      {delta ? (
        <div className={cn("text-xs tabular-nums", delta.good ? "text-accent" : "text-mark")}>
          {delta.text}
          {previous != null && delta.text !== "持平" ? ` ${field.unit}` : ""}
        </div>
      ) : (
        <div className="text-xs text-stone">{field.en}</div>
      )}
    </div>
  );
}

function NumField({
  field,
  value,
  onChange,
}: {
  field: InbodyField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={field.key}>
        {field.zh}
        {field.required ? null : (
          <span className="ml-1 font-normal text-stone">選填</span>
        )}
      </Label>
      <div className="mt-0.5 text-[11px] tracking-wide text-stone">
        {field.en}
        {field.unit ? ` · ${field.unit}` : ""}
      </div>
      <div className="relative mt-1.5">
        <Input
          id={field.key}
          inputMode="decimal"
          className={cn("tabular-nums", field.unit ? "pr-12" : "")}
          value={value}
          step={field.step}
          onChange={(e) => onChange(e.target.value)}
        />
        {field.unit ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone">
            {field.unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}
