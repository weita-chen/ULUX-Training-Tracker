import { cn } from "@/lib/utils";

export function BrandMark({
  size = "md",
  subtitle = true,
}: {
  size?: "sm" | "md" | "lg";
  subtitle?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={cn(
          "font-display font-medium tracking-tight text-ink",
          size === "sm" && "text-xl",
          size === "md" && "text-3xl",
          size === "lg" && "text-5xl",
        )}
      >
        ULUX
      </div>
      {subtitle ? (
        <div
          className={cn(
            "mt-1 tracking-[0.18em] text-stone",
            size === "lg" ? "text-sm" : "text-xs",
          )}
        >
          有練有差
        </div>
      ) : null}
    </div>
  );
}

export function BrandSplash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-6">
      <BrandMark size="lg" />
    </div>
  );
}
