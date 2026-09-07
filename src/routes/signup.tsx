import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { deriveAuthPassword } from "@/lib/auth-password";
import { checkUluxId, createProfile } from "@/lib/api/profile";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinInput } from "@/components/pin-input";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const { user, isPending } = useCurrentUserState();
  const [uluxId, setUluxId] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) return <Navigate to="/" />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const id = uluxId.trim();
      if (!id) {
        setError("請輸入 ID");
        return;
      }
      const avail = await checkUluxId({ data: { uluxId: id } });
      if (!avail.available) {
        setError("這個 ID 已被使用");
        return;
      }
      const { error: signErr } = await authClient.signUp.email({
        email: email.trim(),
        password: deriveAuthPassword(id, pin),
        name: nickname.trim(),
      });
      if (signErr) {
        setError(signErr.message === "User already exists" ? "這個電子郵件已被使用" : "無法建立帳號");
        return;
      }
      await createProfile({
        data: { uluxId: id, pin, email: email.trim(), nickname: nickname.trim() },
      });
      window.location.assign("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立帳號失敗");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 py-12">
      <BrandMark />
      <h1 className="mt-8 text-center font-display text-2xl">建立帳號</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="id">ID（建立後無法更改）</Label>
          <Input
            id="id"
            autoCapitalize="none"
            value={uluxId}
            onChange={(e) => setUluxId(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>4 位數 PIN</Label>
          <PinInput value={pin} onChange={setPin} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">電子郵件（僅用於找回帳號）</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nick">暱稱</Label>
          <Input
            id="nick"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={busy || pin.length !== 4}>
          {busy ? "建立中…" : "建立帳號"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        已有帳號？{" "}
        <Link to="/login" className="text-ink underline-offset-4 hover:underline">
          登入
        </Link>
      </p>
    </main>
  );
}
