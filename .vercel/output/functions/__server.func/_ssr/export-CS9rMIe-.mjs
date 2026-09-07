import { o as __toESM } from "../_runtime.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C58uFI_W.mjs";
import { h as trainingTypeLabel, i as epley1RM, m as toNum, p as taipeiDateISO } from "./format-BsGHnvak.mjs";
import { r as getSql } from "./db-DFFg8ioj.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-CS9rMIe-.js
var exportWorkbook_createServerFn_handler = createServerRpc({
	id: "cb1054eb29629ef6d9fdb03358a64278ebab035d584978e0827e4d4c76dbba8d",
	name: "exportWorkbook",
	filename: "src/lib/api/export.ts"
}, (opts) => exportWorkbook.__executeServer(opts));
var exportWorkbook = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(exportWorkbook_createServerFn_handler, async ({ context }) => {
	const ExcelJS = await import("../_libs/exceljs+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const Workbook = ExcelJS.default?.Workbook ?? ExcelJS.Workbook;
	const sql = await getSql();
	const profile = await sql`
      select ulux_id, nickname, email from profiles where user_id = ${context.userId} limit 1
    `;
	const sessions = await sql`
      select id, training_type, started_at, ended_at, notes
      from workout_sessions where user_id = ${context.userId}
      order by started_at
    `;
	const entries = await sql`
      select e.id, e.session_id, x.name_zh, x.name_en, x.training_type,
             q.name_zh as eq_zh,
             (
               select string_agg(g.name_zh, '、')
               from exercise_muscles em
               join muscle_groups g on g.id = em.muscle_group_id
               where em.exercise_id = x.id
             ) as muscle,
             st.set_number, st.weight, st.additional_weight, st.is_bodyweight,
             st.reps, st.duration_seconds, st.distance_m, st.notes as set_notes,
             e.notes as entry_notes
      from workout_entries e
      join workout_sessions s on s.id = e.session_id
      join exercises x on x.id = e.exercise_id
      left join equipment q on q.id = e.equipment_id
      left join workout_sets st on st.entry_id = e.id
      where s.user_id = ${context.userId}
      order by s.started_at, e.sort_order, st.set_number
    `;
	const wb = new Workbook();
	wb.creator = "ULUX";
	wb.created = /* @__PURE__ */ new Date();
	const ink = "161513";
	const forest = "243F34";
	const styleHeader = (sheet, cols) => {
		const row = sheet.getRow(1);
		row.font = {
			bold: true,
			color: { argb: "FFF3F0E6" },
			name: "Calibri"
		};
		row.fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: { argb: `FF${forest}` }
		};
		row.height = 22;
		for (let i = 1; i <= cols; i++) sheet.getColumn(i).font = {
			name: "Calibri",
			color: { argb: `FF${ink}` }
		};
	};
	const summary = wb.addWorksheet("訓練摘要");
	summary.columns = [
		{
			header: "日期",
			key: "date",
			width: 14
		},
		{
			header: "訓練",
			key: "title",
			width: 28
		},
		{
			header: "類型",
			key: "type",
			width: 14
		},
		{
			header: "時長（分）",
			key: "dur",
			width: 12
		},
		{
			header: "備註",
			key: "notes",
			width: 40
		}
	];
	for (const s of sessions) {
		let dur = null;
		if (s.ended_at) dur = Math.round((new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 6e4);
		summary.addRow({
			date: taipeiDateISO(new Date(s.started_at)),
			title: `${trainingTypeLabel(s.training_type)}`,
			type: trainingTypeLabel(s.training_type),
			dur,
			notes: s.notes ?? ""
		});
	}
	styleHeader(summary, 5);
	const rec = wb.addWorksheet("動作紀錄");
	rec.columns = [
		{
			header: "日期",
			key: "date",
			width: 14
		},
		{
			header: "訓練編號",
			key: "sid",
			width: 12
		},
		{
			header: "類型",
			key: "type",
			width: 12
		},
		{
			header: "部位",
			key: "muscle",
			width: 16
		},
		{
			header: "動作",
			key: "ex",
			width: 22
		},
		{
			header: "英文",
			key: "en",
			width: 22
		},
		{
			header: "器材",
			key: "eq",
			width: 12
		},
		{
			header: "組",
			key: "set",
			width: 8
		},
		{
			header: "重量 kg",
			key: "w",
			width: 12
		},
		{
			header: "額外重量 kg",
			key: "aw",
			width: 14
		},
		{
			header: "次數",
			key: "reps",
			width: 10
		},
		{
			header: "時間（秒）",
			key: "dur",
			width: 12
		},
		{
			header: "距離 m",
			key: "dist",
			width: 12
		},
		{
			header: "備註",
			key: "notes",
			width: 28
		}
	];
	const sessionById = new Map(sessions.map((s) => [s.id, s]));
	for (const e of entries) {
		const s = sessionById.get(e.session_id);
		if (!s) continue;
		rec.addRow({
			date: taipeiDateISO(new Date(s.started_at)),
			sid: e.session_id,
			type: trainingTypeLabel(e.training_type),
			muscle: e.muscle ?? "",
			ex: e.name_zh,
			en: e.name_en,
			eq: e.eq_zh ?? "",
			set: e.set_number,
			w: e.is_bodyweight ? "" : toNum(e.weight),
			aw: toNum(e.additional_weight),
			reps: e.reps,
			dur: e.duration_seconds,
			dist: toNum(e.distance_m),
			notes: e.set_notes || e.entry_notes || ""
		});
	}
	styleHeader(rec, 14);
	const prSheet = wb.addWorksheet("個人紀錄");
	prSheet.columns = [
		{
			header: "動作",
			key: "ex",
			width: 22
		},
		{
			header: "英文",
			key: "en",
			width: 22
		},
		{
			header: "類型",
			key: "kind",
			width: 16
		},
		{
			header: "數值",
			key: "val",
			width: 12
		},
		{
			header: "次數",
			key: "reps",
			width: 10
		},
		{
			header: "日期",
			key: "date",
			width: 14
		}
	];
	const prAcc = /* @__PURE__ */ new Map();
	for (const e of entries) {
		const s = sessionById.get(e.session_id);
		if (!s || e.reps == null) continue;
		const w = e.is_bodyweight ? toNum(e.additional_weight) ?? 0 : toNum(e.weight) ?? 0;
		if (w <= 0) continue;
		const date = taipeiDateISO(new Date(s.started_at));
		const maxKey = `${e.name_zh}|max`;
		const cur = prAcc.get(maxKey);
		if (!cur || w > cur.val) prAcc.set(maxKey, {
			ex: e.name_zh,
			en: e.name_en,
			kind: "最大重量 kg",
			val: w,
			reps: e.reps,
			date
		});
		const est = epley1RM(w, e.reps);
		if (est) {
			const estKey = `${e.name_zh}|1rm`;
			const c2 = prAcc.get(estKey);
			if (!c2 || est > c2.val) prAcc.set(estKey, {
				ex: e.name_zh,
				en: e.name_en,
				kind: "預估 1RM kg",
				val: est,
				reps: e.reps,
				date
			});
		}
	}
	for (const v of prAcc.values()) prSheet.addRow(v);
	styleHeader(prSheet, 6);
	const stats = wb.addWorksheet("統計");
	stats.columns = [{
		header: "項目",
		key: "k",
		width: 22
	}, {
		header: "數值",
		key: "v",
		width: 20
	}];
	const dates = new Set(sessions.map((s) => taipeiDateISO(new Date(s.started_at))));
	stats.addRow({
		k: "帳號 ID",
		v: profile[0]?.ulux_id ?? ""
	});
	stats.addRow({
		k: "暱稱",
		v: profile[0]?.nickname ?? ""
	});
	stats.addRow({
		k: "訓練日數",
		v: dates.size
	});
	stats.addRow({
		k: "訓練場次",
		v: sessions.length
	});
	stats.addRow({
		k: "動作紀錄列數",
		v: entries.length
	});
	stats.addRow({
		k: "匯出時間",
		v: (/* @__PURE__ */ new Date()).toISOString()
	});
	styleHeader(stats, 2);
	const buf = await wb.xlsx.writeBuffer();
	const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : new Uint8Array(buf);
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	const base64 = btoa(binary);
	return {
		filename: `ULUX-${profile[0]?.nickname ?? "ulux"}-${taipeiDateISO()}.xlsx`,
		base64
	};
});
//#endregion
export { exportWorkbook_createServerFn_handler };
