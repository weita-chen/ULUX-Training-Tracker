import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercise-name-BBKRngbv.js
var import_jsx_runtime = require_jsx_runtime();
function ExerciseName({ zh, en, size = "md" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("text-ink", size === "md" ? "text-base font-medium" : "text-sm font-medium"),
		children: [zh, en ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-normal text-stone",
			children: [
				" ",
				"— ",
				en
			]
		}) : null]
	}) });
}
//#endregion
export { ExerciseName as t };
