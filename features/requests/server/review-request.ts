import { prisma } from "@/lib/prisma";
import { updateDraftSchema } from "../schemas/request-schema";
import { assertTransition } from "../domain/request-state";

export async function reviewRequest(requestId: string, input: unknown) {
  const data = updateDraftSchema.parse(input);

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      drafts: true,
      review: true,
    },
  });

  if (!request) {
    throw new Error("Request not found.");
  }

  if (request.status !== "DRAFT_READY") {
    throw new Error(
      `Only DRAFT_READY requests can be reviewed. Current status: ${request.status}.`,
    );
  }

  const draft = request.drafts;

  if (!draft) {
    throw new Error("A valid draft is required before review.");
  }

  if (request.review) {
    throw new Error("This request has already been reviewed.");
  }

  assertTransition(request.status, "REVIEWED");

  return prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.request.updateMany({
      where: {
        id: requestId,
        status: "DRAFT_READY",
      },
      data: {
        status: "REVIEWED",
      },
    });

    if (updatedRequest.count !== 1) {
      throw new Error("Request status changed before review was completed.");
    }

    return tx.review.create({
      data: {
        requestId,
        finalSummary: data.summary,
        finalCategory: data.category,
      },
    });
  });
}