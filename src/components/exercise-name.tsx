import { cn } from "@/lib/utils";

export function ExerciseName({
  zh,
  en,
  size = "md",
}: {
  zh: string;
  en?: string | null;
  size?: "sm" | "md";
}) {
  return (
    <div>
      <div
        className={cn(
          "text-ink",
          size === "md" ? "text-base font-medium" : "text-sm font-medium",
        )}
      >
        {zh}
        {en ? (
          <span className="font-normal text-stone">
            {" "}
            — {en}
          </span>
        ) : null}
      </div>
    </div>
  );
}
