import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { checkUluxId, createProfile, getProfile } from "@/lib/api/profile";
import { BrandMark, BrandSplash } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinInput } from "@/components/pin-input";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    enabled: !!user,
  });
  const [uluxId, setUluxId] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState(user?.primaryEmail ?? "");
  const [nickname, setNickname] = useState(user?.displayName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) return <BrandSplash />;
  if (!user) return <RedirectToSignIn />;
  if (profile.isLoading) return <BrandSplash />;
  if (profile.data) return <Navigate to="/" />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const id = uluxId.trim();
      const avail = await checkUluxId({ data: { uluxId: id } });
      if (!avail.available) {
        setError("這個 ID 已被使用");
        return;
      }
      await createProfile({
        data: {
          uluxId: id,
          pin,
          email: email.trim() || user?.primaryEmail || `${id}@ulux.local`,
          nickname: nickname.trim() || "訓練者",
        },
      });
      await profile.refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "無法完成設定");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 py-12">
      <BrandMark />
      <h1 className="mt-8 text-center font-display text-2xl">設定 ULUX 帳號</h1>
      <p className="mt-2 text-center text-sm text-ink-soft">
        選擇一個永久 ID 與 4 位數 PIN。系統會以暱稱稱呼你。
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label>ID（建立後無法更改）</Label>
          <Input autoCapitalize="none" value={uluxId} onChange={(e) => setUluxId(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>PIN</Label>
          <PinInput value={pin} onChange={setPin} />
        </div>
        <div className="space-y-2">
          <Label>電子郵件</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>暱稱</Label>
          <Input value={nickname} onChange={(e) => setNickname(e.target.value)} required />
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={busy || pin.length !== 4}>
          {busy ? "儲存中…" : "開始使用"}
        </Button>
      </form>
    </main>
  );
}
