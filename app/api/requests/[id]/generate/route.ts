import { NextResponse } from "next/server";

import { generateDraft } from "@/features/requests/server/generate-draft";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;

  try {
    const draft = await generateDraft(id);

    return NextResponse.json(draft, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate draft.";

    if (
      message === "Request not found."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    if (
      message.includes("only allowed for NEW requests") ||
      message.includes("already exists") ||
      message.includes("status changed")
    ) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Draft generation failed.",
      },
      { status: 500 },
    );
  }
}