import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createRequest } from "@/features/requests/server/create-request";
import { listRequests } from "@/features/requests/server/list-requests";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const createdRequest = await createRequest(body);

    return NextResponse.json(createdRequest, { status: 201 });
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

    return NextResponse.json(
      {
        error: "Unable to create request.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    const requests = await listRequests(
      status === "NEW" ||
        status === "DRAFT_READY" ||
        status === "REVIEWED"
        ? status
        : undefined,
    );

    return NextResponse.json(requests);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load requests.",
      },
      { status: 500 },
    );
  }
}