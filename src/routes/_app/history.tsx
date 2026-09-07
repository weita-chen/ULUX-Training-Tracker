import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { calendarMonth, createSession, listSessionsByDate } from "@/lib/api/workouts";
import {
  addDaysISO,
  daysInMonth,
  formatDisplayDate,
  formatMonthTitle,
  formatTime,
  isISODate,
  monthGridStartOffset,
  startOfWeekISO,
  taipeiDateISO,
  weekdayLabel,
} from "@/lib/format";
import { trainingTypeLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TrainingTypePicker } from "@/components/training-type-picker";
import { queryClient } from "@/lib/query";

type HistorySearch = { date?: string };

export const Route = createFileRoute("/_app/history")({
  validateSearch: (search: Record<string, unknown>): HistorySearch => ({
    date:
      typeof search.date === "string" && isISODate(search.date) ? search.date : undefined,
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();
  const today = taipeiDateISO();
  const search = Route.useSearch();
  const [cursor, setCursor] = useState(() => {
    const iso = search.date ?? today;
    const [y, m] = iso.split("-").map(Number);
    return { year: y, month: m };
  });
  const [view, setView] = useState<"month" | "week">("month");
  const [selected, setSelected] = useState(search.date ?? today);
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);

  const cal = useQuery({
    queryKey: ["calendar", cursor.year, cursor.month],
    queryFn: () => calendarMonth({ data: cursor }),
    placeholderData: keepPreviousData,
  });
  const daySessions = useQuery({
    queryKey: ["sessions-day", selected],
    queryFn: () => listSessionsByDate({ data: { date: selected } }),
  });

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of cal.data ?? []) m.set(d.date, d.sessionCount);
    return m;
  }, [cal.data]);

  const dim = daysInMonth(cursor.year, cursor.month);
  const offset = monthGridStartOffset(cursor.year, cursor.month);
  const cells: (string | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: dim }, (_, i) => {
      const d = String(i + 1).padStart(2, "0");
      const m = String(cursor.month).padStart(2, "0");
      return `${cursor.year}-${m}-${d}`;
    }),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weekStart = startOfWeekISO(selected);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDaysISO(weekStart, i));

  function selectDay(iso: string) {
    setSelected(iso);
    setPicking(false);
    const [y, m] = iso.split("-").map(Number);
    setCursor({ year: y, month: m });
    navigate({ to: "/history", search: { date: iso }, replace: true });
  }

  function prev() {
    setCursor((c) =>
      c.month === 1 ? { year: c.year - 1, month: 12 } : { year: c.year, month: c.month - 1 },
    );
  }
  function next() {
    setCursor((c) =>
      c.month === 12 ? { year: c.year + 1, month: 1 } : { year: c.year, month: c.month + 1 },
    );
  }

  async function start(type: string) {
    setBusy(true);
    try {
      const { id } = await createSession({
        data: { trainingType: type, date: selected },
      });
      await queryClient.invalidateQueries({ queryKey: ["open-session"] });
      await queryClient.invalidateQueries({ queryKey: ["calendar"] });
      await queryClient.invalidateQueries({ queryKey: ["sessions-day"] });
      navigate({ to: "/workout/$sessionId", params: { sessionId: String(id) } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "無法開始訓練");
    } finally {
      setBusy(false);
    }
  }

  const isFuture = selected > today;
  const isToday = selected === today;
  const sessions = daySessions.data ?? [];

  return (
    <div>
      <div className="flex items-end justify-between">
        <h1 className="font-display text-3xl tracking-tight">紀錄</h1>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-mist p-1 text-xs">
          <button
            type="button"
            className={cn("h-8 rounded-md px-3", view === "month" ? "bg-surface" : "text-stone")}
            onClick={() => setView("month")}
          >
            月
          </button>
          <button
            type="button"
            className={cn("h-8 rounded-md px-3", view === "week" ? "bg-surface" : "text-stone")}
            onClick={() => setView("week")}
          >
            週
          </button>
        </div>
      </div>

      {view === "month" ? (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <button type="button" className="grid size-11 place-items-center" onClick={prev}>
              <ChevronLeft className="size-5" />
            </button>
            <div className="font-medium">{formatMonthTitle(cursor.year, cursor.month)}</div>
            <button type="button" className="grid size-11 place-items-center" onClick={next}>
              <ChevronRight className="size-5" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-7 text-center text-[11px] text-stone">
            {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((iso, i) => {
              if (!iso) return <div key={`e-${i}`} className="h-12" />;
              const n = counts.get(iso) ?? 0;
              const isSel = iso === selected;
              const isTodayCell = iso === today;
              const future = iso > today;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => selectDay(iso)}
                  className={cn(
                    "flex h-12 flex-col items-center justify-center rounded-xl text-sm",
                    isSel && "bg-accent text-accent-fg",
                    !isSel && isTodayCell && "text-accent",
                    !isSel && future && "text-stone/50",
                  )}
                >
                  {Number(iso.slice(8))}
                  <span className="flex h-1.5 gap-0.5">
                    {Array.from({ length: Math.min(n, 3) }).map((_, j) => (
                      <span
                        key={j}
                        className={cn(
                          "mt-0.5 size-1 rounded-full",
                          isSel ? "bg-accent-fg" : "bg-accent",
                        )}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="mt-8 space-y-2">
          {weekDays.map((iso) => {
            const n = counts.get(iso) ?? 0;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => selectDay(iso)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3",
                  iso === selected && "border-accent/40 bg-accent-soft",
                  iso > today && "opacity-50",
                )}
              >
                <div>
                  <div className="text-sm font-medium">
                    {weekdayLabel(iso)} {formatDisplayDate(iso).replace(/^\d+年/, "")}
                  </div>
                  <div className="text-xs text-stone">
                    {n === 0 ? (iso > today ? "尚未到" : "尚未登錄") : `${n} 場訓練`}
                  </div>
                </div>
              </button>
            );
          })}
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xs tracking-[0.18em] text-stone">
          {formatDisplayDate(selected)}
          {isToday ? " · 今天" : ""}
        </h2>
        <div className="mt-3 space-y-2">
          {sessions.length === 0 ? (
            <p className="py-4 text-sm text-stone">
              {isFuture ? "還沒到這一天。" : "這天還沒有訓練紀錄。"}
            </p>
          ) : (
            sessions.map((s) => (
              <Link
                key={s.id}
                to="/workout/$sessionId"
                params={{ sessionId: String(s.id) }}
                className="block rounded-2xl border border-line bg-surface px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">{s.title}</div>
                  {!s.endedAt ? (
                    <span className="text-[11px] tracking-widest text-accent">進行中</span>
                  ) : null}
                </div>
                <div className="mt-1 text-xs text-stone">
                  {formatTime(s.startedAt)} · {trainingTypeLabel(s.trainingType)} ·{" "}
                  {s.exerciseCount} 個動作 · {s.setCount} 組
                </div>
              </Link>
            ))
          )}
        </div>

        {!isFuture ? (
          <div className="mt-4">
            {picking ? (
              <div>
                <p className="mb-3 text-sm text-ink-soft">
                  {isToday ? "今天練什麼？" : "補登哪一種訓練？"}
                </p>
                <TrainingTypePicker disabled={busy} onPick={start} />
                <button
                  type="button"
                  className="mt-3 h-11 w-full text-sm text-stone"
                  onClick={() => setPicking(false)}
                >
                  取消
                </button>
              </div>
            ) : (
              <Button
                variant="secondary"
                className="w-full"
                size="lg"
                onClick={() => setPicking(true)}
              >
                <Plus className="size-4" />
                {isToday ? "開始訓練" : "補登這天的訓練"}
              </Button>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
