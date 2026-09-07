import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "確認",
  danger,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
}) {
  useEscape(open, () => onOpenChange(false));
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-overlay"
        aria-label="關閉"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className={cn(
          "absolute left-1/2 top-1/2 w-[min(92vw,380px)] -translate-x-1/2 -translate-y-1/2",
          "rounded-2xl bg-surface p-6 shadow-soft",
        )}
      >
        <h2 id="confirm-title" className="font-display text-xl text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DialogFrame({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: ReactNode;
}) {
  useEscape(open, () => onOpenChange(false));
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-overlay"
        aria-label="關閉"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute left-1/2 top-1/2 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2",
          "max-h-[86vh] overflow-y-auto rounded-2xl bg-surface p-6 pt-12 shadow-soft",
        )}
      >
        <button
          type="button"
          className="absolute right-3 top-3 grid size-11 place-items-center text-stone"
          aria-label="關閉"
          onClick={() => onOpenChange(false)}
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
