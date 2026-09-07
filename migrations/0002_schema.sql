-- ULUX core schema

create table if not exists profiles (
  id serial primary key,
  user_id text not null unique,
  ulux_id text not null unique,
  pin_hash text not null,
  email text not null,
  nickname text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists profiles_email_lower_idx on profiles (lower(email));

create table if not exists muscle_groups (
  id serial primary key,
  slug text not null unique,
  name_zh text not null,
  name_en text not null
);

create table if not exists equipment (
  id serial primary key,
  slug text not null unique,
  name_zh text not null,
  name_en text not null
);

create table if not exists exercises (
  id serial primary key,
  slug text,
  name_zh text not null,
  name_en text not null default '',
  training_type text not null,
  measurement text not null,
  is_system boolean not null default false,
  owner_user_id text,
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists exercises_slug_idx on exercises (slug);
create index if not exists exercises_owner_idx on exercises (owner_user_id);

create table if not exists exercise_muscles (
  exercise_id int not null references exercises(id) on delete cascade,
  muscle_group_id int not null references muscle_groups(id) on delete cascade,
  primary key (exercise_id, muscle_group_id)
);

create table if not exists exercise_equipment (
  exercise_id int not null references exercises(id) on delete cascade,
  equipment_id int not null references equipment(id) on delete cascade,
  primary key (exercise_id, equipment_id)
);

create table if not exists workout_sessions (
  id serial primary key,
  user_id text not null,
  training_type text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists workout_sessions_user_started_idx on workout_sessions (user_id, started_at desc);

create table if not exists workout_entries (
  id serial primary key,
  session_id int not null references workout_sessions(id) on delete cascade,
  exercise_id int not null references exercises(id),
  equipment_id int references equipment(id),
  sort_order int not null default 0,
  notes text
);
create index if not exists workout_entries_session_idx on workout_entries (session_id, sort_order);

create table if not exists workout_sets (
  id serial primary key,
  entry_id int not null references workout_entries(id) on delete cascade,
  set_number int not null,
  weight numeric,
  additional_weight numeric,
  is_bodyweight boolean not null default false,
  reps int,
  duration_seconds int,
  distance_m numeric,
  notes text
);
create index if not exists workout_sets_entry_idx on workout_sets (entry_id, set_number);
