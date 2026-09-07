import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, CalendarDays, House, Settings, Weight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "首頁", icon: House },
  { to: "/history", label: "紀錄", icon: CalendarDays },
  { to: "/progress", label: "進度", icon: BarChart3 },
  { to: "/inbody", label: "InBody", icon: Weight },
  { to: "/settings", label: "設定", icon: Settings },
] as const;

export function AppShell({
  nickname,
  children,
}: {
  nickname: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <aside className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-surface/95 backdrop-blur-sm md:bottom-auto md:top-0 md:h-dvh md:w-56 md:border-r md:border-t-0">
        <div className="hidden px-6 pb-4 pt-8 md:block">
          <div className="font-display text-2xl tracking-tight">ULUX</div>
          <div className="mt-0.5 text-[11px] tracking-[0.18em] text-stone">
            有練有差
          </div>
          <div className="mt-6 truncate text-sm text-ink-soft">{nickname}</div>
        </div>
        <nav className="flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1 md:flex-col md:gap-1 md:px-3 md:pb-6 md:pt-2">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] md:min-h-11 md:flex-none md:flex-row md:justify-start md:gap-3 md:px-3 md:text-sm",
                  active ? "text-accent font-medium" : "text-stone hover:text-ink",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.2 : 1.7} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="mx-auto w-full max-w-lg px-5 pb-28 pt-8 md:ml-56 md:max-w-xl md:pb-16 md:pt-12">
        {children}
      </main>
    </div>
  );
}
