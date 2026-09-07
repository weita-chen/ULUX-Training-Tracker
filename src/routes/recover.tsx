import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { recoverResetPin, recoverRevealId } from "@/lib/api/profile";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinInput } from "@/components/pin-input";

export const Route = createFileRoute("/recover")({ component: Recover });

function Recover() {
  const [tab, setTab] = useState<"id" | "pin">("pin");
  const [email, setEmail] = useState("");
  const [uluxId, setUluxId] = useState("");
  const [pin, setPin] = useState("");
  const [nextPin, setNextPin] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reveal(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const r = await recoverRevealId({ data: { email, pin } });
      if (!r.ok) setError(r.error);
      else setMessage(`你的 ID 是 ${r.uluxId}`);
    } finally {
      setBusy(false);
    }
  }

  async function reset(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const r = await recoverResetPin({
        data: { email, uluxId, nextPin },
      });
      if (!r.ok) setError(r.error);
      else setMessage("PIN 已重設，請以新 PIN 登入。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6 py-12">
      <BrandMark />
      <h1 className="mt-8 text-center font-display text-2xl">找回帳號</h1>
      <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-mist p-1">
        <button
          type="button"
          onClick={() => setTab("pin")}
          className={`h-10 rounded-lg text-sm ${tab === "pin" ? "bg-surface text-ink" : "text-stone"}`}
        >
          忘記 PIN
        </button>
        <button
          type="button"
          onClick={() => setTab("id")}
          className={`h-10 rounded-lg text-sm ${tab === "id" ? "bg-surface text-ink" : "text-stone"}`}
        >
          忘記 ID
        </button>
      </div>

      {tab === "pin" ? (
        <form onSubmit={reset} className="mt-6 space-y-4">
          <p className="text-sm leading-relaxed text-ink-soft">
            輸入電子郵件與 ID，即可重設 PIN。
          </p>
          <div className="space-y-2">
            <Label>電子郵件</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>ID</Label>
            <Input value={uluxId} onChange={(e) => setUluxId(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>新 PIN</Label>
            <PinInput value={nextPin} onChange={setNextPin} />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {message ? <p className="text-sm text-accent">{message}</p> : null}
          <Button type="submit" className="w-full" size="lg" disabled={busy || nextPin.length !== 4}>
            重設 PIN
          </Button>
        </form>
      ) : (
        <form onSubmit={reveal} className="mt-6 space-y-4">
          <p className="text-sm leading-relaxed text-ink-soft">
            輸入電子郵件與 PIN，即可顯示你的 ID。
          </p>
          <div className="space-y-2">
            <Label>電子郵件</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>PIN</Label>
            <PinInput value={pin} onChange={setPin} />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {message ? <p className="text-sm text-accent">{message}</p> : null}
          <Button type="submit" className="w-full" size="lg" disabled={busy || pin.length !== 4}>
            顯示 ID
          </Button>
        </form>
      )}
      <Link to="/login" className="mt-8 text-center text-sm text-ink-soft hover:text-ink">
        返回登入
      </Link>
    </main>
  );
}
