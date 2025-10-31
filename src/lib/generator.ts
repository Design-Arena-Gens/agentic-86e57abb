import { createSeededRandom, pickOne, shuffle } from "./seededRandom";

export type ToneOption =
  | "Energetic"
  | "Educational"
  | "Inspirational"
  | "Playful"
  | "Authority";

export type CallToActionOption =
  | "Follow for more"
  | "DM for details"
  | "Save this tip"
  | "Visit the link in bio"
  | "Drop a comment";

export interface ReelInput {
  niche: string;
  audience: string;
  goal: string;
  tone: ToneOption;
  duration: number;
  callToAction: CallToActionOption;
  visualStyle: "Cinematic" | "Lifestyle" | "Behind the scenes" | "ASMR";
  pacing: "Rapid cuts" | "Steady pacing" | "Snappy jump cuts";
}

export interface ReelSegment {
  label: string;
  timestamp: string;
  shotIdea: string;
  script: string;
  direction: string;
}

export interface ReelPlan {
  hook: string;
  promise: string;
  segments: ReelSegment[];
  caption: string;
  hashtags: string[];
  cta: string;
  audioIdea: string;
  transitions: string[];
  postingTips: string[];
  engagementPrompts: string[];
}

const vibeDescriptors: Record<ToneOption, string[]> = {
  Energetic: [
    "fast-paced",
    "vibrant",
    "high-energy",
    "dynamic",
    "punchy",
    "bold",
  ],
  Educational: [
    "clear",
    "practical",
    "step-by-step",
    "actionable",
    "insightful",
    "structured",
  ],
  Inspirational: [
    "soul-stirring",
    "uplifting",
    "visionary",
    "transformative",
    "hopeful",
    "motivating",
  ],
  Playful: [
    "light-hearted",
    "quirky",
    "fun",
    "unexpected",
    "cheeky",
    "fresh",
  ],
  Authority: [
    "expert-backed",
    "data-driven",
    "confident",
    "trusted",
    "credible",
    "insider",
  ],
};

const hookTemplates: Record<ToneOption, string[]> = {
  Energetic: [
    "Stop scrolling! {niche} pros swear by this {goal} play.",
    "POV: You need a {duration}-second boost to {goal}.",
    "Ready for a {duration} second {niche} glow-up? Watch this.",
  ],
  Educational: [
    "{duration} seconds to master {goal} for {audience}.",
    "Three micro-habits to {goal} without burning out.",
    "Want to {goal}? Repeat these {niche} moves.",
  ],
  Inspirational: [
    "From {niche} dreamer to {goal} achiever—here’s the roadmap.",
    "Feeling stuck chasing {goal}? This mindset flip changes everything.",
    "Imagine hitting {goal} faster than you thought possible.",
  ],
  Playful: [
    "If {audience} were honest about {goal}…",
    "{niche} hack so good you’ll gatekeep it from your BFFs.",
    "Warning: Trying this might make {goal} your new flex.",
  ],
  Authority: [
    "Here’s what top {niche} creators do for unstoppable {goal}.",
    "Steal this {duration}-second SOP to {goal}.",
    "We audited {niche} data—here’s the {goal} playbook.",
  ],
};

const promiseTemplates: Record<ToneOption, string[]> = {
  Energetic: [
    "Stick around for the final frame—your {goal} fast-pass lives there.",
    "You’ll leave with a plug-and-play routine to {goal} today.",
  ],
  Educational: [
    "Save this breakdown—each beat stacks towards long-term {goal}.",
    "By the end, you’ll have a replicable {goal} system.",
  ],
  Inspirational: [
    "Let this be proof that {goal} is closer than you think.",
    "If you needed a sign to go all-in on {goal}, this is it.",
  ],
  Playful: [
    "Let’s turn {goal} into a plot twist even you didn’t see coming.",
    "Can you count how many {niche} Easter eggs we hid?",
  ],
  Authority: [
    "Every beat is benchmark-backed—screenshot the flow.",
    "Follow each segment and track measurable {goal} wins.",
  ],
};

const transitionIdeas = [
  "Snap transition into a close-up for emphasis.",
  "Match cut to the next shot using hand swipe.",
  "Quick whip-pan revealing the next scene.",
  "Use a text overlay to bridge the story.",
  "J-cut with audio leading into the next segment.",
];

const audioSuggestions = [
  "Trending remixed track with upbeat tempo.",
  "Ambient lo-fi beat for a calmer vibe.",
  "Vocal chop loop that hits on every beat drop.",
  "Percussive clap track to sync quick cuts.",
  "Cinematic build with risers for dramatic impact.",
];

const engagementPrompts = [
  "Drop a 🚀 if you’re trying this.",
  "Comment your biggest {goal} challenge.",
  "Tag a friend who needs this energy.",
  "Would you tweak this routine? Tell me how.",
  "What should part two cover? Let me know.",
];

const postingTips = [
  "Add on-screen captions so muted viewers stay engaged.",
  "Pin the key takeaway comment to boost watch-time.",
  "Reply to early comments with a bonus tip to spark threads.",
  "Stack Stories with the reel to drive cross-channel traffic.",
  "Set a cover frame that teases the hook in text.",
  "Schedule during peak audience hours you identified in Insights.",
];

const segmentBlueprints: Array<
  Omit<ReelSegment, "timestamp" | "shotIdea" | "script" | "direction"> & {
    role: "Hook" | "Value" | "Depth" | "SocialProof" | "CTA";
  }
> = [
  { label: "Open Strong", role: "Hook" },
  { label: "Deliver Value", role: "Value" },
  { label: "Add Depth", role: "Depth" },
  { label: "Social Proof", role: "SocialProof" },
  { label: "Close with CTA", role: "CTA" },
];

function humanizeNiche(niche: string): string {
  const cleaned = niche.trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/(.)\1{2,}/g, "$1$1");
}

function buildHashtags(input: ReelInput): string[] {
  const { niche, goal, tone } = input;
  const base = new Set<string>([
    "#reels",
    "#creatoreconomy",
    "#contentstrategy",
    `#${slugify(niche) || "creator"}`,
    `#${slugify(goal) || "growth"}`,
  ]);

  if (tone === "Energetic") base.add("#highenergy");
  if (tone === "Educational") base.add("#learnonreels");
  if (tone === "Inspirational") base.add("#motivationdaily");
  if (tone === "Playful") base.add("#reelfun");
  if (tone === "Authority") base.add("#trustedadvice");

  return Array.from(base).slice(0, 6);
}

function segmentCopy(
  input: ReelInput,
  role: (typeof segmentBlueprints)[number]["role"],
  random: () => number,
  hookLine: string,
): Pick<ReelSegment, "shotIdea" | "script" | "direction"> {
  const { niche, goal, tone, visualStyle, pacing } = input;
  const vibe = pickOne(random, vibeDescriptors[tone]);

  switch (role) {
    case "Hook":
      return {
        shotIdea: `Direct-to-camera shot with ${visualStyle.toLowerCase()} framing`,
        script: hookLine,
        direction: `${pacing} energy, overlay hook text in bold.`,
      };
    case "Value":
      return {
        shotIdea: `Cutaway of ${niche} workflow with on-screen steps`,
        script: `Step 1: ${goal} starts with ${pickOne(random, [
          "simplifying your stack",
          "micro-habits you can repeat daily",
          "leveraging quick wins before deep work",
          "lining up assets before record time",
        ])}. Step 2: ${pickOne(random, [
          "Batch the heavy lifting in a 20-minute sprint.",
          "Use a plug-and-play template to stay consistent.",
          "Switch angles every 4 seconds to hold retention.",
          "Tie each beat back to your core promise.",
        ])}`,
        direction: `Overlay bullet points matching the narration. Keep ${vibe} pacing.`,
      };
    case "Depth":
      return {
        shotIdea: `${visualStyle} b-roll with light text overlay`,
        script: `Here’s the hidden unlock: ${pickOne(random, [
          "show the messy middle so people trust the process.",
          "front-load your strongest proof within 6 seconds.",
          "pair voiceover with jump cuts for cognitive ease.",
          "tease the payoff before revealing the full answer.",
        ])}`,
        direction: `Use ${pickOne(random, [
          "speed ramp",
          "masked reveal",
          "tracking text animation",
          "split-screen comparison",
        ])} to add freshness.`,
      };
    case "SocialProof":
      return {
        shotIdea: `Screenshot collage / testimonial pop-in`,
        script: `Receipts time: ${pickOne(random, [
          "Clients hit record numbers in 30 days.",
          "Viewers binge the whole series because it works.",
          "This play turned lurkers into superfans.",
          "Community members are sending DMs like crazy.",
        ])}`,
        direction: `Pop testimonials on beat, add subtle zoom for credibility.`,
      };
    case "CTA":
    default:
      return {
        shotIdea: `Punch-in shot calling viewers to act`,
        script: `That’s how you ${goal} without burnout. ${input.callToAction}!`,
        direction: `${pacing} delivery, animate CTA sticker + arrow to bio.`,
      };
  }
}

function computeTimestamps(duration: number, segments: number): string[] {
  const interval = duration / segments;
  return Array.from({ length: segments }, (_, index) => {
    const seconds = Math.min(Math.round(interval * index), duration - 1);
    return `0:${seconds.toString().padStart(2, "0")}`;
  });
}

export function generateReelPlan(input: ReelInput): ReelPlan {
  const seed = `${input.niche}-${input.goal}-${input.tone}-${input.visualStyle}-${input.pacing}`;
  const random = createSeededRandom(seed);

  const hook = pickOne(random, hookTemplates[input.tone])
    .replace("{niche}", humanizeNiche(input.niche))
    .replace("{goal}", input.goal)
    .replace("{audience}", input.audience)
    .replace("{duration}", input.duration.toString());

  const promise = pickOne(random, promiseTemplates[input.tone])
    .replace("{goal}", input.goal)
    .replace("{audience}", input.audience)
    .replace("{niche}", humanizeNiche(input.niche));

  const timestamps = computeTimestamps(input.duration, segmentBlueprints.length);
  const segments: ReelSegment[] = segmentBlueprints.map(
    ({ label, role }, index) => {
      const copy = segmentCopy(input, role, random, hook);
      return {
        label,
        timestamp: timestamps[index],
        ...copy,
      };
    },
  );

  const caption = `${hook} • ${promise} — ${input.callToAction}.`;

  const hashtags = buildHashtags(input);
  const audioIdea = pickOne(random, audioSuggestions);
  const transitions = shuffle(random, transitionIdeas).slice(0, 3);
  const selectedPrompts = shuffle(random, engagementPrompts)
    .slice(0, 2)
    .map((prompt) =>
      prompt
        .replace("{goal}", input.goal)
        .replace("{niche}", humanizeNiche(input.niche)),
    );

  const selectedTips = shuffle(random, postingTips).slice(0, 3);

  return {
    hook,
    promise,
    segments,
    caption,
    hashtags,
    cta: input.callToAction,
    audioIdea,
    transitions,
    postingTips: selectedTips,
    engagementPrompts: selectedPrompts,
  };
}
