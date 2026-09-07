import { d as require_jsx_runtime } from "./_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link, y as Navigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as useCurrentUserState } from "./_ssr/use-current-user-Q8r4NahO.mjs";
import { t as RedirectToSignIn } from "./_ssr/gates-CUxTjxua.mjs";
import { i as getProfile } from "./_ssr/profile-B3yvOeUm.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { n as BrandSplash } from "./_ssr/brand-mark-QnEswasa.mjs";
import { i as Settings, l as House, m as CalendarDays, p as ChartColumn } from "./_libs/lucide-react.mjs";
import { t as useQuery } from "./_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-DUVvq8Dc.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/",
		label: "首頁",
		icon: House
	},
	{
		to: "/history",
		label: "紀錄",
		icon: CalendarDays
	},
	{
		to: "/progress",
		label: "進度",
		icon: ChartColumn
	},
	{
		to: "/settings",
		label: "設定",
		icon: Settings
	}
];
function AppShell({ nickname, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-surface/95 backdrop-blur-sm md:bottom-auto md:top-0 md:h-dvh md:w-56 md:border-r md:border-t-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden px-6 pb-4 pt-8 md:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-2xl tracking-tight",
						children: "ULUX"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[11px] tracking-[0.18em] text-stone",
						children: "有練有差"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 truncate text-sm text-ink-soft",
						children: nickname
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1 md:flex-col md:gap-1 md:px-3 md:pb-6 md:pt-2",
				children: NAV.map((item) => {
					const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(item.to + "/");
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] md:min-h-11 md:flex-none md:flex-row md:justify-start md:gap-3 md:px-3 md:text-sm", active ? "text-accent font-medium" : "text-stone hover:text-ink"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							strokeWidth: active ? 2.2 : 1.7
						}), item.label]
					}, item.to);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto w-full max-w-lg px-5 pb-28 pt-8 md:ml-56 md:max-w-xl md:pb-16 md:pt-12",
			children
		})]
	});
}
function AppLayout() {
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getProfile(),
		enabled: !!user
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandSplash, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (profile.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandSplash, {});
	if (!profile.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		nickname: profile.data.nickname,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
//#endregion
export { AppLayout as component };
