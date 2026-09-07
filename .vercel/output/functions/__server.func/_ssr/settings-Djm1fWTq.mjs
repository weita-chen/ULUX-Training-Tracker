import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { t as authMiddleware } from "./middleware-C58uFI_W.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { c as updateNickname, i as getProfile, t as changePin } from "./profile-B3yvOeUm.mjs";
import { u as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as hasGateSessionMarker } from "./server-BFt31BGu.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as queryClient } from "./router-1VK6ebCg.mjs";
import { t as Button } from "./button-B5Pio0NC.mjs";
import { n as Label, t as Input } from "./label-CD_SGPRL.mjs";
import { t as PinInput } from "./pin-input-u3fZWCsp.mjs";
import { n as DialogFrame } from "./alert-dialog-toK3Ox_k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-Djm1fWTq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var exportWorkbook = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("cb1054eb29629ef6d9fdb03358a64278ebab035d584978e0827e4d4c76dbba8d"));
function SettingsPage() {
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getProfile()
	});
	const [nick, setNick] = (0, import_react.useState)(profile.data?.nickname ?? "");
	const [nickOpen, setNickOpen] = (0, import_react.useState)(false);
	const [pinOpen, setPinOpen] = (0, import_react.useState)(false);
	const [curPin, setCurPin] = (0, import_react.useState)("");
	const [nextPin, setNextPin] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const gate = typeof document !== "undefined" && hasGateSessionMarker();
	async function saveNick() {
		setBusy(true);
		try {
			await updateNickname({ data: { nickname: nick } });
			await queryClient.invalidateQueries({ queryKey: ["profile"] });
			setNickOpen(false);
			toast("暱稱已更新");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "無法更新");
		} finally {
			setBusy(false);
		}
	}
	async function savePin() {
		setBusy(true);
		try {
			await changePin({ data: {
				currentPin: curPin,
				nextPin
			} });
			setPinOpen(false);
			setCurPin("");
			setNextPin("");
			toast("PIN 已更新");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "無法更新 PIN");
		} finally {
			setBusy(false);
		}
	}
	async function exportXlsx() {
		setBusy(true);
		try {
			const { filename, base64 } = await exportWorkbook();
			const bin = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
			const blob = new Blob([bin], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			a.click();
			URL.revokeObjectURL(url);
			toast("已匯出 Excel");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "匯出失敗");
		} finally {
			setBusy(false);
		}
	}
	const p = profile.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl tracking-tight",
			children: "設定"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 rounded-2xl border border-line bg-surface",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "暱稱",
					value: p?.nickname,
					onClick: () => {
						setNick(p?.nickname ?? "");
						setNickOpen(true);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "ID",
					value: p?.uluxId
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "電子郵件",
					value: p?.email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "變更 PIN",
					onClick: () => setPinOpen(true)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 rounded-2xl border border-line bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/settings/exercises",
				className: "flex min-h-14 items-center justify-between px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "自訂動作" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-stone" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex min-h-14 w-full items-center justify-between px-4 text-left",
				onClick: exportXlsx,
				disabled: busy,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "匯出 Excel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-stone" })]
			})]
		}),
		!gate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			className: "mt-8 w-full",
			onClick: () => void signOut().catch(() => toast.error("登出失敗")),
			children: "登出"
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-10 text-center text-[11px] tracking-[0.2em] text-stone",
			children: "ULUX · 有練有差"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFrame, {
			open: nickOpen,
			onOpenChange: setNickOpen,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "暱稱"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "新暱稱" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: nick,
						onChange: (e) => setNick(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full",
					onClick: saveNick,
					disabled: busy,
					children: "儲存"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFrame, {
			open: pinOpen,
			onOpenChange: setPinOpen,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "變更 PIN"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "目前 PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinInput, {
							value: curPin,
							onChange: setCurPin
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "新 PIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinInput, {
							value: nextPin,
							onChange: setNextPin
						})
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full",
					onClick: savePin,
					disabled: busy || curPin.length !== 4 || nextPin.length !== 4,
					children: "儲存"
				})
			]
		})
	] });
}
function Row({ label, value, onClick }) {
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm",
		children: label
	}), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs text-stone",
		children: value
	}) : null] }), onClick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-stone" }) : null] });
	if (onClick) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: "flex min-h-14 w-full items-center justify-between px-4 text-left",
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-14 items-center justify-between px-4",
		children: inner
	});
}
//#endregion
export { SettingsPage as component };
