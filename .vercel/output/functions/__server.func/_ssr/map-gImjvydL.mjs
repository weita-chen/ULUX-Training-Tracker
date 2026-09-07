import { m as toNum } from "./format-BsGHnvak.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-gImjvydL.js
function mapMuscle(r) {
	return {
		id: r.id,
		slug: r.slug,
		nameZh: r.name_zh,
		nameEn: r.name_en
	};
}
function mapEquipment(r) {
	return {
		id: r.id,
		slug: r.slug,
		nameZh: r.name_zh,
		nameEn: r.name_en
	};
}
function mapExercise(r) {
	return {
		id: r.id,
		slug: r.slug,
		nameZh: r.name_zh,
		nameEn: r.name_en,
		trainingType: r.training_type,
		measurement: r.measurement,
		isSystem: r.is_system,
		notes: r.notes,
		muscles: r.muscles ?? [],
		equipment: r.equipment ?? []
	};
}
function mapSet(r) {
	return {
		id: r.id,
		setNumber: r.set_number,
		weight: toNum(r.weight),
		additionalWeight: toNum(r.additional_weight),
		isBodyweight: r.is_bodyweight,
		reps: r.reps,
		durationSeconds: r.duration_seconds,
		distanceM: toNum(r.distance_m),
		notes: r.notes
	};
}
function assembleSession(session, entries) {
	return {
		id: session.id,
		trainingType: session.training_type,
		startedAt: session.started_at,
		endedAt: session.ended_at,
		notes: session.notes,
		entries
	};
}
//#endregion
export { mapSet as a, mapMuscle as i, mapEquipment as n, mapExercise as r, assembleSession as t };
