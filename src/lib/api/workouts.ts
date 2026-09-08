import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { taipeiDateISO, sessionTimestamp, isISODate } from "@/lib/format";
import { trainingTypeLabel as typeLabel } from "@/lib/constants";
import { assembleSession, mapEquipment, mapExercise, mapMuscle, mapSet } from "./map";
import type {
  CalendarDay,
  SessionSummary,
  WorkoutEntry,
  WorkoutSession,
} from "@/lib/types";

function sessionTitle(trainingType: string, startedAt: string): string {
  const d = new Date(startedAt);
  const date = new Intl.DateTimeFormat("zh-Hant", {
    timeZone: "Asia/Taipei",
    month: "numeric",
    day: "numeric",
  }).format(d);
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Taipei",
      hour: "numeric",
      hourCycle: "h23",
    }).format(d),
  );
  const part = hour < 12 ? "上午" : hour < 18 ? "下午" : "晚上";
  return `${typeLabel(trainingType)} · ${date} ${part}`;
}

type SessionRow = {
  id: number;
  training_type: string;
  started_at: string;
  ended_at: string | null;
  notes: string | null;
};

async function loadEntries(
  sql: Awaited<ReturnType<typeof getSql>>,
  sessionIds: number[],
  userId: string,
): Promise<Map<number, WorkoutEntry[]>> {
  const out = new Map<number, WorkoutEntry[]>();
  if (sessionIds.length === 0) return out;
  const placeholders = sessionIds.map((_, i) => `$${i + 1}`).join(",");
  const entries = await sql.query<{
    id: number;
    session_id: number;
    sort_order: number;
    notes: string | null;
    equipment_id: number | null;
    eq_slug: string | null;
    eq_zh: string | null;
    eq_en: string | null;
    exercise_id: number;
    slug: string | null;
    name_zh: string;
    name_en: string;
    training_type: string;
    measurement: string;
    is_system: boolean;
    ex_notes: string | null;
  }>(
    `select e.id, e.session_id, e.sort_order, e.notes, e.equipment_id,
            q.slug as eq_slug, q.name_zh as eq_zh, q.name_en as eq_en,
            x.id as exercise_id, x.slug, x.name_zh, x.name_en, x.training_type,
            x.measurement, x.is_system, x.notes as ex_notes
     from workout_entries e
     join workout_sessions s on s.id = e.session_id
     join exercises x on x.id = e.exercise_id
     left join equipment q on q.id = e.equipment_id
     where s.user_id = $${sessionIds.length + 1}
       and e.session_id in (${placeholders})
     order by e.sort_order, e.id`,
    [...sessionIds, userId],
  );
  const entryIds = entries.map((e) => e.id);
  const sets =
    entryIds.length === 0
      ? []
      : await sql.query<{
          id: number;
          entry_id: number;
          set_number: number;
          weight: unknown;
          additional_weight: unknown;
          is_bodyweight: boolean;
          reps: number | null;
          duration_seconds: number | null;
          distance_m: unknown;
          notes: string | null;
        }>(
          `select id, entry_id, set_number, weight, additional_weight, is_bodyweight,
                  reps, duration_seconds, distance_m, notes
           from workout_sets
           where entry_id = any($1::int[])
           order by set_number, id`,
          [entryIds],
        );
  const setsByEntry = new Map<number, ReturnType<typeof mapSet>[]>();
  for (const s of sets) {
    const list = setsByEntry.get(s.entry_id) ?? [];
    list.push(mapSet(s));
    setsByEntry.set(s.entry_id, list);
  }
  const exerciseIds = [...new Set(entries.map((e) => e.exercise_id))];
  const muscles =
    exerciseIds.length === 0
      ? []
      : await sql.query<{
          exercise_id: number;
          id: number;
          slug: string;
          name_zh: string;
          name_en: string;
        }>(
          `select em.exercise_id, g.id, g.slug, g.name_zh, g.name_en
           from exercise_muscles em
           join muscle_groups g on g.id = em.muscle_group_id
           where em.exercise_id = any($1::int[])`,
          [exerciseIds],
        );
  const eqs =
    exerciseIds.length === 0
      ? []
      : await sql.query<{
          exercise_id: number;
          id: number;
          slug: string;
          name_zh: string;
          name_en: string;
        }>(
          `select ee.exercise_id, q.id, q.slug, q.name_zh, q.name_en
           from exercise_equipment ee
           join equipment q on q.id = ee.equipment_id
           where ee.exercise_id = any($1::int[])`,
          [exerciseIds],
        );
  const musclesByEx = new Map<number, ReturnType<typeof mapMuscle>[]>();
  for (const m of muscles) {
    const list = musclesByEx.get(m.exercise_id) ?? [];
    list.push(mapMuscle(m));
    musclesByEx.set(m.exercise_id, list);
  }
  const eqByEx = new Map<number, ReturnType<typeof mapEquipment>[]>();
  for (const e of eqs) {
    const list = eqByEx.get(e.exercise_id) ?? [];
    list.push(mapEquipment(e));
    eqByEx.set(e.exercise_id, list);
  }

  for (const e of entries) {
    const exercise = mapExercise({
      id: e.exercise_id,
      slug: e.slug,
      name_zh: e.name_zh,
      name_en: e.name_en,
      training_type: e.training_type,
      measurement: e.measurement,
      is_system: e.is_system,
      notes: e.ex_notes,
      muscles: musclesByEx.get(e.exercise_id) ?? [],
      equipment: eqByEx.get(e.exercise_id) ?? [],
    });
    const equipment =
      e.equipment_id && e.eq_slug && e.eq_zh && e.eq_en
        ? mapEquipment({
            id: e.equipment_id,
            slug: e.eq_slug,
            name_zh: e.eq_zh,
            name_en: e.eq_en,
          })
        : null;
    const entry: WorkoutEntry = {
      id: e.id,
      exercise,
      equipment,
      sortOrder: e.sort_order,
      notes: e.notes,
      sets: setsByEntry.get(e.id) ?? [],
    };
    const list = out.get(e.session_id) ?? [];
    list.push(entry);
    out.set(e.session_id, list);
  }
  return out;
}

async function assertSession(
  sql: Awaited<ReturnType<typeof getSql>>,
  sessionId: number,
  userId: string,
): Promise<SessionRow> {
  const rows = await sql<SessionRow>`
    select id, training_type, started_at, ended_at, notes
    from workout_sessions where id = ${sessionId} and user_id = ${userId}
    limit 1
  `;
  if (!rows[0]) throw new Error("找不到這筆訓練");
  return rows[0];
}

export const listSessions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { from?: string; to?: string } | undefined) => data ?? {})
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<SessionRow & { exercise_count: number; set_count: number }>`
      select s.id, s.training_type, s.started_at, s.ended_at, s.notes,
             count(distinct e.id)::int as exercise_count,
             count(st.id)::int as set_count
      from workout_sessions s
      left join workout_entries e on e.session_id = s.id
      left join workout_sets st on st.entry_id = e.id
      where s.user_id = ${context.userId}
      group by s.id
      order by s.started_at desc
      limit 200
    `;
    const from = data.from;
    const to = data.to;
    const mapped: SessionSummary[] = rows
      .filter((r) => {
        const iso = taipeiDateISO(new Date(r.started_at));
        if (from && iso < from) return false;
        if (to && iso > to) return false;
        return true;
      })
      .map((r) => ({
        id: r.id,
        trainingType: r.training_type,
        startedAt: r.started_at,
        endedAt: r.ended_at,
        notes: r.notes,
        exerciseCount: r.exercise_count,
        setCount: r.set_count,
        title: sessionTitle(r.training_type, r.started_at),
      }));
    return mapped;
  });

export const calendarMonth = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { year: number; month: number }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const month = String(data.month).padStart(2, "0");
    const start = `${data.year}-${month}-01`;
    const endMonth = data.month === 12 ? 1 : data.month + 1;
    const endYear = data.month === 12 ? data.year + 1 : data.year;
    const end = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;
    const rows = await sql<{ date: string; n: number }>`
      select to_char(started_at at time zone 'Asia/Taipei', 'YYYY-MM-DD') as date,
             count(*)::int as n
      from workout_sessions
      where user_id = ${context.userId}
        and started_at >= ${start}::date
        and started_at < ${end}::date
      group by 1
    `;
    const days: CalendarDay[] = rows.map((r) => ({
      date: r.date,
      sessionCount: r.n,
    }));
    return days;
  });

export const getSession = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const row = await assertSession(sql, data.id, context.userId);
    const entries = await loadEntries(sql, [row.id], context.userId);
    return assembleSession(row, entries.get(row.id) ?? []);
  });

export const createSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { trainingType: string; date?: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const today = taipeiDateISO();
    if (data.date) {
      if (!isISODate(data.date)) throw new Error("日期格式不正確");
      if (data.date > today) throw new Error("不能補登未來的日期");
    }
    const startedAt = new Date(sessionTimestamp(data.date ?? today));
    const rows = await sql<{ id: number }>`
      insert into workout_sessions (user_id, training_type, started_at)
      values (${context.userId}, ${data.trainingType}, ${startedAt})
      returning id
    `;
    return { id: rows[0].id };
  });

export const updateSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: {
      id: number;
      notes?: string | null;
      complete?: boolean;
      reopen?: boolean;
    }) => data,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const row = await assertSession(sql, data.id, context.userId);
    if (data.complete) {
      const startedDate = taipeiDateISO(new Date(row.started_at));
      const today = taipeiDateISO();
      const endedAt = new Date(
        startedDate < today
          ? new Date(row.started_at).getTime() + 60 * 60 * 1000
          : Date.now(),
      );
      await sql`
        update workout_sessions set ended_at = ${endedAt}
        where id = ${data.id} and user_id = ${context.userId}
      `;
    }
    if (data.reopen) {
      await sql`
        update workout_sessions set ended_at = null
        where id = ${data.id} and user_id = ${context.userId}
      `;
    }
    if (data.notes !== undefined) {
      await sql`
        update workout_sessions set notes = ${data.notes}
        where id = ${data.id} and user_id = ${context.userId}
      `;
    }
    return { ok: true };
  });

export const deleteSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      delete from workout_sessions where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const addEntry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: { sessionId: number; exerciseId: number; equipmentId?: number | null }) =>
      data,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await assertSession(sql, data.sessionId, context.userId);
    const order = await sql<{ n: number }>`
      select coalesce(max(sort_order), -1)::int + 1 as n
      from workout_entries where session_id = ${data.sessionId}
    `;
    const rows = await sql<{ id: number }>`
      insert into workout_entries (session_id, exercise_id, equipment_id, sort_order)
      values (${data.sessionId}, ${data.exerciseId}, ${data.equipmentId ?? null}, ${order[0]?.n ?? 0})
      returning id
    `;
    return { id: rows[0].id };
  });

export const updateEntry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: { id: number; notes?: string | null; equipmentId?: number | null }) =>
      data,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql<{ n: number }>`
      select count(*)::int as n
      from workout_entries e
      join workout_sessions s on s.id = e.session_id
      where e.id = ${data.id} and s.user_id = ${context.userId}
    `;
    if ((owned[0]?.n ?? 0) === 0) throw new Error("找不到動作");
    if (data.notes !== undefined) {
      await sql`update workout_entries set notes = ${data.notes} where id = ${data.id}`;
    }
    if (data.equipmentId !== undefined) {
      await sql`update workout_entries set equipment_id = ${data.equipmentId} where id = ${data.id}`;
    }
    return { ok: true };
  });

export const deleteEntry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      delete from workout_entries e
      using workout_sessions s
      where e.session_id = s.id and e.id = ${data.id} and s.user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const addSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: {
      entryId: number;
      count?: number;
      weight?: number | null;
      additionalWeight?: number | null;
      isBodyweight?: boolean;
      reps?: number | null;
      durationSeconds?: number | null;
      distanceM?: number | null;
    }) => data,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql<{ n: number }>`
      select count(*)::int as n
      from workout_entries e
      join workout_sessions s on s.id = e.session_id
      where e.id = ${data.entryId} and s.user_id = ${context.userId}
    `;
    if ((owned[0]?.n ?? 0) === 0) throw new Error("找不到動作");
    const num = await sql<{ n: number }>`
      select coalesce(max(set_number), 0)::int + 1 as n from workout_sets where entry_id = ${data.entryId}
    `;
    const count = Math.min(20, Math.max(1, Math.round(data.count ?? 1)));
    const start = num[0]?.n ?? 1;
    const ids: number[] = [];
    for (let i = 0; i < count; i++) {
      const rows = await sql<{ id: number }>`
        insert into workout_sets (
          entry_id, set_number, weight, additional_weight, is_bodyweight,
          reps, duration_seconds, distance_m
        ) values (
          ${data.entryId},
          ${start + i},
          ${data.weight ?? null},
          ${data.additionalWeight ?? null},
          ${data.isBodyweight ?? false},
          ${data.reps ?? null},
          ${data.durationSeconds ?? null},
          ${data.distanceM ?? null}
        )
        returning id
      `;
      ids.push(rows[0].id);
    }
    return { id: ids[0], ids };
  });

export const updateSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: {
      id: number;
      weight?: number | null;
      additionalWeight?: number | null;
      isBodyweight?: boolean;
      reps?: number | null;
      durationSeconds?: number | null;
      distanceM?: number | null;
    }) => data,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql<{ n: number }>`
      select count(*)::int as n
      from workout_sets st
      join workout_entries e on e.id = st.entry_id
      join workout_sessions s on s.id = e.session_id
      where st.id = ${data.id} and s.user_id = ${context.userId}
    `;
    if ((owned[0]?.n ?? 0) === 0) throw new Error("找不到組數");
    await sql`
      update workout_sets set
        weight = ${data.weight ?? null},
        additional_weight = ${data.additionalWeight ?? null},
        is_bodyweight = ${data.isBodyweight ?? false},
        reps = ${data.reps ?? null},
        duration_seconds = ${data.durationSeconds ?? null},
        distance_m = ${data.distanceM ?? null}
      where id = ${data.id}
    `;
    return { ok: true };
  });

export const deleteSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ entry_id: number }>`
      select st.entry_id
      from workout_sets st
      join workout_entries e on e.id = st.entry_id
      join workout_sessions s on s.id = e.session_id
      where st.id = ${data.id} and s.user_id = ${context.userId}
    `;
    if (!rows[0]) return { ok: true };
    await sql`delete from workout_sets where id = ${data.id}`;
    const remaining = await sql<{ id: number }>`
      select id from workout_sets where entry_id = ${rows[0].entry_id} order by set_number, id
    `;
    for (let i = 0; i < remaining.length; i++) {
      await sql`update workout_sets set set_number = ${i + 1} where id = ${remaining[i].id}`;
    }
    return { ok: true };
  });

export const recentExercises = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { trainingType?: string } | undefined) => data ?? {})
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{
      exercise_id: number;
      last_at: string;
      name_zh: string;
      name_en: string;
      training_type: string;
      measurement: string;
      is_system: boolean;
      slug: string | null;
      notes: string | null;
    }>`
      select x.id as exercise_id, max(s.started_at) as last_at,
             x.name_zh, x.name_en, x.training_type, x.measurement, x.is_system, x.slug, x.notes
      from workout_entries e
      join workout_sessions s on s.id = e.session_id
      join exercises x on x.id = e.exercise_id
      where s.user_id = ${context.userId}
      group by x.id, x.name_zh, x.name_en, x.training_type, x.measurement, x.is_system, x.slug, x.notes
      order by last_at desc
      limit 12
    `;
    const filtered = data.trainingType
      ? rows.filter((r) => r.training_type === data.trainingType)
      : rows;
    return filtered.map((r) =>
      mapExercise({
        id: r.exercise_id,
        slug: r.slug,
        name_zh: r.name_zh,
        name_en: r.name_en,
        training_type: r.training_type,
        measurement: r.measurement,
        is_system: r.is_system,
        notes: r.notes,
      }),
    );
  });

export const lastSetsForExercise = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { exerciseId: number }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const entry = await sql<{ id: number; equipment_id: number | null }>`
      select e.id, e.equipment_id
      from workout_entries e
      join workout_sessions s on s.id = e.session_id
      where s.user_id = ${context.userId} and e.exercise_id = ${data.exerciseId}
      order by s.started_at desc, e.id desc
      limit 1
    `;
    if (!entry[0]) return { sets: [] as ReturnType<typeof mapSet>[], equipmentId: null };
    const sets = await sql<{
      id: number;
      set_number: number;
      weight: unknown;
      additional_weight: unknown;
      is_bodyweight: boolean;
      reps: number | null;
      duration_seconds: number | null;
      distance_m: unknown;
      notes: string | null;
    }>`
      select id, set_number, weight, additional_weight, is_bodyweight,
             reps, duration_seconds, distance_m, notes
      from workout_sets where entry_id = ${entry[0].id}
      order by set_number
    `;
    return {
      sets: sets.map(mapSet),
      equipmentId: entry[0].equipment_id,
    };
  });

export const lastCompletedSession = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<SessionRow>`
      select id, training_type, started_at, ended_at, notes
      from workout_sessions
      where user_id = ${context.userId}
      order by started_at desc
      limit 1
    `;
    if (!rows[0]) return null;
    const entries = await loadEntries(sql, [rows[0].id], context.userId);
    const session = assembleSession(rows[0], entries.get(rows[0].id) ?? []);
    return {
      ...session,
      title: sessionTitle(rows[0].training_type, rows[0].started_at),
    };
  });

export const openSession = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const today = taipeiDateISO();
    const rows = await sql<SessionRow>`
      select id, training_type, started_at, ended_at, notes
      from workout_sessions
      where user_id = ${context.userId}
        and ended_at is null
        and to_char(started_at at time zone 'Asia/Taipei', 'YYYY-MM-DD') = ${today}
      order by started_at desc
      limit 1
    `;
    return rows[0] ? { id: rows[0].id, trainingType: rows[0].training_type } : null;
  });

export const repeatLastSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const last = await sql<SessionRow>`
      select id, training_type, started_at, ended_at, notes
      from workout_sessions
      where user_id = ${context.userId}
      order by started_at desc
      limit 1
    `;
    if (!last[0]) throw new Error("尚無訓練紀錄可重複");
    const created = await sql<{ id: number }>`
      insert into workout_sessions (user_id, training_type, notes)
      values (${context.userId}, ${last[0].training_type}, ${last[0].notes})
      returning id
    `;
    const newId = created[0].id;
    const entries = await sql<{
      id: number;
      exercise_id: number;
      equipment_id: number | null;
      sort_order: number;
      notes: string | null;
    }>`
      select id, exercise_id, equipment_id, sort_order, notes
      from workout_entries where session_id = ${last[0].id}
      order by sort_order, id
    `;
    for (const e of entries) {
      const ne = await sql<{ id: number }>`
        insert into workout_entries (session_id, exercise_id, equipment_id, sort_order, notes)
        values (${newId}, ${e.exercise_id}, ${e.equipment_id}, ${e.sort_order}, ${e.notes})
        returning id
      `;
      const sets = await sql<{
        set_number: number;
        weight: unknown;
        additional_weight: unknown;
        is_bodyweight: boolean;
        reps: number | null;
        duration_seconds: number | null;
        distance_m: unknown;
      }>`
        select set_number, weight, additional_weight, is_bodyweight, reps, duration_seconds, distance_m
        from workout_sets where entry_id = ${e.id} order by set_number
      `;
      for (const s of sets) {
        await sql`
          insert into workout_sets (
            entry_id, set_number, weight, additional_weight, is_bodyweight,
            reps, duration_seconds, distance_m
          ) values (
            ${ne[0].id}, ${s.set_number}, ${s.weight as number | null},
            ${s.additional_weight as number | null}, ${s.is_bodyweight},
            ${s.reps}, ${s.duration_seconds}, ${s.distance_m as number | null}
          )
        `;
      }
    }
    return { id: newId };
  });

export const listSessionsByDate = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { date: string }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<SessionRow & { exercise_count: number; set_count: number }>`
      select s.id, s.training_type, s.started_at, s.ended_at, s.notes,
             count(distinct e.id)::int as exercise_count,
             count(st.id)::int as set_count
      from workout_sessions s
      left join workout_entries e on e.session_id = s.id
      left join workout_sets st on st.entry_id = e.id
      where s.user_id = ${context.userId}
        and to_char(s.started_at at time zone 'Asia/Taipei', 'YYYY-MM-DD') = ${data.date}
      group by s.id
      order by s.started_at
    `;
    const bySession = await loadEntries(
      sql,
      rows.map((r) => r.id),
      context.userId,
    );
    return rows.map((r) => ({
      id: r.id,
      trainingType: r.training_type,
      startedAt: r.started_at,
      endedAt: r.ended_at,
      notes: r.notes,
      exerciseCount: r.exercise_count,
      setCount: r.set_count,
      title: sessionTitle(r.training_type, r.started_at),
      entries: bySession.get(r.id) ?? [],
    })) satisfies SessionSummary[];
  });
