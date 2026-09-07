import { a as Overlay2, c as Title2, d as require_jsx_runtime, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-B5Pio0NC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alert-dialog-toK3Ox_k.js
var import_jsx_runtime = require_jsx_runtime();
function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "確認", danger, onConfirm }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Portal2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, { className: "fixed inset-0 z-50 bg-overlay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2, {
			className: cn("fixed left-1/2 top-1/2 z-50 w-[min(92vw,380px)] -translate-x-1/2 -translate-y-1/2", "rounded-2xl bg-surface p-6 shadow-soft"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
					className: "font-display text-xl text-ink",
					children: title
				}),
				description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
					className: "mt-2 text-sm leading-relaxed text-ink-soft",
					children: description
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							children: "取消"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: danger ? "danger" : "primary",
							onClick: onConfirm,
							children: confirmLabel
						})
					})]
				})
			]
		})] })
	});
}
function DialogFrame({ open, onOpenChange, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Portal2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, { className: "fixed inset-0 z-50 bg-overlay" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
			className: cn("fixed left-1/2 top-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2", "max-h-[86vh] overflow-y-auto rounded-2xl bg-surface p-6 shadow-soft"),
			children
		})] })
	});
}
//#endregion
export { DialogFrame as n, ConfirmDialog as t };
