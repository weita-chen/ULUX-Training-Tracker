import { o as __toESM } from "./_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "./_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { b as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as getProfile } from "./_ssr/profile-B3yvOeUm.mjs";
import { a as RotateCcw, s as Play } from "./_libs/lucide-react.mjs";
import { t as useQuery } from "./_libs/tanstack__react-query.mjs";
import { l as formatShortDate, p as taipeiDateISO, t as TRAINING_TYPES } from "./_ssr/format-BsGHnvak.mjs";
import { r as queryClient } from "./_ssr/router-1VK6ebCg.mjs";
import { f as openSession, i as createSession, l as lastCompletedSession, m as repeatLastSession, p as recentExercises } from "./_ssr/workouts-DLq5-1b9.mjs";
import { t as Button } from "./_ssr/button-B5Pio0NC.mjs";
import { t as ExerciseName } from "./_ssr/exercise-name-BBKRngbv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-kuAeOj18.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HomePage() {
	const navigate = useNavigate();
	const [picking, setPicking] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getProfile()
	});
	const open = useQuery({
		queryKey: ["open-session"],
		queryFn: () => openSession()
	});
	const last = useQuery({
		queryKey: ["last-session"],
		queryFn: () => lastCompletedSession()
	});
	const recent = useQuery({
		queryKey: ["recent-exercises"],
		queryFn: () => recentExercises({ data: {} })
	});
	async function start(type) {
		setBusy(true);
		try {
			const { id } = await createSession({ data: { trainingType: type } });
			await queryClient.invalidateQueries({ queryKey: ["open-session"] });
			navigate({
				to: "/workout/$sessionId",
				params: { sessionId: String(id) }
			});
		} finally {
			setBusy(false);
		}
	}
	async function repeat() {
		setBusy(true);
		try {
			const { id } = await repeatLastSession();
			navigate({
				to: "/workout/$sessionId",
				params: { sessionId: String(id) }
			});
		} finally {
			setBusy(false);
		}
	}
	const nickname = profile.data?.nickname ?? "";
	const today = formatShortDate(taipeiDateISO());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-stone",
			children: today
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "mt-1 font-display text-[2rem] leading-tight tracking-tight",
			children: [nickname ? `${nickname}，` : "", "今天練什麼？"]
		}),
		open.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => navigate({
				to: "/workout/$sessionId",
				params: { sessionId: String(open.data.id) }
			}),
			className: "mt-8 w-full rounded-2xl border border-accent/20 bg-accent-soft px-5 py-4 text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs tracking-widest text-accent",
				children: "進行中"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-base font-medium",
				children: "繼續未完成的訓練"
			})]
		}) : null,
		!picking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "lg",
			className: "mt-8 w-full",
			onClick: () => setPicking(true),
			disabled: busy,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
				className: "size-4",
				strokeWidth: 2
			}), "開始訓練"]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid grid-cols-2 gap-3",
			children: TRAINING_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: busy,
				onClick: () => start(t.id),
				className: "min-h-24 rounded-2xl border border-line bg-surface px-4 py-5 text-left transition-colors hover:border-ink/20 hover:bg-mist/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: t.zh
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs text-stone",
					children: t.en
				})]
			}, t.id))
		}),
		last.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			disabled: busy,
			onClick: repeat,
			className: "mt-4 flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-left hover:bg-mist/40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4 text-stone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: "重複上次訓練"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-stone",
				children: [last.data.title, last.data.entries.length ? ` · ${last.data.entries.map((e) => e.exercise.nameZh).slice(0, 3).join("、")}` : ""]
			})] })]
		}) : null,
		recent.data && recent.data.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs tracking-[0.18em] text-stone",
				children: "最近使用"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-line",
				children: recent.data.slice(0, 6).map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseName, {
						zh: ex.nameZh,
						en: ex.nameEn
					})
				}, ex.id))
			})]
		}) : null
	] });
}
//#endregion
export { HomePage as component };
