-- Per-user InBody body-composition logs

create table if not exists inbody_measurements (
  id serial primary key,
  user_id text not null,
  measured_on date not null,
  smm_kg numeric not null,
  body_fat_mass_kg numeric not null,
  pbf numeric not null,
  bmr_kcal numeric not null,
  visceral_fat_level numeric not null,
  weight_kg numeric,
  height_cm numeric,
  bmi numeric,
  inbody_score numeric,
  tbw_l numeric,
  icw_l numeric,
  ecw_l numeric,
  ecw_tbw numeric,
  protein_kg numeric,
  mineral_kg numeric,
  ffm_kg numeric,
  smi numeric,
  whr numeric,
  right_arm_lean_kg numeric,
  left_arm_lean_kg numeric,
  trunk_lean_kg numeric,
  right_leg_lean_kg numeric,
  left_leg_lean_kg numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, measured_on)
);

create index if not exists inbody_user_date_idx
  on inbody_measurements (user_id, measured_on desc);
