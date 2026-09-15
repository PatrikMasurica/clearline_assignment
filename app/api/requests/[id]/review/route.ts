import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { reviewRequest } from "@/features/requests/server/review-request";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const review = await reviewRequest(id, body);

    return NextResponse.json(review, { status: 201 });
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
      error instanceof Error ? error.message : "Unable to review request.";

    if (message === "Request not found.") {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    if (
      message.includes("Only DRAFT_READY") ||
      message.includes("valid draft is required") ||
      message.includes("already been reviewed") ||
      message.includes("status changed")
    ) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to review request.",
      },
      { status: 500 },
    );
  }
}