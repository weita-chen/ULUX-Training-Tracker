import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import { getProfile } from "@/lib/api/profile";
import {
  createSession,
  lastCompletedSession,
  openSession,
  recentExercises,
  repeatLastSession,
} from "@/lib/api/workouts";
import { TRAINING_TYPES } from "@/lib/constants";
import { formatShortDate, taipeiDateISO } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ExerciseName } from "@/components/exercise-name";
import { queryClient } from "@/lib/query";

export const Route = createFileRoute("/_app/")({ component: HomePage });

function HomePage() {
  const navigate = useNavigate();
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getProfile() });
  const open = useQuery({ queryKey: ["open-session"], queryFn: () => openSession() });
  const last = useQuery({
    queryKey: ["last-session"],
    queryFn: () => lastCompletedSession(),
  });
  const recent = useQuery({
    queryKey: ["recent-exercises"],
    queryFn: () => recentExercises({ data: {} }),
  });

  async function start(type: string) {
    setBusy(true);
    try {
      const { id } = await createSession({ data: { trainingType: type } });
      await queryClient.invalidateQueries({ queryKey: ["open-session"] });
      navigate({ to: "/workout/$sessionId", params: { sessionId: String(id) } });
    } finally {
      setBusy(false);
    }
  }

  async function repeat() {
    setBusy(true);
    try {
      const { id } = await repeatLastSession();
      navigate({ to: "/workout/$sessionId", params: { sessionId: String(id) } });
    } finally {
      setBusy(false);
    }
  }

  const nickname = profile.data?.nickname ?? "";
  const today = formatShortDate(taipeiDateISO());

  return (
    <div>
      <p className="text-sm text-stone">{today}</p>
      <h1 className="mt-1 font-display text-[2rem] leading-tight tracking-tight">
        {nickname ? `${nickname}，` : ""}
        今天練什麼？
      </h1>

      {open.data ? (
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/workout/$sessionId",
              params: { sessionId: String(open.data!.id) },
            })
          }
          className="mt-8 w-full rounded-2xl border border-accent/20 bg-accent-soft px-5 py-4 text-left"
        >
          <div className="text-xs tracking-widest text-accent">進行中</div>
          <div className="mt-1 text-base font-medium">繼續未完成的訓練</div>
        </button>
      ) : null}

      {!picking ? (
        <Button
          size="lg"
          className="mt-8 w-full"
          onClick={() => setPicking(true)}
          disabled={busy}
        >
          <Play className="size-4" strokeWidth={2} />
          開始訓練
        </Button>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3">
          {TRAINING_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={busy}
              onClick={() => start(t.id)}
              className="min-h-24 rounded-2xl border border-line bg-surface px-4 py-5 text-left transition-colors hover:border-ink/20 hover:bg-mist/40"
            >
              <div className="font-medium">{t.zh}</div>
              <div className="mt-1 text-xs text-stone">{t.en}</div>
            </button>
          ))}
        </div>
      )}

      {last.data ? (
        <button
          type="button"
          disabled={busy}
          onClick={repeat}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-left hover:bg-mist/40"
        >
          <RotateCcw className="size-4 text-stone" />
          <div>
            <div className="text-sm font-medium">重複上次訓練</div>
            <div className="text-xs text-stone">
              {last.data.title}
              {last.data.entries.length
                ? ` · ${last.data.entries.map((e) => e.exercise.nameZh).slice(0, 3).join("、")}`
                : ""}
            </div>
          </div>
        </button>
      ) : null}

      {recent.data && recent.data.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xs tracking-[0.18em] text-stone">最近使用</h2>
          <ul className="mt-3 divide-y divide-line">
            {recent.data.slice(0, 6).map((ex) => (
              <li key={ex.id} className="py-3">
                <ExerciseName zh={ex.nameZh} en={ex.nameEn} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
