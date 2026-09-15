import { prisma } from "@/lib/prisma";
import { updateDraftSchema } from "../schemas/request-schema";

export async function updateDraft(requestId: string, input: unknown) {
  const data = updateDraftSchema.parse(input);

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: {
      drafts: true,
    },
  });

  if (!request) {
    throw new Error("Request not found.");
  }

  if (request.status !== "DRAFT_READY") {
    throw new Error(
      `Draft can only be edited while the request is DRAFT_READY. Current status: ${request.status}.`,
    );
  }

  const draft = request.drafts;

  if (!draft) {
    throw new Error("A valid draft is required before it can be edited.");
  }

  return prisma.draft.update({
    where: {
      id: draft.id,
    },
    data: {
      summary: data.summary,
      category: data.category,
    },
  });
}