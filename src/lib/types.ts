import type { Measurement, TrainingTypeId } from "./constants";

export type Profile = {
  uluxId: string;
  email: string;
  nickname: string;
};

export type MuscleGroup = {
  id: number;
  slug: string;
  nameZh: string;
  nameEn: string;
};

export type Equipment = {
  id: number;
  slug: string;
  nameZh: string;
  nameEn: string;
};

export type Exercise = {
  id: number;
  slug: string | null;
  nameZh: string;
  nameEn: string;
  trainingType: TrainingTypeId | string;
  measurement: Measurement | string;
  isSystem: boolean;
  notes: string | null;
  muscles: MuscleGroup[];
  equipment: Equipment[];
};

export type WorkoutSet = {
  id: number;
  setNumber: number;
  weight: number | null;
  additionalWeight: number | null;
  isBodyweight: boolean;
  reps: number | null;
  durationSeconds: number | null;
  distanceM: number | null;
  notes: string | null;
};

export type WorkoutEntry = {
  id: number;
  exercise: Exercise;
  equipment: Equipment | null;
  sortOrder: number;
  notes: string | null;
  sets: WorkoutSet[];
};

export type WorkoutSession = {
  id: number;
  trainingType: string;
  startedAt: string;
  endedAt: string | null;
  notes: string | null;
  entries: WorkoutEntry[];
};

export type SessionSummary = {
  id: number;
  trainingType: string;
  startedAt: string;
  endedAt: string | null;
  notes: string | null;
  exerciseCount: number;
  setCount: number;
  title: string;
};

export type CalendarDay = {
  date: string;
  sessionCount: number;
};

export type PersonalRecord = {
  exerciseId: number;
  nameZh: string;
  nameEn: string;
  kind: "max_weight" | "est_1rm";
  value: number;
  reps: number | null;
  date: string;
};

export type MuscleShare = {
  slug: string;
  nameZh: string;
  nameEn: string;
  volume: number;
  share: number;
};

export type ProgressionPoint = {
  date: string;
  sessionId: number;
  maxWeight: number | null;
  est1rm: number | null;
  volume: number;
  bestSet: string;
};
