import { toNum } from "@/lib/format";
import type {
  Equipment,
  Exercise,
  MuscleGroup,
  WorkoutEntry,
  WorkoutSession,
  WorkoutSet,
} from "@/lib/types";

export function mapMuscle(r: {
  id: number;
  slug: string;
  name_zh: string;
  name_en: string;
}): MuscleGroup {
  return { id: r.id, slug: r.slug, nameZh: r.name_zh, nameEn: r.name_en };
}

export function mapEquipment(r: {
  id: number;
  slug: string;
  name_zh: string;
  name_en: string;
}): Equipment {
  return { id: r.id, slug: r.slug, nameZh: r.name_zh, nameEn: r.name_en };
}

export function mapExercise(r: {
  id: number;
  slug: string | null;
  name_zh: string;
  name_en: string;
  training_type: string;
  measurement: string;
  is_system: boolean;
  notes: string | null;
  muscles?: MuscleGroup[];
  equipment?: Equipment[];
}): Exercise {
  return {
    id: r.id,
    slug: r.slug,
    nameZh: r.name_zh,
    nameEn: r.name_en,
    trainingType: r.training_type,
    measurement: r.measurement,
    isSystem: r.is_system,
    notes: r.notes,
    muscles: r.muscles ?? [],
    equipment: r.equipment ?? [],
  };
}

export function mapSet(r: {
  id: number;
  set_number: number;
  weight: unknown;
  additional_weight: unknown;
  is_bodyweight: boolean;
  reps: number | null;
  duration_seconds: number | null;
  distance_m: unknown;
  notes: string | null;
}): WorkoutSet {
  return {
    id: r.id,
    setNumber: r.set_number,
    weight: toNum(r.weight),
    additionalWeight: toNum(r.additional_weight),
    isBodyweight: r.is_bodyweight,
    reps: r.reps,
    durationSeconds: r.duration_seconds,
    distanceM: toNum(r.distance_m),
    notes: r.notes,
  };
}

export function assembleSession(
  session: {
    id: number;
    training_type: string;
    started_at: string;
    ended_at: string | null;
    notes: string | null;
  },
  entries: WorkoutEntry[],
): WorkoutSession {
  return {
    id: session.id,
    trainingType: session.training_type,
    startedAt: session.started_at,
    endedAt: session.ended_at,
    notes: session.notes,
    entries,
  };
}
