export const TZ = "Asia/Taipei";

export const TRAINING_TYPES = [
  { id: "weight", zh: "重量訓練", en: "Weight Training" },
  { id: "cardio", zh: "有氧", en: "Cardio" },
  { id: "ball", zh: "球類運動", en: "Ball Sports" },
  { id: "other", zh: "其他運動", en: "Other Exercise" },
] as const;

export type TrainingTypeId = (typeof TRAINING_TYPES)[number]["id"];

export const MEASUREMENTS = [
  "weight_reps",
  "bodyweight",
  "duration",
  "distance_duration",
] as const;

export type Measurement = (typeof MEASUREMENTS)[number];

export function trainingTypeLabel(id: string): string {
  return TRAINING_TYPES.find((t) => t.id === id)?.zh ?? id;
}
