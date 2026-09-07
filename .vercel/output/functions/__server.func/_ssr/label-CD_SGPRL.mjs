import "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-12 w-full rounded-lg border border-line bg-surface px-3.5 text-base text-ink", "placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("block text-sm font-medium text-ink-soft", className),
		...props
	});
}
//#endregion
export { Label as n, Input as t };
