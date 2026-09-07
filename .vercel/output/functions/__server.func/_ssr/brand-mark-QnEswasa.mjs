import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-mark-QnEswasa.js
var import_jsx_runtime = require_jsx_runtime();
function BrandMark({ size = "md", subtitle = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("font-display font-medium tracking-tight text-ink", size === "sm" && "text-xl", size === "md" && "text-3xl", size === "lg" && "text-5xl"),
			children: "ULUX"
		}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("mt-1 tracking-[0.18em] text-stone", size === "lg" ? "text-sm" : "text-xs"),
			children: "有練有差"
		}) : null]
	});
}
function BrandSplash() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-paper px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, { size: "lg" })
	});
}
//#endregion
export { BrandSplash as n, BrandMark as t };
