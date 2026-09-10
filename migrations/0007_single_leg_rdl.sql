insert into exercises (slug, name_zh, name_en, training_type, measurement, is_system) values
  ('single-leg-rdl', '單腳 RDL', 'Single-leg RDL', 'weight', 'weight_reps', true)
on conflict (slug) do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e
join muscle_groups m on m.slug = 'glutes_legs'
where e.slug = 'single-leg-rdl'
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e
join equipment q on q.slug in ('bodyweight', 'dumbbell', 'kettlebell')
where e.slug = 'single-leg-rdl'
on conflict do nothing;
