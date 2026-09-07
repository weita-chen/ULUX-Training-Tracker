export type InbodyFieldKey =
  | "smmKg"
  | "bodyFatMassKg"
  | "pbf"
  | "bmrKcal"
  | "visceralFatLevel"
  | "weightKg"
  | "heightCm"
  | "bmi"
  | "inbodyScore"
  | "tbwL"
  | "icwL"
  | "ecwL"
  | "ecwTbw"
  | "proteinKg"
  | "mineralKg"
  | "ffmKg"
  | "smi"
  | "whr"
  | "rightArmLeanKg"
  | "leftArmLeanKg"
  | "trunkLeanKg"
  | "rightLegLeanKg"
  | "leftLegLeanKg";

export type InbodyField = {
  key: InbodyFieldKey;
  column: string;
  zh: string;
  en: string;
  unit: string;
  required?: boolean;
  min: number;
  max: number;
  step: string;
};

export const INBODY_REQUIRED: InbodyField[] = [
  { key: "smmKg", column: "smm_kg", zh: "骨骼肌量", en: "SMM", unit: "kg", required: true, min: 5, max: 80, step: "0.1" },
  { key: "bodyFatMassKg", column: "body_fat_mass_kg", zh: "身體脂肪量", en: "Body Fat Mass", unit: "kg", required: true, min: 0.5, max: 80, step: "0.1" },
  { key: "pbf", column: "pbf", zh: "體脂率", en: "PBF", unit: "%", required: true, min: 2, max: 70, step: "0.1" },
  { key: "bmrKcal", column: "bmr_kcal", zh: "基礎代謝率", en: "BMR", unit: "kcal", required: true, min: 700, max: 4000, step: "1" },
  { key: "visceralFatLevel", column: "visceral_fat_level", zh: "內臟脂肪等級", en: "Visceral Fat Level", unit: "級", required: true, min: 1, max: 30, step: "0.5" },
];

export const INBODY_COMMON: InbodyField[] = [
  { key: "weightKg", column: "weight_kg", zh: "體重", en: "Weight", unit: "kg", min: 20, max: 300, step: "0.1" },
  { key: "heightCm", column: "height_cm", zh: "身高", en: "Height", unit: "cm", min: 100, max: 230, step: "0.1" },
  { key: "bmi", column: "bmi", zh: "BMI", en: "BMI", unit: "", min: 10, max: 60, step: "0.1" },
  { key: "inbodyScore", column: "inbody_score", zh: "InBody 分數", en: "InBody Score", unit: "分", min: 0, max: 100, step: "1" },
];

export const INBODY_COMPOSITION: InbodyField[] = [
  { key: "tbwL", column: "tbw_l", zh: "總體水分", en: "TBW", unit: "L", min: 10, max: 80, step: "0.1" },
  { key: "icwL", column: "icw_l", zh: "細胞內水分", en: "ICW", unit: "L", min: 5, max: 50, step: "0.1" },
  { key: "ecwL", column: "ecw_l", zh: "細胞外水分", en: "ECW", unit: "L", min: 3, max: 40, step: "0.1" },
  { key: "ecwTbw", column: "ecw_tbw", zh: "細胞外水分比", en: "ECW/TBW", unit: "", min: 0.2, max: 0.5, step: "0.001" },
  { key: "proteinKg", column: "protein_kg", zh: "蛋白質", en: "Protein", unit: "kg", min: 3, max: 30, step: "0.1" },
  { key: "mineralKg", column: "mineral_kg", zh: "無機鹽", en: "Minerals", unit: "kg", min: 1, max: 10, step: "0.01" },
  { key: "ffmKg", column: "ffm_kg", zh: "去脂體重", en: "FFM", unit: "kg", min: 15, max: 120, step: "0.1" },
  { key: "smi", column: "smi", zh: "骨骼肌指數", en: "SMI", unit: "kg/m²", min: 3, max: 15, step: "0.1" },
  { key: "whr", column: "whr", zh: "腰臀比", en: "WHR", unit: "", min: 0.5, max: 1.5, step: "0.01" },
];

export const INBODY_SEGMENTAL: InbodyField[] = [
  { key: "rightArmLeanKg", column: "right_arm_lean_kg", zh: "右上肢肌肉", en: "Right Arm", unit: "kg", min: 0.5, max: 10, step: "0.01" },
  { key: "leftArmLeanKg", column: "left_arm_lean_kg", zh: "左上肢肌肉", en: "Left Arm", unit: "kg", min: 0.5, max: 10, step: "0.01" },
  { key: "trunkLeanKg", column: "trunk_lean_kg", zh: "軀幹肌肉", en: "Trunk", unit: "kg", min: 5, max: 50, step: "0.1" },
  { key: "rightLegLeanKg", column: "right_leg_lean_kg", zh: "右下肢肌肉", en: "Right Leg", unit: "kg", min: 2, max: 20, step: "0.1" },
  { key: "leftLegLeanKg", column: "left_leg_lean_kg", zh: "左下肢肌肉", en: "Left Leg", unit: "kg", min: 2, max: 20, step: "0.1" },
];

export const INBODY_ALL_FIELDS: InbodyField[] = [
  ...INBODY_REQUIRED,
  ...INBODY_COMMON,
  ...INBODY_COMPOSITION,
  ...INBODY_SEGMENTAL,
];

export const INBODY_CHART_METRICS: { key: InbodyFieldKey; zh: string }[] = [
  { key: "smmKg", zh: "骨骼肌量" },
  { key: "pbf", zh: "體脂率" },
  { key: "bodyFatMassKg", zh: "脂肪量" },
  { key: "visceralFatLevel", zh: "內臟脂肪" },
  { key: "weightKg", zh: "體重" },
  { key: "inbodyScore", zh: "分數" },
];

export const LOWER_IS_BETTER = new Set<InbodyFieldKey>([
  "pbf",
  "bodyFatMassKg",
  "visceralFatLevel",
  "whr",
  "ecwTbw",
]);
