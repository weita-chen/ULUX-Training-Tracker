import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
import { dashboardStats, exerciseProgress } from "@/lib/api/analytics";
import { listCatalog } from "@/lib/api/catalog";
import { formatKg, formatShortDate } from "@/lib/format";

export const Route = createFileRoute("/_app/progress")({ component: ProgressPage });

function ProgressPage() {
  const stats = useQuery({ queryKey: ["stats"], queryFn: () => dashboardStats() });
  const catalog = useQuery({ queryKey: ["catalog"], queryFn: () => listCatalog() });
  const [exerciseId, setExerciseId] = useState<number | null>(null);
  const [showMuscle, setShowMuscle] = useState(false);

  const logged = useMemo(() => {
    const ids = new Set((stats.data?.prs ?? []).map((p) => p.exerciseId));
    return (catalog.data?.exercises ?? []).filter((e) => ids.has(e.id));
  }, [stats.data, catalog.data]);

  const prog = useQuery({
    queryKey: ["progress", exerciseId],
    queryFn: () => exerciseProgress({ data: { exerciseId: exerciseId! } }),
    enabled: exerciseId != null,
  });

  const s = stats.data;

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">進度</h1>
      <p className="mt-1 text-sm text-ink-soft">數據放在這裡，首頁保持安靜。</p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <StatCard label="本週訓練日" value={s ? String(s.week.days) : "—"} hint={`${s?.week.sessions ?? 0} 場`} />
        <StatCard label="本月訓練日" value={s ? String(s.month.days) : "—"} hint={`${s?.month.sessions ?? 0} 場`} />
        <StatCard
          label="本週容量"
          value={s ? String(Math.round(s.week.volume)) : "—"}
          hint="kg × 次"
        />
        <StatCard
          label="本月容量"
          value={s ? String(Math.round(s.month.volume)) : "—"}
          hint="kg × 次"
        />
      </div>

      {s && s.frequency.length >= 2 ? (
        <section className="mt-10">
          <h2 className="text-xs tracking-[0.18em] text-stone">每週訓練日</h2>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s.frequency}>
                <CartesianGrid stroke="#e7e3d8" vertical={false} />
                <XAxis
                  dataKey="week"
                  tickFormatter={(v) => formatShortDate(String(v))}
                  tick={{ fill: "#8a8680", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#8a8680", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fffdf8",
                    border: "1px solid #d9d4c8",
                    borderRadius: 12,
                  }}
                  labelFormatter={(v) => `週起始 ${formatShortDate(String(v))}`}
                />
                <Line
                  type="monotone"
                  dataKey="days"
                  stroke="#243f34"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#243f34" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-xs tracking-[0.18em] text-stone">個人紀錄</h2>
        <ul className="mt-3 divide-y divide-line">
          {(s?.prs ?? [])
            .filter((p) => p.kind === "max_weight")
            .slice(0, 8)
            .map((p) => (
              <li key={`${p.exerciseId}-${p.kind}`} className="flex items-baseline justify-between py-3">
                <button
                  type="button"
                  className="text-left"
                  onClick={() => setExerciseId(p.exerciseId)}
                >
                  <div className="text-sm font-medium">{p.nameZh}</div>
                  <div className="text-xs text-stone">{p.nameEn}</div>
                </button>
                <div className="text-right">
                  <div className="font-display text-lg tabular-nums">
                    {formatKg(p.value)}
                    <span className="ml-1 text-xs text-stone">kg</span>
                  </div>
                  <div className="text-[11px] text-stone">
                    {p.reps ? `${p.reps} 次 · ` : ""}
                    {formatShortDate(p.date)}
                  </div>
                </div>
              </li>
            ))}
          {!s?.prs.length ? (
            <p className="py-8 text-sm text-stone">開始記錄後即可看到個人紀錄。</p>
          ) : null}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xs tracking-[0.18em] text-stone">動作進展</h2>
        <select
          className="mt-3 h-12 w-full rounded-lg border border-line bg-surface px-3 text-sm"
          value={exerciseId ?? ""}
          onChange={(e) => setExerciseId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">選擇動作</option>
          {(logged.length ? logged : catalog.data?.exercises ?? [])
            .filter((e) => e.trainingType === "weight")
            .map((e) => (
              <option key={e.id} value={e.id}>
                {e.nameZh} — {e.nameEn}
              </option>
            ))}
        </select>
        {prog.data && prog.data.points.length >= 1 ? (
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prog.data.points}>
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
                  width={36}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fffdf8",
                    border: "1px solid #d9d4c8",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="maxWeight"
                  name="重量"
                  stroke="#243f34"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#243f34" }}
                />
                <Line
                  type="monotone"
                  dataKey="est1rm"
                  name="預估 1RM"
                  stroke="#8b3a2a"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : exerciseId ? (
          <p className="mt-4 text-sm text-stone">這個動作的資料還不夠畫圖。</p>
        ) : null}
      </section>

      <section className="mt-10 pb-8">
        <button
          type="button"
          className="text-xs tracking-[0.18em] text-stone"
          onClick={() => setShowMuscle((v) => !v)}
        >
          肌群分布 {showMuscle ? "▾" : "▸"}
        </button>
        {showMuscle ? (
          <div className="mt-4 space-y-3">
            <p className="text-xs leading-relaxed text-stone">
              容量依動作所屬肌群平均分攤，避免重複計算。
            </p>
            {(s?.muscleShare ?? []).map((m) => (
              <div key={m.slug}>
                <div className="flex justify-between text-sm">
                  <span>{m.nameZh}</span>
                  <span className="tabular-nums text-stone">
                    {Math.round(m.share * 100)}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-mist">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${Math.round(m.share * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {!s?.muscleShare.length ? (
              <p className="text-sm text-stone">尚無足夠資料。</p>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-4 py-4">
      <div className="text-[11px] tracking-widest text-stone">{label}</div>
      <div className="mt-1 font-display text-3xl tabular-nums">{value}</div>
      <div className="text-xs text-stone">{hint}</div>
    </div>
  );
}
