import { NextResponse } from "next/server";

import { getRequest } from "@/features/requests/server/get-request";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;

  try {
    const request = await getRequest(id);

    if (!request) {
      return NextResponse.json(
        {
          error: "Request not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(request);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load request.",
      },
      { status: 500 },
    );
  }
}