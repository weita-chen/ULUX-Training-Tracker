-- System catalog: muscle groups, equipment, exercises, relationships

insert into muscle_groups (slug, name_zh, name_en) values
  ('chest', '胸', 'Chest'),
  ('back', '背', 'Back'),
  ('shoulders', '肩', 'Shoulders'),
  ('glutes_legs', '臀與腿', 'Glutes & Legs'),
  ('arms', '手臂', 'Arms'),
  ('core', '核心', 'Core'),
  ('power', '爆發力', 'Power'),
  ('other', '其他', 'Other')
on conflict (slug) do nothing;

insert into equipment (slug, name_zh, name_en) values
  ('bodyweight', '徒手', 'Bodyweight'),
  ('barbell', '槓鈴', 'Barbell'),
  ('dumbbell', '啞鈴', 'Dumbbell'),
  ('kettlebell', '壺鈴', 'Kettlebell'),
  ('cable', '繩索', 'Cable'),
  ('hex_bar', '六角槓', 'Hex / Trap Bar'),
  ('machine', '機械', 'Machine'),
  ('smith', '史密斯', 'Smith Machine'),
  ('band', '彈力帶', 'Band'),
  ('medicine_ball', '藥球', 'Medicine Ball')
on conflict (slug) do nothing;

insert into exercises (slug, name_zh, name_en, training_type, measurement, is_system) values
  ('flat-bench-press', '平胸臥推', 'Flat Bench Press', 'weight', 'weight_reps', true),
  ('incline-bench-press', '上胸臥推', 'Incline Bench Press', 'weight', 'weight_reps', true),
  ('decline-bench-press', '下胸臥推', 'Decline Bench Press', 'weight', 'weight_reps', true),
  ('cable-fly', '繩索夾胸', 'Cable Fly', 'weight', 'weight_reps', true),
  ('dumbbell-fly', '啞鈴飛鳥', 'Dumbbell Fly', 'weight', 'weight_reps', true),
  ('chest-press-machine', '機械胸推', 'Chest Press', 'weight', 'weight_reps', true),
  ('push-up', '伏地挺身', 'Push-up', 'weight', 'bodyweight', true),
  ('dip', '雙槓撐體', 'Dip', 'weight', 'bodyweight', true),
  ('pull-up', '引體向上', 'Pull-up', 'weight', 'bodyweight', true),
  ('chin-up', '反手引體', 'Chin-up', 'weight', 'bodyweight', true),
  ('lat-pulldown', '滑輪下拉', 'Lat Pulldown', 'weight', 'weight_reps', true),
  ('seated-cable-row', '坐姿划船', 'Seated Cable Row', 'weight', 'weight_reps', true),
  ('barbell-row', '槓鈴划船', 'Barbell Row', 'weight', 'weight_reps', true),
  ('dumbbell-row', '單臂划船', 'One-arm Row', 'weight', 'weight_reps', true),
  ('face-pull', '臉拉', 'Face Pull', 'weight', 'weight_reps', true),
  ('straight-arm-pulldown', '直臂下拉', 'Straight-arm Pulldown', 'weight', 'weight_reps', true),
  ('deadlift', '硬舉', 'Deadlift', 'weight', 'weight_reps', true),
  ('rack-pull', '架上拉', 'Rack Pull', 'weight', 'weight_reps', true),
  ('overhead-press', '肩推', 'Overhead Press', 'weight', 'weight_reps', true),
  ('lateral-raise', '側平舉', 'Lateral Raise', 'weight', 'weight_reps', true),
  ('front-raise', '前平舉', 'Front Raise', 'weight', 'weight_reps', true),
  ('reverse-fly', '反向飛鳥', 'Reverse Fly', 'weight', 'weight_reps', true),
  ('shrug', '聳肩', 'Shrug', 'weight', 'weight_reps', true),
  ('squat', '深蹲', 'Squat', 'weight', 'weight_reps', true),
  ('front-squat', '前蹲', 'Front Squat', 'weight', 'weight_reps', true),
  ('romanian-deadlift', '羅馬尼亞硬舉', 'Romanian Deadlift', 'weight', 'weight_reps', true),
  ('single-leg-rdl', '單腳 RDL', 'Single-leg RDL', 'weight', 'weight_reps', true),
  ('leg-press', '腿推', 'Leg Press', 'weight', 'weight_reps', true),
  ('hip-thrust', '臀推', 'Hip Thrust', 'weight', 'weight_reps', true),
  ('lunge', '弓箭步', 'Lunge', 'weight', 'weight_reps', true),
  ('bulgarian-split-squat', '保加利亞分腿蹲', 'Bulgarian Split Squat', 'weight', 'weight_reps', true),
  ('leg-extension', '腿伸展', 'Leg Extension', 'weight', 'weight_reps', true),
  ('leg-curl', '腿彎舉', 'Leg Curl', 'weight', 'weight_reps', true),
  ('calf-raise', '提踵', 'Calf Raise', 'weight', 'weight_reps', true),
  ('goblet-squat', '高腳杯深蹲', 'Goblet Squat', 'weight', 'weight_reps', true),
  ('barbell-curl', '槓鈴彎舉', 'Barbell Curl', 'weight', 'weight_reps', true),
  ('dumbbell-curl', '啞鈴彎舉', 'Dumbbell Curl', 'weight', 'weight_reps', true),
  ('hammer-curl', '錘式彎舉', 'Hammer Curl', 'weight', 'weight_reps', true),
  ('triceps-pushdown', '繩索下壓', 'Triceps Pushdown', 'weight', 'weight_reps', true),
  ('overhead-triceps', '過頭臂屈伸', 'Overhead Triceps Extension', 'weight', 'weight_reps', true),
  ('skull-crusher', '仰臥臂屈伸', 'Skull Crusher', 'weight', 'weight_reps', true),
  ('close-grip-bench', '窄握臥推', 'Close-Grip Bench Press', 'weight', 'weight_reps', true),
  ('crunch', '捲腹', 'Crunch', 'weight', 'bodyweight', true),
  ('hanging-leg-raise', '懸垂舉腿', 'Hanging Leg Raise', 'weight', 'bodyweight', true),
  ('plank', '棒式', 'Plank', 'weight', 'duration', true),
  ('russian-twist', '俄式轉體', 'Russian Twist', 'weight', 'weight_reps', true),
  ('ab-wheel', '滾輪', 'Ab Wheel', 'weight', 'bodyweight', true),
  ('cable-crunch', '繩索捲腹', 'Cable Crunch', 'weight', 'weight_reps', true),
  ('kettlebell-swing', '壺鈴擺盪', 'Kettlebell Swing', 'weight', 'weight_reps', true),
  ('roman-chair', '羅馬椅', 'Roman Chair', 'weight', 'bodyweight', true),
  ('turkish-get-up', '土耳其站立', 'Turkish Get-up', 'weight', 'bodyweight', true),
  ('box-jump', '跳箱訓練', 'Box Jump', 'weight', 'bodyweight', true),
  ('jump-squat', '深蹲跳', 'Jump Squat', 'weight', 'bodyweight', true),
  ('jump-lunge', '弓箭步跳', 'Jump Lunge', 'weight', 'bodyweight', true),
  ('medicine-ball-throw', '拋藥球', 'Medicine Ball Throw', 'weight', 'weight_reps', true),
  ('olympic-clean', '奧林匹克挺舉', 'Clean', 'weight', 'weight_reps', true),
  ('olympic-snatch', '奧林匹克抓舉', 'Snatch', 'weight', 'weight_reps', true),
  ('run', '跑步', 'Running', 'cardio', 'distance_duration', true),
  ('cycle', '騎車', 'Cycling', 'cardio', 'distance_duration', true),
  ('swim', '游泳', 'Swimming', 'cardio', 'distance_duration', true),
  ('row-erg', '划船機', 'Rowing', 'cardio', 'distance_duration', true),
  ('walk', '步行', 'Walking', 'cardio', 'distance_duration', true),
  ('jump-rope', '跳繩', 'Jump Rope', 'cardio', 'duration', true),
  ('elliptical', '橢圓機', 'Elliptical', 'cardio', 'duration', true),
  ('tennis', '網球', 'Tennis', 'ball', 'duration', true),
  ('basketball', '籃球', 'Basketball', 'ball', 'duration', true),
  ('badminton', '羽球', 'Badminton', 'ball', 'duration', true),
  ('volleyball', '排球', 'Volleyball', 'ball', 'duration', true),
  ('soccer', '足球', 'Soccer', 'ball', 'duration', true),
  ('table-tennis', '桌球', 'Table Tennis', 'ball', 'duration', true),
  ('stretch', '伸展', 'Stretching', 'other', 'duration', true),
  ('yoga', '瑜珈', 'Yoga', 'other', 'duration', true),
  ('climb', '攀岩', 'Climbing', 'other', 'duration', true),
  ('foam-roll', '滾筒', 'Foam Roll', 'other', 'duration', true)
on conflict (slug) do nothing;

-- Muscles
insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e join muscle_groups m on m.slug = 'chest'
where e.slug in ('flat-bench-press','incline-bench-press','decline-bench-press','cable-fly','dumbbell-fly','chest-press-machine','push-up','dip','close-grip-bench')
on conflict do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e join muscle_groups m on m.slug = 'back'
where e.slug in ('pull-up','chin-up','lat-pulldown','seated-cable-row','barbell-row','dumbbell-row','face-pull','straight-arm-pulldown','deadlift','rack-pull','romanian-deadlift','shrug')
on conflict do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e join muscle_groups m on m.slug = 'shoulders'
where e.slug in ('face-pull','overhead-press','lateral-raise','front-raise','reverse-fly','shrug')
on conflict do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e join muscle_groups m on m.slug = 'glutes_legs'
where e.slug in ('deadlift','rack-pull','squat','front-squat','romanian-deadlift','single-leg-rdl','leg-press','hip-thrust','lunge','bulgarian-split-squat','leg-extension','leg-curl','calf-raise','goblet-squat','kettlebell-swing','roman-chair')
on conflict do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e join muscle_groups m on m.slug = 'arms'
where e.slug in ('push-up','dip','pull-up','chin-up','barbell-curl','dumbbell-curl','hammer-curl','triceps-pushdown','overhead-triceps','skull-crusher','close-grip-bench')
on conflict do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e join muscle_groups m on m.slug = 'core'
where e.slug in ('crunch','hanging-leg-raise','plank','russian-twist','ab-wheel','cable-crunch','push-up','roman-chair')
on conflict do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e join muscle_groups m on m.slug = 'power'
where e.slug in (
  'kettlebell-swing','box-jump','jump-squat','jump-lunge',
  'medicine-ball-throw','olympic-clean','olympic-snatch'
)
on conflict do nothing;

insert into exercise_muscles (exercise_id, muscle_group_id)
select e.id, m.id from exercises e join muscle_groups m on m.slug = 'other'
where e.slug in ('turkish-get-up')
on conflict do nothing;

-- Equipment
insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e join equipment q on q.slug = 'barbell'
where e.slug in ('flat-bench-press','incline-bench-press','decline-bench-press','barbell-row','deadlift','rack-pull','overhead-press','shrug','squat','front-squat','romanian-deadlift','hip-thrust','lunge','calf-raise','barbell-curl','skull-crusher','close-grip-bench','jump-squat','olympic-clean','olympic-snatch')
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e join equipment q on q.slug = 'dumbbell'
where e.slug in ('flat-bench-press','incline-bench-press','decline-bench-press','dumbbell-fly','dumbbell-row','overhead-press','lateral-raise','front-raise','reverse-fly','shrug','romanian-deadlift','single-leg-rdl','hip-thrust','lunge','bulgarian-split-squat','goblet-squat','dumbbell-curl','hammer-curl','overhead-triceps','skull-crusher','russian-twist','jump-squat','jump-lunge','olympic-clean','olympic-snatch')
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e join equipment q on q.slug = 'cable'
where e.slug in ('cable-fly','lat-pulldown','seated-cable-row','face-pull','straight-arm-pulldown','lateral-raise','front-raise','reverse-fly','triceps-pushdown','overhead-triceps','cable-crunch')
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e join equipment q on q.slug = 'machine'
where e.slug in ('chest-press-machine','lat-pulldown','overhead-press','lateral-raise','reverse-fly','squat','leg-press','hip-thrust','leg-extension','leg-curl','calf-raise')
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e join equipment q on q.slug = 'smith'
where e.slug in ('flat-bench-press','incline-bench-press','squat','overhead-press')
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e join equipment q on q.slug = 'hex_bar'
where e.slug in ('deadlift')
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e join equipment q on q.slug = 'bodyweight'
where e.slug in ('push-up','dip','pull-up','chin-up','squat','lunge','bulgarian-split-squat','calf-raise','crunch','hanging-leg-raise','plank','russian-twist','ab-wheel','roman-chair','turkish-get-up','box-jump','jump-squat','jump-lunge','single-leg-rdl')
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select ee.exercise_id, kb.id
from exercise_equipment ee
join equipment db on db.id = ee.equipment_id and db.slug = 'dumbbell'
join equipment kb on kb.slug = 'kettlebell'
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e join equipment q on q.slug = 'kettlebell'
where e.slug in ('kettlebell-swing','turkish-get-up')
on conflict do nothing;

insert into exercise_equipment (exercise_id, equipment_id)
select e.id, q.id from exercises e join equipment q on q.slug = 'medicine_ball'
where e.slug = 'medicine-ball-throw'
on conflict do nothing;
