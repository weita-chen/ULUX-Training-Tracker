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

export const MEASUREMENT_OPTIONS: { id: Measurement; zh: string; hint: string }[] = [
  { id: "weight_reps", zh: "重量 × 次數", hint: "臥推、深蹲" },
  { id: "bodyweight", zh: "徒手次數", hint: "可加外部負重" },
  { id: "duration", zh: "時間", hint: "球類、瑜珈、HIIT" },
  { id: "distance_duration", zh: "距離 + 時間", hint: "跑步、騎車" },
];

export function trainingTypeLabel(id: string): string {
  return TRAINING_TYPES.find((t) => t.id === id)?.zh ?? id;
}

export function defaultMeasurement(type: string): Measurement {
  if (type === "weight") return "weight_reps";
  if (type === "cardio") return "duration";
  return "duration";
}
