import { afterEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import { createRequest } from "@/features/requests/server/create-request";
import { generateDraft } from "@/features/requests/server/generate-draft";

describe("generateDraft provider recovery", () => {
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

    delete process.env.MOCK_PROVIDER_FAILURE;
  });

  it("preserves NEW state after provider failure and creates one draft after retry", async () => {
    const request = await createRequest({
      clientName: "Automated Recovery Test",
      existingScope: undefined,
      clientMessage: "This request tests provider recovery.",
    });

    requestId = request.id;

    process.env.MOCK_PROVIDER_FAILURE = "true";

    await expect(generateDraft(request.id)).rejects.toThrow(
      "Mock provider failure.",
    );

    const afterFailure = await prisma.request.findUnique({
      where: {
        id: request.id,
      },
      include: {
        drafts: true,
      },
    });

    expect(afterFailure?.status).toBe("NEW");
    expect(afterFailure?.drafts).toBeNull();

    delete process.env.MOCK_PROVIDER_FAILURE;

    await generateDraft(request.id);

    const afterRetry = await prisma.request.findUnique({
      where: {
        id: request.id,
      },
      include: {
        drafts: true,
      },
    });

    expect(afterRetry?.status).toBe("DRAFT_READY");
    expect(afterRetry?.drafts).not.toBeNull();

    const draftCount = await prisma.draft.count({
      where: {
        requestId: request.id,
      },
    });

    expect(draftCount).toBe(1);
  });
});