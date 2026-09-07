import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { defaultMeasurement, MEASUREMENTS, TRAINING_TYPES } from "@/lib/constants";
import { mapEquipment, mapExercise, mapMuscle } from "./map";
import type { Equipment, Exercise, MuscleGroup } from "@/lib/types";

type ExRow = {
  id: number;
  slug: string | null;
  name_zh: string;
  name_en: string;
  training_type: string;
  measurement: string;
  is_system: boolean;
  notes: string | null;
};

function asTrainingType(v: string | undefined): string {
  const id = (v ?? "weight").trim();
  return TRAINING_TYPES.some((t) => t.id === id) ? id : "weight";
}

function asMeasurement(v: string | undefined, type: string): string {
  const id = (v ?? "").trim();
  if ((MEASUREMENTS as readonly string[]).includes(id)) return id;
  return defaultMeasurement(type);
}

export const listCatalog = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const muscles = (
      await sql<{ id: number; slug: string; name_zh: string; name_en: string }>`
        select id, slug, name_zh, name_en from muscle_groups order by id
      `
    ).map(mapMuscle);
    const equipment = (
      await sql<{ id: number; slug: string; name_zh: string; name_en: string }>`
        select id, slug, name_zh, name_en from equipment order by id
      `
    ).map(mapEquipment);
    const exercises = await sql<ExRow>`
      select id, slug, name_zh, name_en, training_type, measurement, is_system, notes
      from exercises
      where archived_at is null
        and (is_system = true or owner_user_id = ${context.userId})
      order by is_system desc, name_zh
    `;
    const linksM = await sql<{ exercise_id: number; muscle_group_id: number }>`
      select exercise_id, muscle_group_id from exercise_muscles
    `;
    const linksE = await sql<{ exercise_id: number; equipment_id: number }>`
      select exercise_id, equipment_id from exercise_equipment
    `;
    const muscleById = new Map(muscles.map((m) => [m.id, m]));
    const eqById = new Map(equipment.map((e) => [e.id, e]));
    const mapped: Exercise[] = exercises.map((ex) => {
      const ms: MuscleGroup[] = [];
      for (const l of linksM) {
        if (l.exercise_id === ex.id) {
          const m = muscleById.get(l.muscle_group_id);
          if (m) ms.push(m);
        }
      }
      const eqs: Equipment[] = [];
      for (const l of linksE) {
        if (l.exercise_id === ex.id) {
          const e = eqById.get(l.equipment_id);
          if (e) eqs.push(e);
        }
      }
      return mapExercise({ ...ex, muscles: ms, equipment: eqs });
    });
    return { muscles, equipment, exercises: mapped };
  });

export const listCustomExercises = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<ExRow>`
      select id, slug, name_zh, name_en, training_type, measurement, is_system, notes
      from exercises
      where owner_user_id = ${context.userId} and archived_at is null
      order by name_zh
    `;
    return rows.map((r) => mapExercise(r));
  });

export const createCustomExercise = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: {
      nameZh: string;
      nameEn?: string;
      notes?: string;
      trainingType?: string;
      measurement?: string;
    }) => data,
  )
  .handler(async ({ context, data }) => {
    const nameZh = data.nameZh.trim();
    if (!nameZh) throw new Error("請輸入動作名稱");
    const trainingType = asTrainingType(data.trainingType);
    const measurement = asMeasurement(data.measurement, trainingType);
    const sql = await getSql();
    const rows = await sql<ExRow>`
      insert into exercises (name_zh, name_en, training_type, measurement, is_system, owner_user_id, notes)
      values (
        ${nameZh},
        ${data.nameEn?.trim() ?? ""},
        ${trainingType},
        ${measurement},
        false,
        ${context.userId},
        ${data.notes?.trim() || null}
      )
      returning id, slug, name_zh, name_en, training_type, measurement, is_system, notes
    `;
    return mapExercise(rows[0]);
  });

export const updateCustomExercise = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: {
      id: number;
      nameZh: string;
      nameEn?: string;
      notes?: string;
      trainingType?: string;
      measurement?: string;
    }) => data,
  )
  .handler(async ({ context, data }) => {
    const nameZh = data.nameZh.trim();
    if (!nameZh) throw new Error("請輸入動作名稱");
    const sql = await getSql();
    const trainingType = data.trainingType
      ? asTrainingType(data.trainingType)
      : null;
    const measurement = data.measurement
      ? asMeasurement(data.measurement, trainingType ?? "weight")
      : null;
    if (trainingType && measurement) {
      await sql`
        update exercises
        set name_zh = ${nameZh},
            name_en = ${data.nameEn?.trim() ?? ""},
            notes = ${data.notes?.trim() || null},
            training_type = ${trainingType},
            measurement = ${measurement}
        where id = ${data.id} and owner_user_id = ${context.userId} and is_system = false
      `;
    } else {
      await sql`
        update exercises
        set name_zh = ${nameZh},
            name_en = ${data.nameEn?.trim() ?? ""},
            notes = ${data.notes?.trim() || null}
        where id = ${data.id} and owner_user_id = ${context.userId} and is_system = false
      `;
    }
    return { ok: true };
  });

export const archiveCustomExercise = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const used = await sql<{ n: number }>`
      select count(*)::int as n
      from workout_entries e
      join workout_sessions s on s.id = e.session_id
      where e.exercise_id = ${data.id} and s.user_id = ${context.userId}
    `;
    if ((used[0]?.n ?? 0) > 0) {
      await sql`
        update exercises set archived_at = now()
        where id = ${data.id} and owner_user_id = ${context.userId} and is_system = false
      `;
      return { archived: true };
    }
    await sql`
      delete from exercises
      where id = ${data.id} and owner_user_id = ${context.userId} and is_system = false
    `;
    return { archived: false };
  });
