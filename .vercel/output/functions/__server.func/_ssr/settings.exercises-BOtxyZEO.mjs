import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as queryClient } from "./router-1VK6ebCg.mjs";
import { t as Button } from "./button-B5Pio0NC.mjs";
import { n as Label, t as Input } from "./label-CD_SGPRL.mjs";
import { a as updateCustomExercise, i as listCustomExercises, n as createCustomExercise, t as archiveCustomExercise } from "./catalog-DyweS9Cg.mjs";
import { n as DialogFrame, t as ConfirmDialog } from "./alert-dialog-toK3Ox_k.mjs";
import { t as Textarea } from "./textarea-CiDswSlS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings.exercises-BOtxyZEO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomExercisesPage() {
	const list = useQuery({
		queryKey: ["custom-exercises"],
		queryFn: () => listCustomExercises()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [nameZh, setNameZh] = (0, import_react.useState)("");
	const [nameEn, setNameEn] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [delId, setDelId] = (0, import_react.useState)(null);
	function startCreate() {
		setEditing(null);
		setNameZh("");
		setNameEn("");
		setNotes("");
		setOpen(true);
	}
	function startEdit(ex) {
		setEditing(ex);
		setNameZh(ex.nameZh);
		setNameEn(ex.nameEn);
		setNotes(ex.notes ?? "");
		setOpen(true);
	}
	async function save() {
		try {
			if (editing) {
				await updateCustomExercise({ data: {
					id: editing.id,
					nameZh,
					nameEn,
					notes
				} });
				toast("已更新");
			} else {
				await createCustomExercise({ data: {
					nameZh,
					nameEn,
					notes
				} });
				toast("已新增動作");
			}
			setOpen(false);
			await queryClient.invalidateQueries({ queryKey: ["custom-exercises"] });
			await queryClient.invalidateQueries({ queryKey: ["catalog"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "無法儲存");
		}
	}
	async function remove() {
		if (delId == null) return;
		try {
			const r = await archiveCustomExercise({ data: { id: delId } });
			toast(r.archived ? "已封存（歷史紀錄仍保留）" : "已刪除");
			setDelId(null);
			await queryClient.invalidateQueries({ queryKey: ["custom-exercises"] });
			await queryClient.invalidateQueries({ queryKey: ["catalog"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "無法刪除");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/settings",
			className: "text-sm text-stone",
			children: "← 設定"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-end justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-tight",
				children: "自訂動作"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: startCreate,
				children: "新增"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-ink-soft",
			children: "只需名稱。歷史紀錄會跟著名稱更新。"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 divide-y divide-line rounded-2xl border border-line bg-surface",
			children: (list.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-4 py-8 text-sm text-stone",
				children: "還沒有自訂動作。"
			}) : (list.data ?? []).map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "text-left",
					onClick: () => startEdit(ex),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: ex.nameZh
					}), ex.nameEn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-stone",
						children: ex.nameEn
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-danger",
					onClick: () => setDelId(ex.id),
					children: "刪除"
				})]
			}, ex.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFrame, {
			open,
			onOpenChange: setOpen,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: editing ? "編輯動作" : "新增動作"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "名稱" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: nameZh,
								onChange: (e) => setNameZh(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "英文（選填）" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: nameEn,
								onChange: (e) => setNameEn(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "備註（選填）" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: notes,
								onChange: (e) => setNotes(e.target.value)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full",
					onClick: save,
					disabled: !nameZh.trim(),
					children: "儲存"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: delId != null,
			onOpenChange: (v) => !v && setDelId(null),
			title: "刪除此動作？",
			description: "若已有歷史紀錄，動作會被封存而不是真正刪除。",
			confirmLabel: "刪除",
			danger: true,
			onConfirm: remove
		})
	] });
}
//#endregion
export { CustomExercisesPage as component };
