//#region node_modules/.nitro/vite/services/ssr/assets/format-BsGHnvak.js
var TZ = "Asia/Taipei";
var TRAINING_TYPES = [
	{
		id: "weight",
		zh: "重量訓練",
		en: "Weight Training"
	},
	{
		id: "cardio",
		zh: "有氧",
		en: "Cardio"
	},
	{
		id: "ball",
		zh: "球類運動",
		en: "Ball Sports"
	},
	{
		id: "other",
		zh: "其他運動",
		en: "Other Exercise"
	}
];
function trainingTypeLabel(id) {
	return TRAINING_TYPES.find((t) => t.id === id)?.zh ?? id;
}
function taipeiDateISO(date = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: TZ,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(date);
}
function formatDisplayDate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return `${y}年${m}月${d}日`;
}
function formatShortDate(iso) {
	const [, m, d] = iso.split("-").map(Number);
	return `${m}月${d}日`;
}
function formatMonthTitle(year, month) {
	return `${year}年${month}月`;
}
function weekdayLabel(iso) {
	const dt = /* @__PURE__ */ new Date(`${iso}T12:00:00+08:00`);
	return new Intl.DateTimeFormat("zh-Hant", {
		timeZone: TZ,
		weekday: "short"
	}).format(dt);
}
function formatTime(date) {
	const d = typeof date === "string" ? new Date(date) : date;
	return new Intl.DateTimeFormat("zh-Hant", {
		timeZone: TZ,
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).format(d);
}
function formatKg(n) {
	if (n === null || n === void 0) return "—";
	const rounded = Math.round(n * 10) / 10;
	return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
function formatDuration(totalSeconds) {
	if (totalSeconds === null || totalSeconds === void 0) return "—";
	const s = Math.max(0, Math.round(totalSeconds));
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	const sec = s % 60;
	if (h > 0) return `${h}小時${m}分`;
	if (m > 0 && sec > 0) return `${m}分${sec}秒`;
	if (m > 0) return `${m}分鐘`;
	return `${sec}秒`;
}
function startOfWeekISO(iso) {
	const dt = /* @__PURE__ */ new Date(`${iso}T12:00:00+08:00`);
	const offset = {
		Mon: 0,
		Tue: 1,
		Wed: 2,
		Thu: 3,
		Fri: 4,
		Sat: 5,
		Sun: 6
	}[new Intl.DateTimeFormat("en-US", {
		timeZone: "Asia/Taipei",
		weekday: "short"
	}).format(dt)] ?? 0;
	dt.setDate(dt.getDate() - offset);
	return taipeiDateISO(dt);
}
function addDaysISO(iso, days) {
	const dt = /* @__PURE__ */ new Date(`${iso}T12:00:00+08:00`);
	dt.setDate(dt.getDate() + days);
	return taipeiDateISO(dt);
}
function daysInMonth(year, month) {
	return new Date(year, month, 0).getDate();
}
function monthGridStartOffset(year, month) {
	const iso = `${year}-${String(month).padStart(2, "0")}-01`;
	const dt = /* @__PURE__ */ new Date(`${iso}T12:00:00+08:00`);
	return {
		Mon: 0,
		Tue: 1,
		Wed: 2,
		Thu: 3,
		Fri: 4,
		Sat: 5,
		Sun: 6
	}[new Intl.DateTimeFormat("en-US", {
		timeZone: "Asia/Taipei",
		weekday: "short"
	}).format(dt)] ?? 0;
}
function toNum(v) {
	if (v === null || v === void 0 || v === "") return null;
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : null;
}
function epley1RM(weight, reps) {
	if (weight <= 0 || reps <= 0) return null;
	if (reps === 1) return weight;
	if (reps > 12) return null;
	return Math.round(weight * (1 + reps / 30) * 10) / 10;
}
//#endregion
export { formatDisplayDate as a, formatMonthTitle as c, monthGridStartOffset as d, startOfWeekISO as f, weekdayLabel as g, trainingTypeLabel as h, epley1RM as i, formatShortDate as l, toNum as m, addDaysISO as n, formatDuration as o, taipeiDateISO as p, daysInMonth as r, formatKg as s, TRAINING_TYPES as t, formatTime as u };
