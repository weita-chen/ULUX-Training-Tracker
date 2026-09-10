-- Power category, kettlebell on every dumbbell lift, and new movements.

insert into muscle_groups (slug, name_zh, name_en) values
  ('power', '爆發力', 'Power')
on conflict (slug) do nothing;

insert into equipment (slug, name_zh, name_en) values
  ('medicine_ball', '藥球', 'Medicine Ball')
on conflict (slug) do nothing;

insert into exercises (slug, name_zh, name_en, training_type, measurement, is_system) values
  ('roman-chair', '羅馬椅', 'Roman Chair', 'weight', 'bodyweight', true),
  ('turkish-get-up', '土耳其站立', 'Turkish Get-up', 'weight', 'bodyweight', true),
  ('box-jump', '跳箱訓練', 'Box Jump', 'weight', 'bodyweight', true),
  ('jump-squat', '深蹲跳', 'Jump Squat', 'weight', 'bodyweight', true),
  ('jump-lunge', '弓箭步跳', 'Jump Lunge', 'weight', 'bodyweight', true),
  ('medicine-ball-throw', '拋藥球', 'Medicine Ball Throw', 'weight', 'weight_reps', true),
  ('olympic-clean', '奧林匹克挺舉', 'Clean', 'weight', 'weight_reps', true),
  ('olympic-snatch', '奧林匹克抓舉', 'Snatch', 'weight', 'weight_reps', true)
on conflict (slug) do nothing;

-- Hip thrust is commonly loaded with a dumbbell or kettlebell.
insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e
join equipment q on q.slug = 'dumbbell'
where e.slug = 'hip-thrust'
on conflict do nothing;

-- Any lift that already has dumbbell also gets kettlebell.
insert into exercise_equipment (exercise_id, equipment_id)
select ee.exercise_id, kb.id
from exercise_equipment ee
join equipment db on db.id = ee.equipment_id and db.slug = 'dumbbell'
join equipment kb on kb.slug = 'kettlebell'
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e
join equipment q on q.slug = 'bodyweight'
where e.slug in (
  'roman-chair','turkish-get-up','box-jump','jump-squat','jump-lunge'
)
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e
join equipment q on q.slug = 'kettlebell'
where e.slug in ('turkish-get-up','jump-squat','jump-lunge','olympic-clean','olympic-snatch')
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e
join equipment q on q.slug = 'dumbbell'
where e.slug in ('jump-squat','jump-lunge','olympic-clean','olympic-snatch')
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e
join equipment q on q.slug = 'barbell'
where e.slug in ('jump-squat','olympic-clean','olympic-snatch')
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e
join equipment q on q.slug = 'medicine_ball'
where e.slug = 'medicine-ball-throw'
on conflict do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e
join muscle_groups m on m.slug = 'core'
where e.slug = 'roman-chair'
on conflict do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e
join muscle_groups m on m.slug = 'glutes_legs'
where e.slug = 'roman-chair'
on conflict do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e
join muscle_groups m on m.slug = 'other'
where e.slug = 'turkish-get-up'
on conflict do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e
join muscle_groups m on m.slug = 'power'
where e.slug in (
  'kettlebell-swing','box-jump','jump-squat','jump-lunge',
  'medicine-ball-throw','olympic-clean','olympic-snatch'
)
on conflict do nothing;

delete from exercise_muscles em
using exercises e, muscle_groups m
where em.exercise_id = e.id
  and em.muscle_group_id = m.id
  and e.slug = 'kettlebell-swing'
  and m.slug = 'back';
