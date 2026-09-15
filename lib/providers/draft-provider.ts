export const REQUEST_CATEGORIES = [
  "NEW_PROJECT",
  "SUPPORT",
  "CHANGE_REQUEST",
  "UNCLEAR",
] as const;

export type RequestCategory = (typeof REQUEST_CATEGORIES)[number];

export type DraftGenerationInput = {
  clientName: string;
  existingScope: string | null;
  clientMessage: string;
};

export type SuggestedNextAction = {
  action: string;
  ownerRole: string;
  completionCriterion: string;
};

export type DraftProviderResult = {
  summary: string;
  category: RequestCategory;
  clarificationQuestions: string[];
  nextActions: [
    SuggestedNextAction,
    SuggestedNextAction,
    SuggestedNextAction,
  ];
  provider: "Mock";
};

export interface DraftProvider {
  generateDraft(input: DraftGenerationInput): Promise<DraftProviderResult>;
}