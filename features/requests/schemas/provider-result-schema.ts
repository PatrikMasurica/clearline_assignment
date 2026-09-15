import { z } from "zod";

export const providerResultSchema = z.object({
  summary: z
    .string()
    .trim()
    .min(1, "Provider summary is required."),

  category: z.enum([
    "NEW_PROJECT",
    "SUPPORT",
    "CHANGE_REQUEST",
    "UNCLEAR",
  ]),

  clarificationQuestions: z
    .array(z.string().trim().min(1))
    .min(1),

  nextActions: z
    .array(
      z.object({
        action: z.string().trim().min(1),
        ownerRole: z.string().trim().min(1),
        completionCriterion: z.string().trim().min(1),
      }),
    )
    .length(3),

  provider: z.literal("Mock"),
});

export type ValidatedProviderResult = z.infer<
  typeof providerResultSchema
>;