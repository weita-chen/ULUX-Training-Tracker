import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { s as resolveLogin } from "./profile-B3yvOeUm.mjs";
import { n as BrandSplash, t as BrandMark } from "./brand-mark-QnEswasa.mjs";
import { o as GROK_PROVIDERS } from "./server-BFt31BGu.mjs";
import { t as Button } from "./button-B5Pio0NC.mjs";
import { t as deriveAuthPassword } from "./auth-password-ohB3HgWU.mjs";
import { n as Label, t as Input } from "./label-CD_SGPRL.mjs";
import { t as PinInput } from "./pin-input-u3fZWCsp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-C9KZyKGm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [uluxId, setUluxId] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandSplash, {});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const result = await resolveLogin({ data: {
				uluxId: uluxId.trim(),
				pin
			} });
			if (!result.ok) {
				setError(result.error);
				return;
			}
			const { error: authError } = await authClient.signIn.email({
				email: result.email,
				password: deriveAuthPassword(uluxId.trim(), pin)
			});
			if (authError) {
				setError("帳號或 PIN 不正確，或請改用其他登入方式");
				return;
			}
			window.location.assign("/");
		} catch {
			setError("登入失敗，請再試一次");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, { size: "lg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-center text-sm text-ink-soft",
				children: "以 ID 與 4 位數 PIN 登入"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ulux-id",
							children: "ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ulux-id",
							autoCapitalize: "none",
							autoCorrect: "off",
							value: uluxId,
							onChange: (e) => setUluxId(e.target.value),
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						className: "w-full",
						disabled: busy || pin.length !== 4,
						children: busy ? "登入中…" : "登入"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex justify-between text-sm text-ink-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/signup",
					className: "hover:text-ink",
					children: "建立帳號"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/recover",
					className: "hover:text-ink",
					children: "忘記 ID / PIN"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 text-center text-xs tracking-widest text-stone",
					children: "其他登入方式"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "secondary",
						className: "w-full",
						onClick: () => signIn(p.providerId, { callbackURL: "/" }),
						children: [
							"使用 ",
							p.label,
							" 繼續"
						]
					}, p.providerId))
				})]
			})
		]
	});
}
//#endregion
export { Login as component };
