import { prisma } from "@/lib/prisma";
import { MockDraftProvider } from "@/lib/providers/mock-draft-provider";
import { providerResultSchema } from "../schemas/provider-result-schema";
import { assertTransition } from "../domain/request-state";

export async function generateDraft(requestId: string) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Request not found.");
  }

  if (request.status !== "NEW") {
    throw new Error(
      `Draft generation is only allowed for NEW requests. Current status: ${request.status}.`,
    );
  }

  const provider = new MockDraftProvider();

  const providerResult = await provider.generateDraft({
    clientName: request.clientName,
    existingScope: request.existingScope,
    clientMessage: request.clientMessage,
  });

  const validation = providerResultSchema.safeParse(providerResult);

  if (!validation.success) {
    throw new Error("Provider returned an invalid draft result.");
  }

  const draft = validation.data;

  assertTransition(request.status, "DRAFT_READY");

  return prisma.$transaction(async (tx) => {
    const existingDraft = await tx.draft.findUnique({
      where: { requestId },
    });

    if (existingDraft) {
      throw new Error("A draft already exists for this request.");
    }

    const updatedRequest = await tx.request.updateMany({
      where: {
        id: requestId,
        status: "NEW",
      },
      data: {
        status: "DRAFT_READY",
      },
    });

    if (updatedRequest.count !== 1) {
      throw new Error("Request status changed before draft generation completed.");
    }

    return tx.draft.create({
      data: {
        requestId,
        summary: draft.summary,
        category: draft.category,
        clarificationQuestions: draft.clarificationQuestions,
        provider: draft.provider,
        nextActions: {
          create: draft.nextActions.map((action, index) => ({
            position: index + 1,
            action: action.action,
            ownerRole: action.ownerRole,
            completionCriterion: action.completionCriterion,
          })),
        },
      },
      include: {
        nextActions: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  });
}