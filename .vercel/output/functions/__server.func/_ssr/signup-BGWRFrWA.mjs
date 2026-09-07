import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { n as checkUluxId, r as createProfile } from "./profile-B3yvOeUm.mjs";
import { n as BrandSplash, t as BrandMark } from "./brand-mark-QnEswasa.mjs";
import { t as Button } from "./button-B5Pio0NC.mjs";
import { t as deriveAuthPassword } from "./auth-password-ohB3HgWU.mjs";
import { n as Label, t as Input } from "./label-CD_SGPRL.mjs";
import { t as PinInput } from "./pin-input-u3fZWCsp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-BGWRFrWA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Signup() {
	const { user, isPending } = useCurrentUserState();
	const [uluxId, setUluxId] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [nickname, setNickname] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandSplash, {});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const id = uluxId.trim();
			if (!id) {
				setError("請輸入 ID");
				return;
			}
			if (!(await checkUluxId({ data: { uluxId: id } })).available) {
				setError("這個 ID 已被使用");
				return;
			}
			const { error: signErr } = await authClient.signUp.email({
				email: email.trim(),
				password: deriveAuthPassword(id, pin),
				name: nickname.trim()
			});
			if (signErr) {
				setError(signErr.message === "User already exists" ? "這個電子郵件已被使用" : "無法建立帳號");
				return;
			}
			await createProfile({ data: {
				uluxId: id,
				pin,
				email: email.trim(),
				nickname: nickname.trim()
			} });
			window.location.assign("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "建立帳號失敗");
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
				children: "建立帳號"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "id",
							children: "ID（建立後無法更改）"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "id",
							autoCapitalize: "none",
							value: uluxId,
							onChange: (e) => setUluxId(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "4 位數 PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinInput, {
							value: pin,
							onChange: setPin
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "電子郵件（僅用於找回帳號）"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "nick",
							children: "暱稱"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "nick",
							value: nickname,
							onChange: (e) => setNickname(e.target.value),
							required: true
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
						children: busy ? "建立中…" : "建立帳號"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-center text-sm text-ink-soft",
				children: [
					"已有帳號？",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-ink underline-offset-4 hover:underline",
						children: "登入"
					})
				]
			})
		]
	});
}
//#endregion
export { Signup as component };
