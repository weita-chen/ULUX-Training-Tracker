import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { signOut } from "@/lib/auth/client";
import { authEnabled } from "@/lib/auth/client";
import { changePin, getProfile, updateNickname } from "@/lib/api/profile";
import { exportWorkbook } from "@/lib/api/export";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinInput } from "@/components/pin-input";
import { DialogFrame } from "@/components/ui/alert-dialog";
import { queryClient } from "@/lib/query";

export const Route = createFileRoute("/_app/settings/")({ component: SettingsPage });

function SettingsPage() {
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getProfile() });
  const [nick, setNick] = useState(profile.data?.nickname ?? "");
  const [nickOpen, setNickOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [curPin, setCurPin] = useState("");
  const [nextPin, setNextPin] = useState("");
  const [busy, setBusy] = useState(false);
  const gate = typeof document !== "undefined" && hasGateSessionMarker();

  function closeNick() {
    setNickOpen(false);
    setNick(profile.data?.nickname ?? "");
  }

  function closePin() {
    setPinOpen(false);
    setCurPin("");
    setNextPin("");
  }

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
      await changePin({ data: { currentPin: curPin, nextPin } });
      closePin();
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
      const blob = new Blob([bin], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
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

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">設定</h1>

      <section className="mt-8 rounded-2xl border border-line bg-surface">
        <Row
          label="暱稱"
          value={p?.nickname}
          onClick={() => {
            setNick(p?.nickname ?? "");
            setNickOpen(true);
          }}
        />
        <Row label="ID" value={p?.uluxId} />
        <Row label="電子郵件" value={p?.email} />
        <Row label="變更 PIN" onClick={() => setPinOpen(true)} />
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-surface">
        <Link
          to="/settings/exercises"
          className="flex min-h-14 items-center justify-between px-4"
        >
          <span>自訂動作</span>
          <ChevronRight className="size-4 text-stone" />
        </Link>
        <button
          type="button"
          className="flex min-h-14 w-full items-center justify-between px-4 text-left"
          onClick={exportXlsx}
          disabled={busy}
        >
          <span>匯出 Excel</span>
          <ChevronRight className="size-4 text-stone" />
        </button>
      </section>

      {authEnabled && !gate ? (
        <Button
          variant="outline"
          className="mt-8 w-full"
          onClick={() => void signOut().catch(() => toast.error("登出失敗"))}
        >
          登出
        </Button>
      ) : null}

      <p className="mt-10 text-center text-[11px] tracking-[0.2em] text-stone">
        ULUX · 有練有差
      </p>

      <DialogFrame open={nickOpen} onOpenChange={(v) => (v ? setNickOpen(true) : closeNick())}>
        <h2 className="font-display text-xl">暱稱</h2>
        <div className="mt-4 space-y-2">
          <Label>新暱稱</Label>
          <Input value={nick} onChange={(e) => setNick(e.target.value)} />
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={closeNick}>
            取消
          </Button>
          <Button className="flex-1" onClick={saveNick} disabled={busy || !nick.trim()}>
            儲存
          </Button>
        </div>
      </DialogFrame>

      <DialogFrame open={pinOpen} onOpenChange={(v) => (v ? setPinOpen(true) : closePin())}>
        <h2 className="font-display text-xl">變更 PIN</h2>
        <div className="mt-5 space-y-4">
          <div>
            <Label>目前 PIN</Label>
            <div className="mt-2">
              <PinInput value={curPin} onChange={setCurPin} />
            </div>
          </div>
          <div>
            <Label>新 PIN</Label>
            <div className="mt-2">
              <PinInput value={nextPin} onChange={setNextPin} />
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={closePin}>
            取消
          </Button>
          <Button
            className="flex-1"
            onClick={savePin}
            disabled={busy || curPin.length !== 4 || nextPin.length !== 4}
          >
            儲存
          </Button>
        </div>
      </DialogFrame>
    </div>
  );
}

function Row({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <div>
        <div className="text-sm">{label}</div>
        {value ? <div className="text-xs text-stone">{value}</div> : null}
      </div>
      {onClick ? <ChevronRight className="size-4 text-stone" /> : null}
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-14 w-full items-center justify-between px-4 text-left"
      >
        {inner}
      </button>
    );
  }
  return <div className="flex min-h-14 items-center justify-between px-4">{inner}</div>;
}
