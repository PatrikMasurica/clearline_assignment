import { prisma } from "@/lib/prisma";
import { createRequestSchema } from "../schemas/request-schema";

export async function createRequest(input: unknown) {
  const data = createRequestSchema.parse(input);

  return prisma.request.create({
    data: {
      clientName: data.clientName,
      existingScope: data.existingScope || null,
      clientMessage: data.clientMessage,
    },
  });
}