import { z } from "zod";

export const requestCategorySchema = z.enum([
  "NEW_PROJECT",
  "SUPPORT",
  "CHANGE_REQUEST",
  "UNCLEAR",
]);

export const createRequestSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(1, "Client name is required."),

  existingScope: z
    .string()
    .trim()
    .optional(),

  clientMessage: z
    .string()
    .trim()
    .min(1, "Client message is required."),
});

export const updateDraftSchema = z.object({
  summary: z
    .string()
    .trim()
    .min(1, "Summary is required."),

  category: requestCategorySchema,
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateDraftInput = z.infer<typeof updateDraftSchema>;