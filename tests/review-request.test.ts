import { afterEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import { createRequest } from "@/features/requests/server/create-request";
import { reviewRequest } from "@/features/requests/server/review-request";

describe("reviewRequest", () => {
  let requestId: string | undefined;

  afterEach(async () => {
    if (requestId) {
      await prisma.request.delete({
        where: {
          id: requestId,
        },
      });

      requestId = undefined;
    }
  });

  it("does not allow a request without a draft to be reviewed", async () => {
    const request = await createRequest({
      clientName: "Review Guard Test",
      existingScope: undefined,
      clientMessage: "This request has no generated draft.",
    });

    requestId = request.id;

    await expect(
      reviewRequest(request.id, {
        summary: "Attempted review",
        category: "UNCLEAR",
      }),
    ).rejects.toThrow(
      "Only DRAFT_READY requests can be reviewed.",
    );

    const savedRequest = await prisma.request.findUnique({
      where: {
        id: request.id,
      },
      include: {
        drafts: true,
        review: true,
      },
    });

    expect(savedRequest?.status).toBe("NEW");
    expect(savedRequest?.drafts).toBeNull();
    expect(savedRequest?.review).toBeNull();
  });
});