import { Outlet, createFileRoute, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getProfile } from "@/lib/api/profile";
import { AppShell } from "@/components/app-shell";
import { BrandSplash } from "@/components/brand-mark";

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

  if (isPending) return <BrandSplash />;
  if (!user) return <RedirectToSignIn />;
  if (profile.isLoading) return <BrandSplash />;
  if (!profile.data) return <Navigate to="/onboarding" />;

  return (
    <AppShell nickname={profile.data.nickname}>
      <Outlet />
    </AppShell>
  );
}
