import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as recoverResetPin, o as recoverRevealId } from "./profile-B3yvOeUm.mjs";
import { t as BrandMark } from "./brand-mark-QnEswasa.mjs";
import { t as Button } from "./button-B5Pio0NC.mjs";
import { n as Label, t as Input } from "./label-CD_SGPRL.mjs";
import { t as PinInput } from "./pin-input-u3fZWCsp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recover-DmS1g5cr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Recover() {
	const [tab, setTab] = (0, import_react.useState)("pin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [uluxId, setUluxId] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	const [nextPin, setNextPin] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function reveal(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		setMessage(null);
		try {
			const r = await recoverRevealId({ data: {
				email,
				pin
			} });
			if (!r.ok) setError(r.error);
			else setMessage(`你的 ID 是 ${r.uluxId}`);
		} finally {
			setBusy(false);
		}
	}
	async function reset(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		setMessage(null);
		try {
			const r = await recoverResetPin({ data: {
				email,
				uluxId,
				nextPin
			} });
			if (!r.ok) setError(r.error);
			else setMessage("PIN 已重設，請以新 PIN 登入。");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-8 text-center font-display text-2xl",
				children: "找回帳號"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-2 gap-1 rounded-xl bg-mist p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab("pin"),
					className: `h-10 rounded-lg text-sm ${tab === "pin" ? "bg-surface text-ink" : "text-stone"}`,
					children: "忘記 PIN"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab("id"),
					className: `h-10 rounded-lg text-sm ${tab === "id" ? "bg-surface text-ink" : "text-stone"}`,
					children: "忘記 ID"
				})]
			}),
			tab === "pin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: reset,
				className: "mt-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-ink-soft",
						children: "輸入電子郵件與 ID，即可重設 PIN。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "電子郵件" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: uluxId,
							onChange: (e) => setUluxId(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "新 PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinInput, {
							value: nextPin,
							onChange: setNextPin
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-accent",
						children: message
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						size: "lg",
						disabled: busy || nextPin.length !== 4,
						children: "重設 PIN"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: reveal,
				className: "mt-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-ink-soft",
						children: "輸入電子郵件與 PIN，即可顯示你的 ID。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "電子郵件" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinInput, {
							value: pin,
							onChange: setPin
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-accent",
						children: message
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						size: "lg",
						disabled: busy || pin.length !== 4,
						children: "顯示 ID"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "mt-8 text-center text-sm text-ink-soft hover:text-ink",
				children: "返回登入"
			})
		]
	});
}
//#endregion
export { Recover as component };
