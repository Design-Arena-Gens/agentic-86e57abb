import { NextResponse } from "next/server";
import { type ReelInput, generateReelPlan } from "@/lib/generator";

function validateBody(body: unknown): asserts body is ReelInput {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid payload.");
  }

  const payload = body as Partial<ReelInput>;
  const requiredKeys: Array<keyof ReelInput> = [
    "niche",
    "audience",
    "goal",
    "tone",
    "duration",
    "callToAction",
    "visualStyle",
    "pacing",
  ];

  for (const key of requiredKeys) {
    if (payload[key] === undefined || payload[key] === null) {
      throw new Error(`Missing field: ${key}`);
    }
  }

  if (typeof payload.duration !== "number" || payload.duration <= 0) {
    throw new Error("Duration must be a positive number.");
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    validateBody(body);

    const plan = generateReelPlan(body);
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      {
        status: 400,
      },
    );
  }
}
