import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C58uFI_W.mjs";
import { h as trainingTypeLabel, p as taipeiDateISO } from "./format-BsGHnvak.mjs";
import { r as getSql } from "./db-DFFg8ioj.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { a as mapSet, i as mapMuscle, n as mapEquipment, r as mapExercise, t as assembleSession } from "./map-gImjvydL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workouts-DdNYcgyA.js
function sessionTitle(trainingType, startedAt) {
	const d = new Date(startedAt);
	const date = new Intl.DateTimeFormat("zh-Hant", {
		timeZone: "Asia/Taipei",
		month: "numeric",
		day: "numeric"
	}).format(d);
	const hour = Number(new Intl.DateTimeFormat("en-US", {
		timeZone: "Asia/Taipei",
		hour: "numeric",
		hourCycle: "h23"
	}).format(d));
	const part = hour < 12 ? "上午" : hour < 18 ? "下午" : "晚上";
	return `${trainingTypeLabel(trainingType)} · ${date} ${part}`;
}
async function loadEntries(sql, sessionIds, userId) {
	const out = /* @__PURE__ */ new Map();
	if (sessionIds.length === 0) return out;
	const placeholders = sessionIds.map((_, i) => `$${i + 1}`).join(",");
	const entries = await sql.query(`select e.id, e.session_id, e.sort_order, e.notes, e.equipment_id,
            q.slug as eq_slug, q.name_zh as eq_zh, q.name_en as eq_en,
            x.id as exercise_id, x.slug, x.name_zh, x.name_en, x.training_type,
            x.measurement, x.is_system, x.notes as ex_notes
     from workout_entries e
     join workout_sessions s on s.id = e.session_id
     join exercises x on x.id = e.exercise_id
     left join equipment q on q.id = e.equipment_id
     where s.user_id = $${sessionIds.length + 1}
       and e.session_id in (${placeholders})
     order by e.sort_order, e.id`, [...sessionIds, userId]);
	const entryIds = entries.map((e) => e.id);
	const sets = entryIds.length === 0 ? [] : await sql.query(`select id, entry_id, set_number, weight, additional_weight, is_bodyweight,
                  reps, duration_seconds, distance_m, notes
           from workout_sets
           where entry_id = any($1::int[])
           order by set_number, id`, [entryIds]);
	const setsByEntry = /* @__PURE__ */ new Map();
	for (const s of sets) {
		const list = setsByEntry.get(s.entry_id) ?? [];
		list.push(mapSet(s));
		setsByEntry.set(s.entry_id, list);
	}
	const exerciseIds = [...new Set(entries.map((e) => e.exercise_id))];
	const muscles = exerciseIds.length === 0 ? [] : await sql.query(`select em.exercise_id, g.id, g.slug, g.name_zh, g.name_en
           from exercise_muscles em
           join muscle_groups g on g.id = em.muscle_group_id
           where em.exercise_id = any($1::int[])`, [exerciseIds]);
	const eqs = exerciseIds.length === 0 ? [] : await sql.query(`select ee.exercise_id, q.id, q.slug, q.name_zh, q.name_en
           from exercise_equipment ee
           join equipment q on q.id = ee.equipment_id
           where ee.exercise_id = any($1::int[])`, [exerciseIds]);
	const musclesByEx = /* @__PURE__ */ new Map();
	for (const m of muscles) {
		const list = musclesByEx.get(m.exercise_id) ?? [];
		list.push(mapMuscle(m));
		musclesByEx.set(m.exercise_id, list);
	}
	const eqByEx = /* @__PURE__ */ new Map();
	for (const e of eqs) {
		const list = eqByEx.get(e.exercise_id) ?? [];
		list.push(mapEquipment(e));
		eqByEx.set(e.exercise_id, list);
	}
	for (const e of entries) {
		const exercise = mapExercise({
			id: e.exercise_id,
			slug: e.slug,
			name_zh: e.name_zh,
			name_en: e.name_en,
			training_type: e.training_type,
			measurement: e.measurement,
			is_system: e.is_system,
			notes: e.ex_notes,
			muscles: musclesByEx.get(e.exercise_id) ?? [],
			equipment: eqByEx.get(e.exercise_id) ?? []
		});
		const equipment = e.equipment_id && e.eq_slug && e.eq_zh && e.eq_en ? mapEquipment({
			id: e.equipment_id,
			slug: e.eq_slug,
			name_zh: e.eq_zh,
			name_en: e.eq_en
		}) : null;
		const entry = {
			id: e.id,
			exercise,
			equipment,
			sortOrder: e.sort_order,
			notes: e.notes,
			sets: setsByEntry.get(e.id) ?? []
		};
		const list = out.get(e.session_id) ?? [];
		list.push(entry);
		out.set(e.session_id, list);
	}
	return out;
}
async function assertSession(sql, sessionId, userId) {
	const rows = await sql`
    select id, training_type, started_at, ended_at, notes
    from workout_sessions where id = ${sessionId} and user_id = ${userId}
    limit 1
  `;
	if (!rows[0]) throw new Error("找不到這筆訓練");
	return rows[0];
}
var listSessions_createServerFn_handler = createServerRpc({
	id: "eaa1473219507ae27eb825e06e26d95a3e9955a21fc1400f548029f1d4d94b67",
	name: "listSessions",
	filename: "src/lib/api/workouts.ts"
}, (opts) => listSessions.__executeServer(opts));
var listSessions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(listSessions_createServerFn_handler, async ({ context, data }) => {
	const rows = await (await getSql())`
      select s.id, s.training_type, s.started_at, s.ended_at, s.notes,
             count(distinct e.id)::int as exercise_count,
             count(st.id)::int as set_count
      from workout_sessions s
      left join workout_entries e on e.session_id = s.id
      left join workout_sets st on st.entry_id = e.id
      where s.user_id = ${context.userId}
      group by s.id
      order by s.started_at desc
      limit 200
    `;
	const from = data.from;
	const to = data.to;
	return rows.filter((r) => {
		const iso = taipeiDateISO(new Date(r.started_at));
		if (from && iso < from) return false;
		if (to && iso > to) return false;
		return true;
	}).map((r) => ({
		id: r.id,
		trainingType: r.training_type,
		startedAt: r.started_at,
		endedAt: r.ended_at,
		notes: r.notes,
		exerciseCount: r.exercise_count,
		setCount: r.set_count,
		title: sessionTitle(r.training_type, r.started_at)
	}));
});
var calendarMonth_createServerFn_handler = createServerRpc({
	id: "6df3220477de98d95c21e5f9a4039fb56c68572011616677d468fe899f17e0d4",
	name: "calendarMonth",
	filename: "src/lib/api/workouts.ts"
}, (opts) => calendarMonth.__executeServer(opts));
var calendarMonth = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(calendarMonth_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const month = String(data.month).padStart(2, "0");
	const start = `${data.year}-${month}-01`;
	const endMonth = data.month === 12 ? 1 : data.month + 1;
	const end = `${data.month === 12 ? data.year + 1 : data.year}-${String(endMonth).padStart(2, "0")}-01`;
	return (await sql`
      select to_char(started_at at time zone 'Asia/Taipei', 'YYYY-MM-DD') as date,
             count(*)::int as n
      from workout_sessions
      where user_id = ${context.userId}
        and started_at >= ${start}::date
        and started_at < ${end}::date
      group by 1
    `).map((r) => ({
		date: r.date,
		sessionCount: r.n
	}));
});
var getSession_createServerFn_handler = createServerRpc({
	id: "fee2070a6197e5d785793e574a561b95d0382bff30cd93fa9dd91d316626d484",
	name: "getSession",
	filename: "src/lib/api/workouts.ts"
}, (opts) => getSession.__executeServer(opts));
var getSession = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(getSession_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const row = await assertSession(sql, data.id, context.userId);
	const entries = await loadEntries(sql, [row.id], context.userId);
	return assembleSession(row, entries.get(row.id) ?? []);
});
var createSession_createServerFn_handler = createServerRpc({
	id: "cc609bca1b547045e9fdb8b7f76b9dbc8aa76cee372b7c30d8290fa3949bfa9f",
	name: "createSession",
	filename: "src/lib/api/workouts.ts"
}, (opts) => createSession.__executeServer(opts));
var createSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSession_createServerFn_handler, async ({ context, data }) => {
	return { id: (await (await getSql())`
      insert into workout_sessions (user_id, training_type)
      values (${context.userId}, ${data.trainingType})
      returning id
    `)[0].id };
});
var updateSession_createServerFn_handler = createServerRpc({
	id: "812e9a34fd2b43eaf4d330dcd578563d234fc9a27dbc00907d1ef934aabd2a3e",
	name: "updateSession",
	filename: "src/lib/api/workouts.ts"
}, (opts) => updateSession.__executeServer(opts));
var updateSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateSession_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await assertSession(sql, data.id, context.userId);
	if (data.complete) await sql`
        update workout_sessions set ended_at = now()
        where id = ${data.id} and user_id = ${context.userId}
      `;
	if (data.reopen) await sql`
        update workout_sessions set ended_at = null
        where id = ${data.id} and user_id = ${context.userId}
      `;
	if (data.notes !== void 0) await sql`
        update workout_sessions set notes = ${data.notes}
        where id = ${data.id} and user_id = ${context.userId}
      `;
	return { ok: true };
});
var deleteSession_createServerFn_handler = createServerRpc({
	id: "ca816d230be3129b444eee1ae50b3312650c02fa2eaeb88300e151ca0c6e18ad",
	name: "deleteSession",
	filename: "src/lib/api/workouts.ts"
}, (opts) => deleteSession.__executeServer(opts));
var deleteSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(deleteSession_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      delete from workout_sessions where id = ${data.id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var addEntry_createServerFn_handler = createServerRpc({
	id: "95b18662077e9689aab50c090aa4a8a629edcb33e4696a1afda9a41430243090",
	name: "addEntry",
	filename: "src/lib/api/workouts.ts"
}, (opts) => addEntry.__executeServer(opts));
var addEntry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(addEntry_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await assertSession(sql, data.sessionId, context.userId);
	const order = await sql`
      select coalesce(max(sort_order), -1)::int + 1 as n
      from workout_entries where session_id = ${data.sessionId}
    `;
	return { id: (await sql`
      insert into workout_entries (session_id, exercise_id, equipment_id, sort_order)
      values (${data.sessionId}, ${data.exerciseId}, ${data.equipmentId ?? null}, ${order[0]?.n ?? 0})
      returning id
    `)[0].id };
});
var updateEntry_createServerFn_handler = createServerRpc({
	id: "0b2dbeec2d555dd33aa953c996f0d1c5992f1eb201dfedaf062b4eae062479a0",
	name: "updateEntry",
	filename: "src/lib/api/workouts.ts"
}, (opts) => updateEntry.__executeServer(opts));
var updateEntry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateEntry_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (((await sql`
      select count(*)::int as n
      from workout_entries e
      join workout_sessions s on s.id = e.session_id
      where e.id = ${data.id} and s.user_id = ${context.userId}
    `)[0]?.n ?? 0) === 0) throw new Error("找不到動作");
	if (data.notes !== void 0) await sql`update workout_entries set notes = ${data.notes} where id = ${data.id}`;
	if (data.equipmentId !== void 0) await sql`update workout_entries set equipment_id = ${data.equipmentId} where id = ${data.id}`;
	return { ok: true };
});
var deleteEntry_createServerFn_handler = createServerRpc({
	id: "659d1c3ac5c23e725a85ad151bf8b2faf9d2966cc9d5850e554bc4f859fc25a3",
	name: "deleteEntry",
	filename: "src/lib/api/workouts.ts"
}, (opts) => deleteEntry.__executeServer(opts));
var deleteEntry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(deleteEntry_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      delete from workout_entries e
      using workout_sessions s
      where e.session_id = s.id and e.id = ${data.id} and s.user_id = ${context.userId}
    `;
	return { ok: true };
});
var addSet_createServerFn_handler = createServerRpc({
	id: "d88697721d31af0739c1391599153c39246a1fbae419f4d1d52bd7927b8a81f5",
	name: "addSet",
	filename: "src/lib/api/workouts.ts"
}, (opts) => addSet.__executeServer(opts));
var addSet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(addSet_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (((await sql`
      select count(*)::int as n
      from workout_entries e
      join workout_sessions s on s.id = e.session_id
      where e.id = ${data.entryId} and s.user_id = ${context.userId}
    `)[0]?.n ?? 0) === 0) throw new Error("找不到動作");
	const num = await sql`
      select coalesce(max(set_number), 0)::int + 1 as n from workout_sets where entry_id = ${data.entryId}
    `;
	return { id: (await sql`
      insert into workout_sets (
        entry_id, set_number, weight, additional_weight, is_bodyweight,
        reps, duration_seconds, distance_m
      ) values (
        ${data.entryId},
        ${num[0]?.n ?? 1},
        ${data.weight ?? null},
        ${data.additionalWeight ?? null},
        ${data.isBodyweight ?? false},
        ${data.reps ?? null},
        ${data.durationSeconds ?? null},
        ${data.distanceM ?? null}
      )
      returning id
    `)[0].id };
});
var updateSet_createServerFn_handler = createServerRpc({
	id: "da717ec953db526ce8ae1a7bee9b11e0203f041f4a62475bce9f68496da3e700",
	name: "updateSet",
	filename: "src/lib/api/workouts.ts"
}, (opts) => updateSet.__executeServer(opts));
var updateSet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateSet_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (((await sql`
      select count(*)::int as n
      from workout_sets st
      join workout_entries e on e.id = st.entry_id
      join workout_sessions s on s.id = e.session_id
      where st.id = ${data.id} and s.user_id = ${context.userId}
    `)[0]?.n ?? 0) === 0) throw new Error("找不到組數");
	await sql`
      update workout_sets set
        weight = ${data.weight ?? null},
        additional_weight = ${data.additionalWeight ?? null},
        is_bodyweight = ${data.isBodyweight ?? false},
        reps = ${data.reps ?? null},
        duration_seconds = ${data.durationSeconds ?? null},
        distance_m = ${data.distanceM ?? null}
      where id = ${data.id}
    `;
	return { ok: true };
});
var deleteSet_createServerFn_handler = createServerRpc({
	id: "17156c50053c05e1e7806f073246db1a395d6eac56922a2f8aa64e83b2e974d8",
	name: "deleteSet",
	filename: "src/lib/api/workouts.ts"
}, (opts) => deleteSet.__executeServer(opts));
var deleteSet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(deleteSet_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const rows = await sql`
      select st.entry_id
      from workout_sets st
      join workout_entries e on e.id = st.entry_id
      join workout_sessions s on s.id = e.session_id
      where st.id = ${data.id} and s.user_id = ${context.userId}
    `;
	if (!rows[0]) return { ok: true };
	await sql`delete from workout_sets where id = ${data.id}`;
	const remaining = await sql`
      select id from workout_sets where entry_id = ${rows[0].entry_id} order by set_number, id
    `;
	for (let i = 0; i < remaining.length; i++) await sql`update workout_sets set set_number = ${i + 1} where id = ${remaining[i].id}`;
	return { ok: true };
});
var recentExercises_createServerFn_handler = createServerRpc({
	id: "a336ac7e077e98c313622a6a5553ca31e5c72345f65f3cbf12148e39e1ef9037",
	name: "recentExercises",
	filename: "src/lib/api/workouts.ts"
}, (opts) => recentExercises.__executeServer(opts));
var recentExercises = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(recentExercises_createServerFn_handler, async ({ context, data }) => {
	const rows = await (await getSql())`
      select x.id as exercise_id, max(s.started_at) as last_at,
             x.name_zh, x.name_en, x.training_type, x.measurement, x.is_system, x.slug, x.notes
      from workout_entries e
      join workout_sessions s on s.id = e.session_id
      join exercises x on x.id = e.exercise_id
      where s.user_id = ${context.userId}
      group by x.id, x.name_zh, x.name_en, x.training_type, x.measurement, x.is_system, x.slug, x.notes
      order by last_at desc
      limit 12
    `;
	return (data.trainingType ? rows.filter((r) => r.training_type === data.trainingType) : rows).map((r) => mapExercise({
		id: r.exercise_id,
		slug: r.slug,
		name_zh: r.name_zh,
		name_en: r.name_en,
		training_type: r.training_type,
		measurement: r.measurement,
		is_system: r.is_system,
		notes: r.notes
	}));
});
var lastSetsForExercise_createServerFn_handler = createServerRpc({
	id: "d4b9d313f1b9ca6650a534d33e6610d4ced24d716c2dab052dafae063c81db08",
	name: "lastSetsForExercise",
	filename: "src/lib/api/workouts.ts"
}, (opts) => lastSetsForExercise.__executeServer(opts));
var lastSetsForExercise = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(lastSetsForExercise_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const entry = await sql`
      select e.id, e.equipment_id
      from workout_entries e
      join workout_sessions s on s.id = e.session_id
      where s.user_id = ${context.userId} and e.exercise_id = ${data.exerciseId}
      order by s.started_at desc, e.id desc
      limit 1
    `;
	if (!entry[0]) return {
		sets: [],
		equipmentId: null
	};
	return {
		sets: (await sql`
      select id, set_number, weight, additional_weight, is_bodyweight,
             reps, duration_seconds, distance_m, notes
      from workout_sets where entry_id = ${entry[0].id}
      order by set_number
    `).map(mapSet),
		equipmentId: entry[0].equipment_id
	};
});
var lastCompletedSession_createServerFn_handler = createServerRpc({
	id: "1b00275aed7d69a52bb322450d73e02fbc0a2150d081dcf10fa464964c2dadc2",
	name: "lastCompletedSession",
	filename: "src/lib/api/workouts.ts"
}, (opts) => lastCompletedSession.__executeServer(opts));
var lastCompletedSession = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(lastCompletedSession_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const rows = await sql`
      select id, training_type, started_at, ended_at, notes
      from workout_sessions
      where user_id = ${context.userId}
      order by started_at desc
      limit 1
    `;
	if (!rows[0]) return null;
	const entries = await loadEntries(sql, [rows[0].id], context.userId);
	return {
		...assembleSession(rows[0], entries.get(rows[0].id) ?? []),
		title: sessionTitle(rows[0].training_type, rows[0].started_at)
	};
});
var openSession_createServerFn_handler = createServerRpc({
	id: "544776ab30dc6636205c7cf60289ca73ecb1448c83a94cd567590d1d8b64c6c1",
	name: "openSession",
	filename: "src/lib/api/workouts.ts"
}, (opts) => openSession.__executeServer(opts));
var openSession = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(openSession_createServerFn_handler, async ({ context }) => {
	const rows = await (await getSql())`
      select id, training_type, started_at, ended_at, notes
      from workout_sessions
      where user_id = ${context.userId} and ended_at is null
      order by started_at desc
      limit 1
    `;
	return rows[0] ? {
		id: rows[0].id,
		trainingType: rows[0].training_type
	} : null;
});
var repeatLastSession_createServerFn_handler = createServerRpc({
	id: "f7cf3355f39e1a8b13522ae080119a1084a95432882c273410603f8edc7c435d",
	name: "repeatLastSession",
	filename: "src/lib/api/workouts.ts"
}, (opts) => repeatLastSession.__executeServer(opts));
var repeatLastSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(repeatLastSession_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const last = await sql`
      select id, training_type, started_at, ended_at, notes
      from workout_sessions
      where user_id = ${context.userId}
      order by started_at desc
      limit 1
    `;
	if (!last[0]) throw new Error("尚無訓練紀錄可重複");
	const newId = (await sql`
      insert into workout_sessions (user_id, training_type, notes)
      values (${context.userId}, ${last[0].training_type}, ${last[0].notes})
      returning id
    `)[0].id;
	const entries = await sql`
      select id, exercise_id, equipment_id, sort_order, notes
      from workout_entries where session_id = ${last[0].id}
      order by sort_order, id
    `;
	for (const e of entries) {
		const ne = await sql`
        insert into workout_entries (session_id, exercise_id, equipment_id, sort_order, notes)
        values (${newId}, ${e.exercise_id}, ${e.equipment_id}, ${e.sort_order}, ${e.notes})
        returning id
      `;
		const sets = await sql`
        select set_number, weight, additional_weight, is_bodyweight, reps, duration_seconds, distance_m
        from workout_sets where entry_id = ${e.id} order by set_number
      `;
		for (const s of sets) await sql`
          insert into workout_sets (
            entry_id, set_number, weight, additional_weight, is_bodyweight,
            reps, duration_seconds, distance_m
          ) values (
            ${ne[0].id}, ${s.set_number}, ${s.weight},
            ${s.additional_weight}, ${s.is_bodyweight},
            ${s.reps}, ${s.duration_seconds}, ${s.distance_m}
          )
        `;
	}
	return { id: newId };
});
var listSessionsByDate_createServerFn_handler = createServerRpc({
	id: "83fb02dc732218f157bb7aa2d373c6694797ed7411efb07118aaa3bc83515868",
	name: "listSessionsByDate",
	filename: "src/lib/api/workouts.ts"
}, (opts) => listSessionsByDate.__executeServer(opts));
var listSessionsByDate = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(listSessionsByDate_createServerFn_handler, async ({ context, data }) => {
	return (await (await getSql())`
      select s.id, s.training_type, s.started_at, s.ended_at, s.notes,
             count(distinct e.id)::int as exercise_count,
             count(st.id)::int as set_count
      from workout_sessions s
      left join workout_entries e on e.session_id = s.id
      left join workout_sets st on st.entry_id = e.id
      where s.user_id = ${context.userId}
        and to_char(s.started_at at time zone 'Asia/Taipei', 'YYYY-MM-DD') = ${data.date}
      group by s.id
      order by s.started_at
    `).map((r) => ({
		id: r.id,
		trainingType: r.training_type,
		startedAt: r.started_at,
		endedAt: r.ended_at,
		notes: r.notes,
		exerciseCount: r.exercise_count,
		setCount: r.set_count,
		title: sessionTitle(r.training_type, r.started_at)
	}));
});
//#endregion
export { addEntry_createServerFn_handler, addSet_createServerFn_handler, calendarMonth_createServerFn_handler, createSession_createServerFn_handler, deleteEntry_createServerFn_handler, deleteSession_createServerFn_handler, deleteSet_createServerFn_handler, getSession_createServerFn_handler, lastCompletedSession_createServerFn_handler, lastSetsForExercise_createServerFn_handler, listSessionsByDate_createServerFn_handler, listSessions_createServerFn_handler, openSession_createServerFn_handler, recentExercises_createServerFn_handler, repeatLastSession_createServerFn_handler, updateEntry_createServerFn_handler, updateSession_createServerFn_handler, updateSet_createServerFn_handler };
