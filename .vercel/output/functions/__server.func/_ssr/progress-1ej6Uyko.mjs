import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C58uFI_W.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as formatShortDate, s as formatKg } from "./format-BsGHnvak.mjs";
import { r as listCatalog } from "./catalog-DyweS9Cg.mjs";
import { a as CartesianGrid, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-1ej6Uyko.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var dashboardStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d4ce1145a51841df1e74fa9e9a2878276b7fc5cd650d7c1444402d1191390ebb"));
var exerciseProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("21f998aa578f69897bde9b04e5932a8e8a8a756112f8626cce0df283883b3c8f"));
function ProgressPage() {
	const stats = useQuery({
		queryKey: ["stats"],
		queryFn: () => dashboardStats()
	});
	const catalog = useQuery({
		queryKey: ["catalog"],
		queryFn: () => listCatalog()
	});
	const [exerciseId, setExerciseId] = (0, import_react.useState)(null);
	const [showMuscle, setShowMuscle] = (0, import_react.useState)(false);
	const logged = (0, import_react.useMemo)(() => {
		const ids = new Set((stats.data?.prs ?? []).map((p) => p.exerciseId));
		return (catalog.data?.exercises ?? []).filter((e) => ids.has(e.id));
	}, [stats.data, catalog.data]);
	const prog = useQuery({
		queryKey: ["progress", exerciseId],
		queryFn: () => exerciseProgress({ data: { exerciseId } }),
		enabled: exerciseId != null
	});
	const s = stats.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl tracking-tight",
			children: "進度"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-ink-soft",
			children: "數據放在這裡，首頁保持安靜。"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "本週訓練日",
					value: s ? String(s.week.days) : "—",
					hint: `${s?.week.sessions ?? 0} 場`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "本月訓練日",
					value: s ? String(s.month.days) : "—",
					hint: `${s?.month.sessions ?? 0} 場`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "本週容量",
					value: s ? String(Math.round(s.week.volume)) : "—",
					hint: "kg × 次"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "本月容量",
					value: s ? String(Math.round(s.month.volume)) : "—",
					hint: "kg × 次"
				})
			]
		}),
		s && s.frequency.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs tracking-[0.18em] text-stone",
				children: "每週訓練日"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: s.frequency,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "#e7e3d8",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "week",
								tickFormatter: (v) => formatShortDate(String(v)),
								tick: {
									fill: "#8a8680",
									fontSize: 11
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								tick: {
									fill: "#8a8680",
									fontSize: 11
								},
								axisLine: false,
								tickLine: false,
								width: 24
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "#fffdf8",
									border: "1px solid #d9d4c8",
									borderRadius: 12
								},
								labelFormatter: (v) => `週起始 ${formatShortDate(String(v))}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "days",
								stroke: "#243f34",
								strokeWidth: 2,
								dot: {
									r: 3,
									fill: "#243f34"
								}
							})
						]
					})
				})
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs tracking-[0.18em] text-stone",
				children: "個人紀錄"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 divide-y divide-line",
				children: [(s?.prs ?? []).filter((p) => p.kind === "max_weight").slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-baseline justify-between py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "text-left",
						onClick: () => setExerciseId(p.exerciseId),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: p.nameZh
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-stone",
							children: p.nameEn
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-lg tabular-nums",
							children: [formatKg(p.value), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-xs text-stone",
								children: "kg"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-stone",
							children: [p.reps ? `${p.reps} 次 · ` : "", formatShortDate(p.date)]
						})]
					})]
				}, `${p.exerciseId}-${p.kind}`)), !s?.prs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-8 text-sm text-stone",
					children: "開始記錄後即可看到個人紀錄。"
				}) : null]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs tracking-[0.18em] text-stone",
					children: "動作進展"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mt-3 h-12 w-full rounded-lg border border-line bg-surface px-3 text-sm",
					value: exerciseId ?? "",
					onChange: (e) => setExerciseId(e.target.value ? Number(e.target.value) : null),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "選擇動作"
					}), (logged.length ? logged : catalog.data?.exercises ?? []).filter((e) => e.trainingType === "weight").map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: e.id,
						children: [
							e.nameZh,
							" — ",
							e.nameEn
						]
					}, e.id))]
				}),
				prog.data && prog.data.points.length >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-48",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: prog.data.points,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#e7e3d8",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "date",
									tickFormatter: (v) => formatShortDate(String(v)),
									tick: {
										fill: "#8a8680",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fill: "#8a8680",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false,
									width: 36
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "#fffdf8",
									border: "1px solid #d9d4c8",
									borderRadius: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "maxWeight",
									name: "重量",
									stroke: "#243f34",
									strokeWidth: 2,
									dot: {
										r: 3,
										fill: "#243f34"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "est1rm",
									name: "預估 1RM",
									stroke: "#8b3a2a",
									strokeWidth: 1.5,
									strokeDasharray: "4 4",
									dot: false
								})
							]
						})
					})
				}) : exerciseId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-stone",
					children: "這個動作的資料還不夠畫圖。"
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10 pb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "text-xs tracking-[0.18em] text-stone",
				onClick: () => setShowMuscle((v) => !v),
				children: ["肌群分布 ", showMuscle ? "▾" : "▸"]
			}), showMuscle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-stone",
						children: "容量依動作所屬肌群平均分攤，避免重複計算。"
					}),
					(s?.muscleShare ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.nameZh }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-stone",
							children: [Math.round(m.share * 100), "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 h-1.5 overflow-hidden rounded-full bg-mist",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-accent",
							style: { width: `${Math.round(m.share * 100)}%` }
						})
					})] }, m.slug)),
					!s?.muscleShare.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-stone",
						children: "尚無足夠資料。"
					}) : null
				]
			}) : null]
		})
	] });
}
function StatCard({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line bg-surface px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] tracking-widest text-stone",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-display text-3xl tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-stone",
				children: hint
			})
		]
	});
}
//#endregion
export { ProgressPage as component };
