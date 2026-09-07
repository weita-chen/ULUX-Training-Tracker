import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { d as ChevronLeft, u as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as formatDisplayDate, c as formatMonthTitle, d as monthGridStartOffset, f as startOfWeekISO, g as weekdayLabel, h as trainingTypeLabel, n as addDaysISO, p as taipeiDateISO, r as daysInMonth, u as formatTime } from "./format-BsGHnvak.mjs";
import { d as listSessionsByDate, r as calendarMonth } from "./workouts-DLq5-1b9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-2Dk64fML.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const today = taipeiDateISO();
	const [cursor, setCursor] = (0, import_react.useState)(() => {
		const [y, m] = today.split("-").map(Number);
		return {
			year: y,
			month: m
		};
	});
	const [view, setView] = (0, import_react.useState)("month");
	const [selected, setSelected] = (0, import_react.useState)(today);
	const cal = useQuery({
		queryKey: [
			"calendar",
			cursor.year,
			cursor.month
		],
		queryFn: () => calendarMonth({ data: cursor })
	});
	const daySessions = useQuery({
		queryKey: ["sessions-day", selected],
		queryFn: () => listSessionsByDate({ data: { date: selected } })
	});
	const counts = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const d of cal.data ?? []) m.set(d.date, d.sessionCount);
		return m;
	}, [cal.data]);
	const dim = daysInMonth(cursor.year, cursor.month);
	const offset = monthGridStartOffset(cursor.year, cursor.month);
	const cells = [...Array.from({ length: offset }, () => null), ...Array.from({ length: dim }, (_, i) => {
		const d = String(i + 1).padStart(2, "0");
		const m = String(cursor.month).padStart(2, "0");
		return `${cursor.year}-${m}-${d}`;
	})];
	while (cells.length % 7 !== 0) cells.push(null);
	const weekStart = startOfWeekISO(selected);
	const weekDays = Array.from({ length: 7 }, (_, i) => addDaysISO(weekStart, i));
	function prev() {
		setCursor((c) => c.month === 1 ? {
			year: c.year - 1,
			month: 12
		} : {
			year: c.year,
			month: c.month - 1
		});
	}
	function next() {
		setCursor((c) => c.month === 12 ? {
			year: c.year + 1,
			month: 1
		} : {
			year: c.year,
			month: c.month + 1
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-tight",
				children: "紀錄"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-1 rounded-lg bg-mist p-1 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("h-8 rounded-md px-3", view === "month" ? "bg-surface" : "text-stone"),
					onClick: () => setView("month"),
					children: "月"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("h-8 rounded-md px-3", view === "week" ? "bg-surface" : "text-stone"),
					onClick: () => setView("week"),
					children: "週"
				})]
			})]
		}),
		view === "month" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center",
							onClick: prev,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: formatMonthTitle(cursor.year, cursor.month)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center",
							onClick: next,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid grid-cols-7 text-center text-[11px] text-stone",
					children: [
						"一",
						"二",
						"三",
						"四",
						"五",
						"六",
						"日"
					].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-1",
						children: d
					}, d))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7",
					children: cells.map((iso, i) => {
						if (!iso) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12" }, `e-${i}`);
						const n = counts.get(iso) ?? 0;
						const isSel = iso === selected;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSelected(iso),
							className: cn("flex h-12 flex-col items-center justify-center rounded-xl text-sm", isSel && "bg-accent text-accent-fg", !isSel && iso === today && "text-accent"),
							children: [Number(iso.slice(8)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-1.5 gap-0.5",
								children: Array.from({ length: Math.min(n, 3) }).map((_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-0.5 size-1 rounded-full", isSel ? "bg-accent-fg" : "bg-accent") }, j))
							})]
						}, iso);
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-8 space-y-2",
			children: weekDays.map((iso) => {
				const n = counts.get(iso) ?? 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSelected(iso),
					className: cn("flex w-full items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3", iso === selected && "border-accent/40 bg-accent-soft"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-medium",
						children: [
							weekdayLabel(iso),
							" ",
							formatDisplayDate(iso).replace(/^\d+年/, "")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-stone",
						children: n === 0 ? "休息" : `${n} 場訓練`
					})] })
				}, iso);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs tracking-[0.18em] text-stone",
				children: formatDisplayDate(selected)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-2",
				children: (daySessions.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-8 text-sm text-stone",
					children: "這天沒有訓練紀錄。"
				}) : daySessions.data.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/workout/$sessionId",
					params: { sessionId: String(s.id) },
					className: "block rounded-2xl border border-line bg-surface px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: s.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-xs text-stone",
						children: [
							formatTime(s.startedAt),
							" · ",
							trainingTypeLabel(s.trainingType),
							" ·",
							" ",
							s.exerciseCount,
							" 個動作 · ",
							s.setCount,
							" 組"
						]
					})]
				}, s.id))
			})]
		})
	] });
}
//#endregion
export { HistoryPage as component };
