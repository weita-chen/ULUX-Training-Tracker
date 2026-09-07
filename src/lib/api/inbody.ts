import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { taipeiDateISO, toNum } from "@/lib/format";
import { INBODY_ALL_FIELDS, INBODY_REQUIRED } from "@/lib/inbody-fields";
import type { InbodyFieldKey } from "@/lib/inbody-fields";
import type { InbodyMeasurement } from "@/lib/types";

type Row = Record<string, unknown> & { id: number; measured_on: string; notes: string | null };

function n(v: unknown): number | null {
  return toNum(v);
}

function req(v: unknown, label: string): number {
  const x = toNum(v);
  if (x === null) throw new Error(`請填寫${label}`);
  return x;
}

function mapRow(r: Row): InbodyMeasurement {
  return {
    id: Number(r.id),
    measuredOn: String(r.measured_on).slice(0, 10),
    smmKg: req(r.smm_kg, "骨骼肌量"),
    bodyFatMassKg: req(r.body_fat_mass_kg, "身體脂肪量"),
    pbf: req(r.pbf, "體脂率"),
    bmrKcal: req(r.bmr_kcal, "基礎代謝率"),
    visceralFatLevel: req(r.visceral_fat_level, "內臟脂肪等級"),
    weightKg: n(r.weight_kg),
    heightCm: n(r.height_cm),
    bmi: n(r.bmi),
    inbodyScore: n(r.inbody_score),
    tbwL: n(r.tbw_l),
    icwL: n(r.icw_l),
    ecwL: n(r.ecw_l),
    ecwTbw: n(r.ecw_tbw),
    proteinKg: n(r.protein_kg),
    mineralKg: n(r.mineral_kg),
    ffmKg: n(r.ffm_kg),
    smi: n(r.smi),
    whr: n(r.whr),
    rightArmLeanKg: n(r.right_arm_lean_kg),
    leftArmLeanKg: n(r.left_arm_lean_kg),
    trunkLeanKg: n(r.trunk_lean_kg),
    rightLegLeanKg: n(r.right_leg_lean_kg),
    leftLegLeanKg: n(r.left_leg_lean_kg),
    notes: r.notes ?? null,
  };
}

const SELECT = `id, measured_on, smm_kg, body_fat_mass_kg, pbf, bmr_kcal, visceral_fat_level,
  weight_kg, height_cm, bmi, inbody_score, tbw_l, icw_l, ecw_l, ecw_tbw,
  protein_kg, mineral_kg, ffm_kg, smi, whr,
  right_arm_lean_kg, left_arm_lean_kg, trunk_lean_kg, right_leg_lean_kg, left_leg_lean_kg,
  notes`;

export type InbodyInput = {
  id?: number;
  measuredOn: string;
  values: Partial<Record<InbodyFieldKey, number | null>>;
  notes?: string;
};

function parseDate(raw: string): string {
  const s = raw.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error("請選擇測量日期");
  const today = taipeiDateISO();
  if (s > today) throw new Error("測量日期不能是未來");
  return s;
}

function parseValues(values: InbodyInput["values"]) {
  const out: Record<string, number | null> = {};
  for (const field of INBODY_ALL_FIELDS) {
    const raw = values[field.key];
    if (raw === null || raw === undefined || (typeof raw === "number" && Number.isNaN(raw))) {
      if (field.required) throw new Error(`請填寫${field.zh}`);
      out[field.column] = null;
      continue;
    }
    const num = toNum(raw);
    if (num === null) {
      if (field.required) throw new Error(`請填寫${field.zh}`);
      out[field.column] = null;
      continue;
    }
    if (num < field.min || num > field.max) {
      throw new Error(`${field.zh} 請介於 ${field.min}–${field.max} ${field.unit}`.trim());
    }
    out[field.column] = num;
  }
  for (const field of INBODY_REQUIRED) {
    if (out[field.column] == null) throw new Error(`請填寫${field.zh}`);
  }
  return out;
}

export const listInbody = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<Row>(
      `select ${SELECT} from inbody_measurements
       where user_id = $1
       order by measured_on desc, id desc`,
      [context.userId],
    );
    return rows.map(mapRow);
  });

export const saveInbody = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: InbodyInput) => data)
  .handler(async ({ context, data }) => {
    const measuredOn = parseDate(data.measuredOn);
    const vals = parseValues(data.values);
    const notes = data.notes?.trim() ? data.notes.trim() : null;
    const sql = await getSql();

    const cols = INBODY_ALL_FIELDS.map((f) => f.column);
    const numbers = cols.map((c) => vals[c] ?? null);

    if (data.id) {
      const clash = await sql.query<{ id: number }>(
        `select id from inbody_measurements
         where user_id = $1 and measured_on = $2 and id <> $3 limit 1`,
        [context.userId, measuredOn, data.id],
      );
      if (clash[0]) throw new Error("這天已經有另一筆紀錄，請改那一筆");

      const own = await sql.query<{ id: number }>(
        `select id from inbody_measurements where id = $1 and user_id = $2`,
        [data.id, context.userId],
      );
      if (!own[0]) throw new Error("找不到這筆紀錄");

      const setSql = cols.map((c, i) => `${c} = $${i + 4}`).join(", ");
      const updated = await sql.query<Row>(
        `update inbody_measurements
         set measured_on = $3, ${setSql}, notes = $${cols.length + 4}, updated_at = now()
         where id = $1 and user_id = $2
         returning ${SELECT}`,
        [data.id, context.userId, measuredOn, ...numbers, notes],
      );
      return mapRow(updated[0]);
    }

    const existing = await sql.query<{ id: number }>(
      `select id from inbody_measurements
       where user_id = $1 and measured_on = $2 limit 1`,
      [context.userId, measuredOn],
    );
    if (existing[0]) {
      const setSql = cols.map((c, i) => `${c} = $${i + 3}`).join(", ");
      const updated = await sql.query<Row>(
        `update inbody_measurements
         set ${setSql}, notes = $${cols.length + 3}, updated_at = now()
         where id = $1 and user_id = $2
         returning ${SELECT}`,
        [existing[0].id, context.userId, ...numbers, notes],
      );
      return mapRow(updated[0]);
    }

    const colList = cols.join(", ");
    const placeholders = cols.map((_, i) => `$${i + 4}`).join(", ");
    const inserted = await sql.query<Row>(
      `insert into inbody_measurements
         (user_id, measured_on, ${colList}, notes)
       values ($1, $2, ${placeholders}, $3)
       returning ${SELECT}`,
      [context.userId, measuredOn, notes, ...numbers],
    );
    return mapRow(inserted[0]);
  });

export const deleteInbody = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: number }) => data)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql.query(
      `delete from inbody_measurements where id = $1 and user_id = $2`,
      [data.id, context.userId],
    );
    return { ok: true as const };
  });
