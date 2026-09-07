import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { epley1RM, taipeiDateISO, toNum } from "@/lib/format";
import type { MuscleShare, PersonalRecord, ProgressionPoint } from "@/lib/types";

type SetRow = {
  session_id: number;
  started_at: string;
  exercise_id: number;
  name_zh: string;
  name_en: string;
  measurement: string;
  weight: unknown;
  additional_weight: unknown;
  is_bodyweight: boolean;
  reps: number | null;
  duration_seconds: number | null;
};

function load(weight: unknown, additional: unknown, isBw: boolean): number {
  if (isBw) return toNum(additional) ?? 0;
  return toNum(weight) ?? 0;
}

function volumeOf(row: SetRow): number {
  const w = load(row.weight, row.additional_weight, row.is_bodyweight);
  const reps = row.reps ?? 0;
  if (row.measurement === "duration" || row.measurement === "distance_duration") {
    return row.duration_seconds ?? 0;
  }
  return w * reps;
}

export const dashboardStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const sessions = await sql<{ id: number; started_at: string }>`
      select id, started_at from workout_sessions where user_id = ${context.userId}
    `;
    const today = taipeiDateISO();
    const weekStart = (() => {
      const dt = new Date(`${today}T12:00:00+08:00`);
      const map: Record<string, number> = {
        Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
      };
      const day = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Taipei",
        weekday: "short",
      }).format(dt);
      dt.setDate(dt.getDate() - (map[day] ?? 0));
      return taipeiDateISO(dt);
    })();
    const monthStart = today.slice(0, 8) + "01";

    const dated = sessions.map((s) => ({
      id: s.id,
      date: taipeiDateISO(new Date(s.started_at)),
    }));
    const week = dated.filter((s) => s.date >= weekStart && s.date <= today);
    const month = dated.filter((s) => s.date >= monthStart && s.date <= today);
    const weekDays = new Set(week.map((s) => s.date)).size;
    const monthDays = new Set(month.map((s) => s.date)).size;

    const sets = await sql<SetRow>`
      select s.id as session_id, s.started_at, x.id as exercise_id, x.name_zh, x.name_en,
             x.measurement, st.weight, st.additional_weight, st.is_bodyweight, st.reps,
             st.duration_seconds
      from workout_sets st
      join workout_entries e on e.id = st.entry_id
      join workout_sessions s on s.id = e.session_id
      join exercises x on x.id = e.exercise_id
      where s.user_id = ${context.userId}
    `;

    const weekIds = new Set(week.map((s) => s.id));
    const monthIds = new Set(month.map((s) => s.id));
    let weekVolume = 0;
    let monthVolume = 0;
    for (const row of sets) {
      const v = volumeOf(row);
      if (weekIds.has(row.session_id)) weekVolume += v;
      if (monthIds.has(row.session_id)) monthVolume += v;
    }

    const prMap = new Map<
      number,
      { maxW: number; maxWReps: number | null; maxWDate: string; est: number; estDate: string; nameZh: string; nameEn: string }
    >();
    for (const row of sets) {
      if (row.measurement !== "weight_reps" && row.measurement !== "bodyweight") continue;
      const w = load(row.weight, row.additional_weight, row.is_bodyweight);
      if (w <= 0) continue;
      const date = taipeiDateISO(new Date(row.started_at));
      const est = epley1RM(w, row.reps ?? 1) ?? w;
      const cur = prMap.get(row.exercise_id) ?? {
        maxW: 0,
        maxWReps: null,
        maxWDate: date,
        est: 0,
        estDate: date,
        nameZh: row.name_zh,
        nameEn: row.name_en,
      };
      if (w > cur.maxW) {
        cur.maxW = w;
        cur.maxWReps = row.reps;
        cur.maxWDate = date;
      }
      if (est > cur.est) {
        cur.est = est;
        cur.estDate = date;
      }
      cur.nameZh = row.name_zh;
      cur.nameEn = row.name_en;
      prMap.set(row.exercise_id, cur);
    }
    const prs: PersonalRecord[] = [];
    for (const [exerciseId, p] of prMap) {
      if (p.maxW > 0) {
        prs.push({
          exerciseId,
          nameZh: p.nameZh,
          nameEn: p.nameEn,
          kind: "max_weight",
          value: p.maxW,
          reps: p.maxWReps,
          date: p.maxWDate,
        });
      }
      if (p.est > 0) {
        prs.push({
          exerciseId,
          nameZh: p.nameZh,
          nameEn: p.nameEn,
          kind: "est_1rm",
          value: p.est,
          reps: null,
          date: p.estDate,
        });
      }
    }
    prs.sort((a, b) => b.value - a.value);

    const muscles = await sql<{
      exercise_id: number;
      slug: string;
      name_zh: string;
      name_en: string;
    }>`
      select em.exercise_id, g.slug, g.name_zh, g.name_en
      from exercise_muscles em
      join muscle_groups g on g.id = em.muscle_group_id
    `;
    const groupsByEx = new Map<number, { slug: string; nameZh: string; nameEn: string }[]>();
    for (const m of muscles) {
      const list = groupsByEx.get(m.exercise_id) ?? [];
      list.push({ slug: m.slug, nameZh: m.name_zh, nameEn: m.name_en });
      groupsByEx.set(m.exercise_id, list);
    }
    const vol = new Map<string, { nameZh: string; nameEn: string; volume: number }>();
    for (const row of sets) {
      if (row.measurement !== "weight_reps" && row.measurement !== "bodyweight") continue;
      const v = volumeOf(row);
      const groups = groupsByEx.get(row.exercise_id);
      if (!groups || groups.length === 0 || v <= 0) continue;
      const share = v / groups.length;
      for (const g of groups) {
        const cur = vol.get(g.slug) ?? { nameZh: g.nameZh, nameEn: g.nameEn, volume: 0 };
        cur.volume += share;
        vol.set(g.slug, cur);
      }
    }
    const total = [...vol.values()].reduce((s, x) => s + x.volume, 0) || 1;
    const muscleShare: MuscleShare[] = [...vol.entries()]
      .map(([slug, v]) => ({
        slug,
        nameZh: v.nameZh,
        nameEn: v.nameEn,
        volume: Math.round(v.volume),
        share: v.volume / total,
      }))
      .sort((a, b) => b.volume - a.volume);

    const freqMap = new Map<string, { days: Set<string>; sessions: number }>();
    for (const s of dated) {
      const weekKey = s.date;
      const dt = new Date(`${s.date}T12:00:00+08:00`);
      const map: Record<string, number> = {
        Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
      };
      const day = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Taipei",
        weekday: "short",
      }).format(dt);
      dt.setDate(dt.getDate() - (map[day] ?? 0));
      const key = taipeiDateISO(dt);
      const cur = freqMap.get(key) ?? { days: new Set(), sessions: 0 };
      cur.days.add(s.date);
      cur.sessions += 1;
      freqMap.set(key, cur);
    }
    const frequency = [...freqMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([week, v]) => ({
        week,
        days: v.days.size,
        sessions: v.sessions,
      }));

    return {
      week: { days: weekDays, sessions: week.length, volume: Math.round(weekVolume) },
      month: { days: monthDays, sessions: month.length, volume: Math.round(monthVolume) },
      prs: prs.slice(0, 24),
      muscleShare,
      frequency,
    };
  });

export const exerciseProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { exerciseId: number }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const ex = await sql<{ name_zh: string; name_en: string; measurement: string }>`
      select name_zh, name_en, measurement from exercises where id = ${data.exerciseId} limit 1
    `;
    if (!ex[0]) throw new Error("找不到動作");
    const rows = await sql<{
      session_id: number;
      started_at: string;
      weight: unknown;
      additional_weight: unknown;
      is_bodyweight: boolean;
      reps: number | null;
      duration_seconds: number | null;
      distance_m: unknown;
    }>`
      select s.id as session_id, s.started_at, st.weight, st.additional_weight,
             st.is_bodyweight, st.reps, st.duration_seconds, st.distance_m
      from workout_sets st
      join workout_entries e on e.id = st.entry_id
      join workout_sessions s on s.id = e.session_id
      where s.user_id = ${context.userId} and e.exercise_id = ${data.exerciseId}
      order by s.started_at
    `;
    const bySession = new Map<number, typeof rows>();
    for (const r of rows) {
      const list = bySession.get(r.session_id) ?? [];
      list.push(r);
      bySession.set(r.session_id, list);
    }
    const points: ProgressionPoint[] = [];
    for (const [sessionId, list] of bySession) {
      let maxWeight: number | null = null;
      let est1rm: number | null = null;
      let volume = 0;
      let bestSet = "";
      for (const r of list) {
        const w = r.is_bodyweight
          ? (toNum(r.additional_weight) ?? 0)
          : (toNum(r.weight) ?? 0);
        const reps = r.reps ?? 0;
        if (w > (maxWeight ?? 0)) maxWeight = w;
        const est = reps > 0 ? epley1RM(w, reps) : null;
        if (est && est > (est1rm ?? 0)) est1rm = est;
        volume += w * reps;
        if (r.duration_seconds) {
          volume += r.duration_seconds;
        }
        const label =
          r.is_bodyweight && w > 0
            ? `BW+${w} × ${reps}`
            : r.is_bodyweight
              ? `BW × ${reps}`
              : w > 0
                ? `${w} kg × ${reps}`
                : r.duration_seconds
                  ? `${Math.round(r.duration_seconds / 60)} 分`
                  : "";
        if (label && (!bestSet || w >= (maxWeight ?? 0))) bestSet = label;
      }
      points.push({
        date: taipeiDateISO(new Date(list[0].started_at)),
        sessionId,
        maxWeight,
        est1rm,
        volume,
        bestSet,
      });
    }
    points.sort((a, b) => a.date.localeCompare(b.date));
    return {
      nameZh: ex[0].name_zh,
      nameEn: ex[0].name_en,
      measurement: ex[0].measurement,
      points,
    };
  });
