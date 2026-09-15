import { prisma } from "@/lib/prisma";
import type { RequestStatus } from "@/app/generated/prisma/client";

export async function listRequests(status?: RequestStatus) {
  return prisma.request.findMany({
    where: status
      ? {
          status,
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      drafts: true,
      review: true,
    },
  });
}