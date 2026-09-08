import { cn } from "@/lib/utils";

export function BrandMark({
  size = "md",
  subtitle = true,
}: {
  size?: "sm" | "md" | "lg";
  subtitle?: boolean;
}) {
  const px = size === "lg" ? 160 : size === "sm" ? 72 : 112;
  return (
    <div className="text-center">
      <img
        src="/icons/logo.png?v=3"
        alt="ULUX"
        width={px}
        height={px}
        className="mx-auto select-none"
        style={{ width: px, height: px }}
      />
      {subtitle ? (
        <div
          className={cn(
            "tracking-[0.18em] text-stone",
            size === "lg" ? "-mt-2 text-sm" : "-mt-1 text-xs",
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
