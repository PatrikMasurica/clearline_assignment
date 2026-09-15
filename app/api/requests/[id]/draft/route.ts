import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { updateDraft } from "@/features/requests/server/update-draft";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const draft = await updateDraft(id, body);

    return NextResponse.json(draft);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Unable to update draft.";

    if (message === "Request not found.") {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    if (
      message.includes("can only be edited") ||
      message.includes("valid draft is required")
    ) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to update draft.",
      },
      { status: 500 },
    );
  }
}