"use client";

import { type ReactElement, useMemo, useState } from "react";
import type {
  ReelInput,
  ReelPlan,
  ToneOption,
  CallToActionOption,
} from "@/lib/generator";

const toneOptions: ToneOption[] = [
  "Energetic",
  "Educational",
  "Inspirational",
  "Playful",
  "Authority",
];

const callToActionOptions: CallToActionOption[] = [
  "Follow for more",
  "DM for details",
  "Save this tip",
  "Visit the link in bio",
  "Drop a comment",
];

const visualStyles: ReelInput["visualStyle"][] = [
  "Cinematic",
  "Lifestyle",
  "Behind the scenes",
  "ASMR",
];

const pacingOptions: ReelInput["pacing"][] = [
  "Rapid cuts",
  "Steady pacing",
  "Snappy jump cuts",
];

const durations = [15, 30, 45, 60];

const defaultForm: ReelInput = {
  niche: "Instagram growth coaching",
  audience: "busy creators",
  goal: "grow faster on Instagram",
  tone: "Energetic",
  duration: 30,
  callToAction: "Follow for more",
  visualStyle: "Lifestyle",
  pacing: "Snappy jump cuts",
};

const fieldLabelStyles =
  "text-sm font-medium text-zinc-800 dark:text-zinc-100 flex items-center gap-2";

function StatBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white/70 p-4 text-left shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <span className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
        {value}
      </span>
    </div>
  );
}

function SegmentCard({
  segment,
}: {
  segment: ReelPlan["segments"][number];
}): ReactElement {
  return (
    <article className="grid gap-2 rounded-2xl border border-zinc-100 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <span className="font-semibold text-zinc-700 dark:text-zinc-200">
          {segment.label}
        </span>
        <span>{segment.timestamp}</span>
      </div>
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
        {segment.script}
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Shot: {segment.shotIdea}
      </p>
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Direction: {segment.direction}
      </p>
    </article>
  );
}

export default function Home() {
  const [formState, setFormState] = useState<ReelInput>(defaultForm);
  const [plan, setPlan] = useState<ReelPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vibeDescriptor = useMemo(() => {
    const vibeMap: Record<ToneOption, string> = {
      Energetic: "High-impact storytelling with fast momentum.",
      Educational: "Step-by-step clarity for binge-worthy value.",
      Inspirational: "Emotion-rich narrative that sparks action.",
      Playful: "Unexpected beats to keep viewers smiling.",
      Authority: "Data-backed delivery with confident tonality.",
    };
    return vibeMap[formState.tone];
  }, [formState.tone]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate reel plan.");
      }

      setPlan(data as ReelPlan);
    } catch (err) {
      setError((err as Error).message);
      setPlan(null);
    } finally {
      setIsLoading(false);
    }
  }

  function updateField<Key extends keyof ReelInput>(
    key: Key,
    value: ReelInput[Key],
  ) {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-indigo-100 pb-24 font-sans dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <header className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pb-10 pt-16 text-center sm:text-left md:px-10">
        <p className="text-sm font-semibold uppercase text-rose-600 dark:text-rose-400">
          Reels AutoPilot
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
          Generate high-retention Instagram Reels workflows in seconds.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 md:max-w-3xl">
          Turn your idea into a full hook, shot list, caption, and posting plan.
          This builder reverse-engineers retention beats so you can shoot, edit,
          and publish without second guessing.
        </p>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 md:grid-cols-[minmax(0,1fr)_420px] md:px-10">
        <section className="space-y-6 rounded-3xl border border-zinc-100 bg-white/80 p-8 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="grid gap-3 rounded-2xl bg-rose-50 p-5 text-sm text-rose-900 dark:bg-rose-950/60 dark:text-rose-100">
            <span className="font-semibold uppercase tracking-wide text-rose-500 dark:text-rose-300">
              Creative direction
            </span>
            <p>{vibeDescriptor}</p>
            <p className="text-rose-500 dark:text-rose-400">
              Your reel will clock in at {formState.duration} seconds with{" "}
              {formState.pacing.toLowerCase()} and a{" "}
              {formState.visualStyle.toLowerCase()} aesthetic.
            </p>
          </div>

          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className={fieldLabelStyles}>What niche are we serving?</label>
              <input
                value={formState.niche}
                onChange={(event) => updateField("niche", event.target.value)}
                placeholder="e.g. Fitness coaches"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-rose-500 dark:focus:ring-rose-900"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className={fieldLabelStyles}>
                Who’s watching this reel?
              </label>
              <input
                value={formState.audience}
                onChange={(event) =>
                  updateField("audience", event.target.value)
                }
                placeholder="e.g. Busy entrepreneurs"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-rose-500 dark:focus:ring-rose-900"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className={fieldLabelStyles}>
                What result or goal are we promising?
              </label>
              <textarea
                value={formState.goal}
                onChange={(event) => updateField("goal", event.target.value)}
                placeholder="e.g. Land 3 discovery calls a week"
                className="min-h-[90px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-rose-500 dark:focus:ring-rose-900"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label className={fieldLabelStyles}>Tone</label>
                <select
                  value={formState.tone}
                  onChange={(event) =>
                    updateField("tone", event.target.value as ToneOption)
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-rose-500 dark:focus:ring-rose-900"
                >
                  {toneOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className={fieldLabelStyles}>Duration</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={durations[0]}
                    max={durations[durations.length - 1]}
                    step={15}
                    value={formState.duration}
                    onChange={(event) =>
                      updateField("duration", Number(event.target.value))
                    }
                    className="h-2 flex-1 rounded-full accent-rose-500"
                  />
                  <span className="w-14 text-sm font-semibold text-rose-500 dark:text-rose-300">
                    {formState.duration}s
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label className={fieldLabelStyles}>Visual style</label>
                <div className="grid gap-2">
                  {visualStyles.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => updateField("visualStyle", style)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                        formState.visualStyle === style
                          ? "border-rose-400 bg-rose-100 text-rose-900 shadow-sm dark:border-rose-500 dark:bg-rose-950/60 dark:text-rose-100"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-rose-300 hover:text-rose-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-rose-500 dark:hover:text-rose-200"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <label className={fieldLabelStyles}>Pacing</label>
                <div className="grid gap-2">
                  {pacingOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateField("pacing", option)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                        formState.pacing === option
                          ? "border-rose-400 bg-rose-100 text-rose-900 shadow-sm dark:border-rose-500 dark:bg-rose-950/60 dark:text-rose-100"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-rose-300 hover:text-rose-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-rose-500 dark:hover:text-rose-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <label className={fieldLabelStyles}>
                Call to action
              </label>
              <select
                value={formState.callToAction}
                onChange={(event) =>
                  updateField(
                    "callToAction",
                    event.target.value as CallToActionOption,
                  )
                }
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-rose-500 dark:focus:ring-rose-900"
              >
                {callToActionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400">
              <span>
                Need another variation? Adjust the fields and hit generate.
              </span>
              <span className="hidden text-xs uppercase tracking-wide text-rose-500 sm:block">
                Auto-build ready to shoot
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-2xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-not-allowed disabled:bg-rose-300 dark:bg-rose-600 dark:hover:bg-rose-500 dark:focus:ring-rose-900"
            >
              {isLoading ? "Generating..." : "Generate reel automation"}
            </button>
          </form>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-200">
              {error}
            </p>
          )}
        </section>

        <aside className="space-y-4">
          {plan ? (
            <>
              <div className="grid gap-3 rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Hook &amp; promise
                </h2>
                <p className="text-base font-medium text-rose-500 dark:text-rose-300">
                  {plan.hook}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {plan.promise}
                </p>
              </div>

              <div className="grid gap-3 rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Beat-by-beat workflow
                </h2>
                <div className="grid gap-3">
                  {plan.segments.map((segment) => (
                    <SegmentCard key={segment.label} segment={segment} />
                  ))}
                </div>
              </div>

              <div className="grid gap-4 rounded-3xl border border-zinc-100 bg-white/90 p-6 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Captions &amp; boosts
                </h2>
                <div className="grid gap-3">
                  <div className="grid gap-2 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-300">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      Caption
                    </span>
                    <p>{plan.caption}</p>
                  </div>

                  <div className="grid gap-2 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-300">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      Hashtags
                    </span>
                    <p className="flex flex-wrap gap-2">
                      {plan.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-500 dark:bg-rose-900/40 dark:text-rose-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </p>
                  </div>

                  <StatBadge label="Audio cue" value={plan.audioIdea} />
                  <StatBadge label="Call to action" value={plan.cta} />
                </div>
              </div>

              <div className="grid gap-4 rounded-3xl border border-zinc-100 bg-white/90 p-6 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Execution extras
                </h2>
                <div className="grid gap-3">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Transitions
                    </p>
                    <ul className="grid gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {plan.transitions.map((transition) => (
                        <li
                          key={transition}
                          className="rounded-xl bg-zinc-50/80 px-4 py-2 dark:bg-zinc-950/30"
                        >
                          {transition}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Engagement prompts
                    </p>
                    <ul className="grid gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {plan.engagementPrompts.map((prompt) => (
                        <li
                          key={prompt}
                          className="rounded-xl bg-zinc-50/80 px-4 py-2 dark:bg-zinc-950/30"
                        >
                          {prompt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Posting tips
                    </p>
                    <ul className="grid gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {plan.postingTips.map((tip) => (
                        <li
                          key={tip}
                          className="rounded-xl bg-zinc-50/80 px-4 py-2 dark:bg-zinc-950/30"
                        >
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[480px] flex-col items-center justify-center rounded-3xl border border-dashed border-rose-200 bg-white/60 p-12 text-center text-rose-500 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
              <p className="text-lg font-semibold">
                Your reel automation will land here.
              </p>
              <p className="mt-2 text-sm text-rose-400 dark:text-rose-400/80">
                Fill the brief and generate to see hooks, shots, captions, and
                publishing tips.
              </p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
