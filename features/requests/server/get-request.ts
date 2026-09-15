import { prisma } from "@/lib/prisma";

export async function getRequest(requestId: string) {
  return prisma.request.findUnique({
    where: {
      id: requestId,
    },
    include: {
      drafts: {
        include: {
          nextActions: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
      review: true,
    },
  });
}