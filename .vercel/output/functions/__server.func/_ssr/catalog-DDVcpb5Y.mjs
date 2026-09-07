import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C58uFI_W.mjs";
import { r as getSql } from "./db-DFFg8ioj.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { i as mapMuscle, n as mapEquipment, r as mapExercise } from "./map-gImjvydL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-DDVcpb5Y.js
var listCatalog_createServerFn_handler = createServerRpc({
	id: "a585208ea112f484b0549701aef67b535d7880cd990f0bf51831cc0b3e17d1ed",
	name: "listCatalog",
	filename: "src/lib/api/catalog.ts"
}, (opts) => listCatalog.__executeServer(opts));
var listCatalog = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCatalog_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const muscles = (await sql`
        select id, slug, name_zh, name_en from muscle_groups order by id
      `).map(mapMuscle);
	const equipment = (await sql`
        select id, slug, name_zh, name_en from equipment order by id
      `).map(mapEquipment);
	const exercises = await sql`
      select id, slug, name_zh, name_en, training_type, measurement, is_system, notes
      from exercises
      where archived_at is null
        and (is_system = true or owner_user_id = ${context.userId})
      order by is_system desc, name_zh
    `;
	const linksM = await sql`
      select exercise_id, muscle_group_id from exercise_muscles
    `;
	const linksE = await sql`
      select exercise_id, equipment_id from exercise_equipment
    `;
	const muscleById = new Map(muscles.map((m) => [m.id, m]));
	const eqById = new Map(equipment.map((e) => [e.id, e]));
	return {
		muscles,
		equipment,
		exercises: exercises.map((ex) => {
			const ms = [];
			for (const l of linksM) if (l.exercise_id === ex.id) {
				const m = muscleById.get(l.muscle_group_id);
				if (m) ms.push(m);
			}
			const eqs = [];
			for (const l of linksE) if (l.exercise_id === ex.id) {
				const e = eqById.get(l.equipment_id);
				if (e) eqs.push(e);
			}
			return mapExercise({
				...ex,
				muscles: ms,
				equipment: eqs
			});
		})
	};
});
var listCustomExercises_createServerFn_handler = createServerRpc({
	id: "10ec95520ac0d10c2a0cbd57a88d734c1b0fbc4d3503bb8dd93d97ea4b5ad4e3",
	name: "listCustomExercises",
	filename: "src/lib/api/catalog.ts"
}, (opts) => listCustomExercises.__executeServer(opts));
var listCustomExercises = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCustomExercises_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, slug, name_zh, name_en, training_type, measurement, is_system, notes
      from exercises
      where owner_user_id = ${context.userId} and archived_at is null
      order by name_zh
    `).map((r) => mapExercise(r));
});
var createCustomExercise_createServerFn_handler = createServerRpc({
	id: "7f5e7a9f82b2145d49a2b6a90be0bf80a3482ce821ca37a5ea040f8fb3ece7a7",
	name: "createCustomExercise",
	filename: "src/lib/api/catalog.ts"
}, (opts) => createCustomExercise.__executeServer(opts));
var createCustomExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createCustomExercise_createServerFn_handler, async ({ context, data }) => {
	const nameZh = data.nameZh.trim();
	if (!nameZh) throw new Error("請輸入動作名稱");
	return { id: (await (await getSql())`
      insert into exercises (name_zh, name_en, training_type, measurement, is_system, owner_user_id, notes)
      values (
        ${nameZh},
        ${data.nameEn?.trim() ?? ""},
        'weight',
        'weight_reps',
        false,
        ${context.userId},
        ${data.notes?.trim() || null}
      )
      returning id
    `)[0].id };
});
var updateCustomExercise_createServerFn_handler = createServerRpc({
	id: "8bfc7fa6c2c0b8e7956e1f02fe89faf8349d7285c1f376cb4e5ff0029932c155",
	name: "updateCustomExercise",
	filename: "src/lib/api/catalog.ts"
}, (opts) => updateCustomExercise.__executeServer(opts));
var updateCustomExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(updateCustomExercise_createServerFn_handler, async ({ context, data }) => {
	const nameZh = data.nameZh.trim();
	if (!nameZh) throw new Error("請輸入動作名稱");
	await (await getSql())`
      update exercises
      set name_zh = ${nameZh},
          name_en = ${data.nameEn?.trim() ?? ""},
          notes = ${data.notes?.trim() || null}
      where id = ${data.id} and owner_user_id = ${context.userId} and is_system = false
    `;
	return { ok: true };
});
var archiveCustomExercise_createServerFn_handler = createServerRpc({
	id: "ed2446d0fe7d40bdecffb81b816758991069626980b46f756c25eb4182b91255",
	name: "archiveCustomExercise",
	filename: "src/lib/api/catalog.ts"
}, (opts) => archiveCustomExercise.__executeServer(opts));
var archiveCustomExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(archiveCustomExercise_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (((await sql`
      select count(*)::int as n
      from workout_entries e
      join workout_sessions s on s.id = e.session_id
      where e.exercise_id = ${data.id} and s.user_id = ${context.userId}
    `)[0]?.n ?? 0) > 0) {
		await sql`
        update exercises set archived_at = now()
        where id = ${data.id} and owner_user_id = ${context.userId} and is_system = false
      `;
		return { archived: true };
	}
	await sql`
      delete from exercises
      where id = ${data.id} and owner_user_id = ${context.userId} and is_system = false
    `;
	return { archived: false };
});
//#endregion
export { archiveCustomExercise_createServerFn_handler, createCustomExercise_createServerFn_handler, listCatalog_createServerFn_handler, listCustomExercises_createServerFn_handler, updateCustomExercise_createServerFn_handler };
