import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
import { i as getProfile, n as checkUluxId, r as createProfile } from "./profile-B3yvOeUm.mjs";
import { n as BrandSplash, t as BrandMark } from "./brand-mark-QnEswasa.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-B5Pio0NC.mjs";
import { n as Label, t as Input } from "./label-CD_SGPRL.mjs";
import { t as PinInput } from "./pin-input-u3fZWCsp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-DQb6A1cj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getProfile(),
		enabled: !!user
	});
	const [uluxId, setUluxId] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)(user?.primaryEmail ?? "");
	const [nickname, setNickname] = (0, import_react.useState)(user?.displayName ?? "");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandSplash, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (profile.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandSplash, {});
	if (profile.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const id = uluxId.trim();
			if (!(await checkUluxId({ data: { uluxId: id } })).available) {
				setError("這個 ID 已被使用");
				return;
			}
			await createProfile({ data: {
				uluxId: id,
				pin,
				email: email.trim() || user?.primaryEmail || `${id}@ulux.local`,
				nickname: nickname.trim() || "訓練者"
			} });
			await profile.refetch();
		} catch (err) {
			setError(err instanceof Error ? err.message : "無法完成設定");
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
				children: "設定 ULUX 帳號"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-center text-sm text-ink-soft",
				children: "選擇一個永久 ID 與 4 位數 PIN。系統會以暱稱稱呼你。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ID（建立後無法更改）" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							autoCapitalize: "none",
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "暱稱" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
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
						children: busy ? "儲存中…" : "開始使用"
					})
				]
			})
		]
	});
}
//#endregion
export { Onboarding as component };
