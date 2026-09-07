import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { deriveAuthPassword } from "@/lib/auth-password";
import { resolveLogin } from "@/lib/api/profile";
import { BrandMark, BrandSplash } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinInput } from "@/components/pin-input";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [uluxId, setUluxId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) return <BrandSplash />;
  if (user) return <Navigate to="/" />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await resolveLogin({ data: { uluxId: uluxId.trim(), pin } });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const { error: authError } = await authClient.signIn.email({
        email: result.email,
        password: deriveAuthPassword(uluxId.trim(), pin),
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

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 py-12">
      <BrandMark size="lg" />
      <p className="mt-8 text-center text-sm text-ink-soft">
        以 ID 與 4 位數 PIN 登入
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="ulux-id">ID</Label>
          <Input
            id="ulux-id"
            autoCapitalize="none"
            autoCorrect="off"
            value={uluxId}
            onChange={(e) => setUluxId(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>PIN</Label>
          <PinInput value={pin} onChange={setPin} />
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={busy || pin.length !== 4}>
          {busy ? "登入中…" : "登入"}
        </Button>
      </form>
      <div className="mt-6 flex justify-between text-sm text-ink-soft">
        <Link to="/signup" className="hover:text-ink">
          建立帳號
        </Link>
        <Link to="/recover" className="hover:text-ink">
          忘記 ID / PIN
        </Link>
      </div>
      <div className="mt-10">
        <div className="mb-4 text-center text-xs tracking-widest text-stone">
          其他登入方式
        </div>
        <div className="space-y-2">
          {GROK_PROVIDERS.map((p) => (
            <Button
              key={p.providerId}
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => signIn(p.providerId, { callbackURL: "/" })}
            >
              使用 {p.label} 繼續
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
