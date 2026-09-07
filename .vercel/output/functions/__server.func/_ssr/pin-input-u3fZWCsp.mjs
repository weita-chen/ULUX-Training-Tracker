import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pin-input-u3fZWCsp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PinInput({ value, onChange, disabled }) {
	const refs = [
		(0, import_react.useRef)(null),
		(0, import_react.useRef)(null),
		(0, import_react.useRef)(null),
		(0, import_react.useRef)(null)
	];
	const digits = (value + "    ").slice(0, 4).split("");
	function setAt(i, char) {
		const next = value.split("");
		next[i] = char;
		onChange(next.join("").replace(/\D/g, "").slice(0, 4));
		if (char && i < 3) refs[i + 1].current?.focus();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center gap-3",
		children: digits.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: refs[i],
			inputMode: "numeric",
			autoComplete: i === 0 ? "one-time-code" : "off",
			disabled,
			maxLength: 1,
			value: d.trim(),
			onChange: (e) => {
				setAt(i, e.target.value.replace(/\D/g, "").slice(-1));
			},
			onKeyDown: (e) => {
				if (e.key === "Backspace" && !digits[i].trim() && i > 0) refs[i - 1].current?.focus();
			},
			onPaste: (e) => {
				const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
				if (text) {
					e.preventDefault();
					onChange(text);
					refs[Math.min(text.length, 3)].current?.focus();
				}
			},
			className: cn("h-14 w-12 rounded-xl border border-line bg-surface text-center font-display text-2xl text-ink tabular-nums", "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent")
		}, i))
	});
}
//#endregion
export { PinInput as t };
