import { Outlet, createFileRoute, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getProfile } from "@/lib/api/profile";
import { listCatalog } from "@/lib/api/catalog";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    enabled: !!user,
  });
  useQuery({
    queryKey: ["catalog"],
    queryFn: () => listCatalog(),
    enabled: !!user,
  });

  if (isPending) return <div className="min-h-dvh bg-paper" />;
  if (!user) return <RedirectToSignIn />;
  if (!profile.data) {
    if (profile.isLoading) return <div className="min-h-dvh bg-paper" />;
    return <Navigate to="/onboarding" />;
  }

  return (
    <AppShell nickname={profile.data.nickname}>
      <Outlet />
    </AppShell>
  );
}
