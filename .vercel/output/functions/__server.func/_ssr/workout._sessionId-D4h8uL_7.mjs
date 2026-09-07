import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
import { i as getProfile } from "./profile-B3yvOeUm.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as BrandSplash } from "./brand-mark-QnEswasa.mjs";
import { c as Minus, d as ChevronLeft, f as Check, o as Plus, r as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as trainingTypeLabel, o as formatDuration, s as formatKg } from "./format-BsGHnvak.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route$2, r as queryClient } from "./router-1VK6ebCg.mjs";
import { a as deleteEntry, c as getSession, g as updateSet, h as updateSession, n as addSet, o as deleteSession, p as recentExercises, s as deleteSet, t as addEntry, u as lastSetsForExercise } from "./workouts-DLq5-1b9.mjs";
import { t as Button } from "./button-B5Pio0NC.mjs";
import { t as ExerciseName } from "./exercise-name-BBKRngbv.mjs";
import { r as listCatalog } from "./catalog-DyweS9Cg.mjs";
import { t as ConfirmDialog } from "./alert-dialog-toK3Ox_k.mjs";
import { t as Textarea } from "./textarea-CiDswSlS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workout._sessionId-D4h8uL_7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NumberStepper({ value, onChange, step = 1, min, max, decimals = 0, suffix, ariaLabel }) {
	const display = value === null || value === void 0 ? "" : decimals > 0 ? String(Math.round(value * 10 ** decimals) / 10 ** decimals) : String(value);
	function clamp(n) {
		if (min !== void 0) n = Math.max(min, n);
		if (max !== void 0) n = Math.min(max, n);
		return n;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[3.25rem_1fr_3.25rem] items-stretch overflow-hidden rounded-xl border border-line bg-surface",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "減少",
				className: "grid place-items-center text-ink hover:bg-mist active:bg-mist",
				onClick: () => onChange(clamp((value ?? 0) - step)),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
					className: "size-5",
					strokeWidth: 1.75
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative border-x border-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": ariaLabel,
					inputMode: "decimal",
					value: display,
					onChange: (e) => {
						const raw = e.target.value.replace(/[^\d.]/g, "");
						if (raw === "") {
							onChange(0);
							return;
						}
						const n = Number(raw);
						if (Number.isFinite(n)) onChange(clamp(n));
					},
					className: cn("h-14 w-full bg-transparent text-center font-display text-2xl tabular-nums text-ink", "focus:outline-none", suffix ? "pr-8" : "")
				}), suffix ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone",
					children: suffix
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "增加",
				className: "grid place-items-center text-ink hover:bg-mist active:bg-mist",
				onClick: () => onChange(clamp((value ?? 0) + step)),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					className: "size-5",
					strokeWidth: 1.75
				})
			})
		]
	});
}
function WorkoutPage() {
	const { sessionId } = Route$2.useParams();
	const id = Number(sessionId);
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getProfile(),
		enabled: !!user
	});
	const session = useQuery({
		queryKey: ["session", id],
		queryFn: () => getSession({ data: { id } }),
		enabled: !!user && Number.isFinite(id)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandSplash, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (profile.isLoading || session.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandSplash, {});
	if (!profile.data) {
		window.location.assign("/onboarding");
		return null;
	}
	if (!session.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-dvh place-items-center px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "找不到這筆訓練。" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-4 text-sm text-stone",
			children: "回首頁"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkoutEditor, { sessionId: id });
}
function WorkoutEditor({ sessionId }) {
	const navigate = useNavigate();
	const sessionQ = useQuery({
		queryKey: ["session", sessionId],
		queryFn: () => getSession({ data: { id: sessionId } })
	});
	const catalog = useQuery({
		queryKey: ["catalog"],
		queryFn: () => listCatalog()
	});
	const recent = useQuery({
		queryKey: ["recent-exercises"],
		queryFn: () => recentExercises({ data: {} })
	});
	const [picker, setPicker] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(false);
	const [notes, setNotes] = (0, import_react.useState)(null);
	const session = sessionQ.data;
	async function refresh() {
		await queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
		await queryClient.invalidateQueries({ queryKey: ["open-session"] });
		await queryClient.invalidateQueries({ queryKey: ["stats"] });
	}
	async function complete() {
		await updateSession({ data: {
			id: sessionId,
			complete: true,
			notes: notes ?? session?.notes
		} });
		await refresh();
		toast("訓練已儲存");
		navigate({ to: "/" });
	}
	async function remove() {
		await deleteSession({ data: { id: sessionId } });
		await queryClient.invalidateQueries();
		navigate({ to: "/" });
	}
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandSplash, {});
	const noteValue = notes ?? session.notes ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper pb-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-paper/95 px-3 py-2 backdrop-blur-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "grid size-11 place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: trainingTypeLabel(session.trainingType)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-stone",
							children: [session.endedAt ? "歷史紀錄" : "進行中", " · 重量單位 kg"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center text-stone",
						onClick: () => setConfirmDel(true),
						"aria-label": "刪除訓練",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: complete,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "完成"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-lg px-4 pt-5",
				children: [
					session.entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-10 text-center text-sm text-stone",
						children: "從下方加入第一個動作。"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-8",
						children: session.entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseName, {
									zh: entry.exercise.nameZh,
									en: entry.exercise.nameEn
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 text-xs text-stone",
									children: [
										entry.equipment?.nameZh,
										entry.equipment?.slug === "dumbbell" ? " · 重量為總重量" : "",
										entry.exercise.measurement === "bodyweight" ? " · 可加外部負重" : ""
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs text-stone",
									onClick: async () => {
										await deleteEntry({ data: { id: entry.id } });
										await refresh();
									},
									children: "移除"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 divide-y divide-line rounded-2xl border border-line bg-surface",
								children: entry.sets.map((set) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex w-full items-center gap-3 px-4 py-3 text-left",
									onClick: () => setEditing({
										entry,
										set
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-6 text-xs tabular-nums text-stone",
										children: set.setNumber
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1 font-display text-lg tabular-nums",
										children: formatSet(set, entry.exercise.measurement)
									})]
								}) }, set.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "mt-2 flex h-11 w-full items-center justify-center gap-1 rounded-xl text-sm text-accent",
								onClick: () => setEditing({
									entry,
									set: null
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " 新增一組"]
							})
						] }, entry.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "mt-8 w-full",
						size: "lg",
						onClick: () => setPicker(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "新增動作"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs tracking-[0.18em] text-stone",
							children: "備註"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-2",
							placeholder: "例如：今天特別有力。",
							value: noteValue,
							onChange: (e) => setNotes(e.target.value),
							onBlur: () => updateSession({ data: {
								id: sessionId,
								notes: noteValue
							} })
						})]
					})
				]
			}),
			picker && catalog.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExercisePicker, {
				trainingType: session.trainingType,
				exercises: catalog.data.exercises,
				muscles: catalog.data.muscles,
				recent: recent.data ?? [],
				onClose: () => setPicker(false),
				onPick: async (exercise, equipmentId) => {
					const { id: entryId } = await addEntry({ data: {
						sessionId,
						exerciseId: exercise.id,
						equipmentId
					} });
					const last = await lastSetsForExercise({ data: { exerciseId: exercise.id } });
					if (last.sets.length > 0) {
						const first = last.sets[0];
						await addSet({ data: {
							entryId,
							weight: first.weight,
							additionalWeight: first.additionalWeight,
							isBodyweight: first.isBodyweight,
							reps: first.reps,
							durationSeconds: first.durationSeconds,
							distanceM: first.distanceM
						} });
					}
					setPicker(false);
					await refresh();
				}
			}) : null,
			editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetEditor, {
				entry: editing.entry,
				initial: editing.set,
				onClose: () => setEditing(null),
				onSave: async (payload) => {
					if (editing.set) await updateSet({ data: {
						id: editing.set.id,
						...payload
					} });
					else await addSet({ data: {
						entryId: editing.entry.id,
						...payload
					} });
					setEditing(null);
					await refresh();
				},
				onDelete: editing.set ? async () => {
					await deleteSet({ data: { id: editing.set.id } });
					setEditing(null);
					await refresh();
				} : void 0
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirmDel,
				onOpenChange: setConfirmDel,
				title: "刪除整場訓練？",
				description: "此場次與所有組數都會刪除，且無法復原。",
				confirmLabel: "刪除",
				danger: true,
				onConfirm: remove
			})
		]
	});
}
function formatSet(set, measurement) {
	if (measurement === "duration") return formatDuration(set.durationSeconds);
	if (measurement === "distance_duration") return [set.distanceM != null ? `${Math.round(set.distanceM / 1e3 * 100) / 100} km` : "", formatDuration(set.durationSeconds)].filter(Boolean).join(" · ");
	if (measurement === "bodyweight") return `徒手${set.additionalWeight ? `+${formatKg(set.additionalWeight)} kg` : ""} × ${set.reps ?? 0}`;
	return `${formatKg(set.weight)} kg × ${set.reps ?? 0}`;
}
function ExercisePicker({ trainingType, exercises, muscles, recent, onClose, onPick }) {
	const [step, setStep] = (0, import_react.useState)("cat");
	const [muscle, setMuscle] = (0, import_react.useState)(trainingType === "weight" ? null : "recent");
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		let list = exercises.filter((e) => e.trainingType === trainingType || !e.isSystem);
		if (muscle === "custom") list = exercises.filter((e) => !e.isSystem);
		else if (muscle === "recent") list = recent.filter((e) => e.trainingType === trainingType);
		else if (typeof muscle === "number") list = list.filter((e) => e.muscles.some((m) => m.id === muscle));
		if (q.trim()) {
			const s = q.trim().toLowerCase();
			list = exercises.filter((e) => e.nameZh.toLowerCase().includes(s) || e.nameEn.toLowerCase().includes(s));
		}
		return list;
	}, [
		exercises,
		muscle,
		q,
		recent,
		trainingType
	]);
	const showCats = trainingType === "weight" && !q.trim();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2 px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 font-medium",
					children: "選擇動作"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "搜尋動作",
					className: "h-12 w-full rounded-xl border border-line bg-surface px-4 text-base"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex-1 overflow-y-auto px-4 pb-10",
				children: showCats && step === "cat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						recent.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded-2xl border border-line bg-surface px-4 py-4 text-left",
							onClick: () => {
								setMuscle("recent");
								setStep("ex");
							},
							children: "最近"
						}) : null,
						muscles.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded-2xl border border-line bg-surface px-4 py-4 text-left",
							onClick: () => {
								setMuscle(m.id);
								setStep("ex");
							},
							children: m.nameZh
						}, m.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded-2xl border border-line bg-surface px-4 py-4 text-left",
							onClick: () => {
								setMuscle("custom");
								setStep("ex");
							},
							children: "自訂動作"
						})
					]
				}) : step === "eq" && picked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-3 text-sm text-ink-soft",
						children: [picked.nameZh, " — 選擇器材"]
					}), picked.equipment.map((eq) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-14 w-full items-center rounded-2xl border border-line bg-surface px-4",
						onClick: () => onPick(picked, eq.id),
						children: [eq.nameZh, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs text-stone",
							children: eq.nameEn
						})]
					}, eq.id))]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [showCats ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mb-3 text-sm text-stone",
					onClick: () => setStep("cat"),
					children: "← 部位"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "divide-y divide-line rounded-2xl border border-line bg-surface",
					children: [filtered.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex w-full items-center px-4 py-3 text-left",
						onClick: () => {
							if (ex.equipment.length > 1) {
								setPicked(ex);
								setStep("eq");
							} else onPick(ex, ex.equipment[0]?.id ?? null);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseName, {
							zh: ex.nameZh,
							en: ex.nameEn,
							size: "sm"
						})
					}) }, ex.id)), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-4 py-8 text-sm text-stone",
						children: "沒有符合的動作"
					}) : null]
				})] })
			})
		]
	});
}
function SetEditor({ entry, initial, onClose, onSave, onDelete }) {
	const m = entry.exercise.measurement;
	const last = initial ?? entry.sets[entry.sets.length - 1] ?? null;
	const [weight, setWeight] = (0, import_react.useState)(last?.weight ?? 20);
	const [extra, setExtra] = (0, import_react.useState)(last?.additionalWeight ?? 0);
	const [reps, setReps] = (0, import_react.useState)(last?.reps ?? 8);
	const [minutes, setMinutes] = (0, import_react.useState)(last?.durationSeconds ? Math.floor(last.durationSeconds / 60) : 30);
	const [km, setKm] = (0, import_react.useState)(last?.distanceM ? last.distanceM / 1e3 : 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex flex-col justify-end bg-overlay",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-t-3xl bg-surface px-5 pb-8 pt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: initial ? `第 ${initial.setNumber} 組` : "新增一組"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center",
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-stone",
					children: [entry.exercise.nameZh, entry.equipment?.slug === "dumbbell" ? " · 請輸入總重量" : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-5",
					children: [
						m === "weight_reps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "重量",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberStepper, {
								value: weight,
								onChange: setWeight,
								step: 2.5,
								min: 0,
								decimals: 1,
								suffix: "kg",
								ariaLabel: "重量"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "次數",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberStepper, {
								value: reps,
								onChange: setReps,
								step: 1,
								min: 0,
								ariaLabel: "次數"
							})
						})] }) : null,
						m === "bodyweight" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "額外負重",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberStepper, {
									value: extra,
									onChange: setExtra,
									step: 2.5,
									min: 0,
									decimals: 1,
									suffix: "kg",
									ariaLabel: "額外負重"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-stone",
								children: "0 kg 代表純徒手。"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "次數",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberStepper, {
									value: reps,
									onChange: setReps,
									step: 1,
									min: 0,
									ariaLabel: "次數"
								})
							})
						] }) : null,
						m === "duration" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "時間（分鐘）",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberStepper, {
								value: minutes,
								onChange: setMinutes,
								step: 5,
								min: 0,
								ariaLabel: "分鐘"
							})
						}) : null,
						m === "distance_duration" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "距離",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberStepper, {
								value: km,
								onChange: setKm,
								step: .5,
								min: 0,
								decimals: 2,
								suffix: "km",
								ariaLabel: "距離"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "時間（分鐘）",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberStepper, {
								value: minutes,
								onChange: setMinutes,
								step: 1,
								min: 0,
								ariaLabel: "分鐘"
							})
						})] }) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-2",
					children: [onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "flex-1",
						onClick: onDelete,
						children: "刪除"
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						onClick: () => onSave({
							weight: m === "weight_reps" ? weight : null,
							additionalWeight: m === "bodyweight" ? extra : null,
							isBodyweight: m === "bodyweight",
							reps: m === "weight_reps" || m === "bodyweight" ? reps : null,
							durationSeconds: m === "duration" || m === "distance_duration" ? minutes * 60 : null,
							distanceM: m === "distance_duration" ? km * 1e3 : null
						}),
						children: "儲存"
					})]
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-2 text-xs tracking-widest text-stone",
		children: label
	}), children] });
}
//#endregion
export { WorkoutPage as component };
