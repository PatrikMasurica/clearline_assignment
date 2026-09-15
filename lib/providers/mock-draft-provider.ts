import type {
  DraftGenerationInput,
  DraftProvider,
  DraftProviderResult,
} from "./draft-provider";

function buildResult(
  category: DraftProviderResult["category"],
  summary: string,
  clarificationQuestions: string[],
  nextActions: DraftProviderResult["nextActions"],
): DraftProviderResult {
  return {
    summary,
    category,
    clarificationQuestions,
    nextActions,
    provider: "Mock",
  };
}

export class MockDraftProvider implements DraftProvider {
  async generateDraft(
    input: DraftGenerationInput,
  ): Promise<DraftProviderResult> {
    const message = input.clientMessage.toLowerCase();

    if (
      message.includes("website") &&
      (message.includes("3 weeks") ||
        message.includes("three weeks") ||
        message.includes("logo"))
    ) {
      return buildResult(
        "NEW_PROJECT",
        "The client appears to be requesting a new company website. The main scope is a company information site with services, gallery, and contact details. Content readiness and launch expectations still need clarification.",
        [
          "What budget range has been allocated for the website?",
          "Who will provide and approve the final text and photos?",
          "Is the three-week launch date fixed, and what is the approval process?",
        ],
        [
          {
            action: "Confirm the website scope, budget, content ownership, and target launch date.",
            ownerRole: "Account Manager",
            completionCriterion:
              "A written scope, budget range, content owner, approval owner, and target launch date are confirmed.",
          },
          {
            action: "Collect the logo and agree on the required website content and assets.",
            ownerRole: "Client",
            completionCriterion:
              "Logo, required pages, and a content/asset checklist are available to the delivery team.",
          },
          {
            action: "Separate any future Google Ads work from the website delivery scope.",
            ownerRole: "Account Manager",
            completionCriterion:
              "Google Ads is explicitly recorded as either out of current scope or as a separate future request.",
          },
        ],
      );
    }

    if (
      message.includes("contact form") &&
      (message.includes("errors") ||
        message.includes("error") ||
        message.includes("yesterday"))
    ) {
      return buildResult(
        "SUPPORT",
        "The client is reporting a problem with an existing website contact form. The issue appears to be a support request because the form previously worked and no new fields or integrations were requested. The root cause is not yet established.",
        [
          "Can the client provide an example of the contact form failure and the steps used to reproduce it?",
          "Are all users affected, or only specific devices, browsers, or submissions?",
          "Have any website, hosting, email, or form configuration changes been made since it last worked?",
        ],
        [
          {
            action: "Reproduce the contact form problem using the client's reported steps.",
            ownerRole: "Support Engineer",
            completionCriterion:
              "The failure is reproduced or the attempted reproduction is documented with the observed result.",
          },
          {
            action: "Diagnose the form submission flow and identify the likely source of the failure.",
            ownerRole: "Developer",
            completionCriterion:
              "The affected component and evidence supporting the diagnosis are documented.",
          },
          {
            action: "Apply or propose the appropriate fix and verify the form submission end to end.",
            ownerRole: "Developer",
            completionCriterion:
              "A test submission completes successfully and the expected recipient receives it.",
          },
        ],
      );
    }

    if (
      (message.includes("accounts") || message.includes("account")) &&
      (message.includes("booking") ||
        message.includes("appointment")) &&
      (message.includes("payment") ||
        message.includes("deposit"))
    ) {
      return buildResult(
        "CHANGE_REQUEST",
        "The client is requesting functionality that appears to extend the existing informational website beyond its current scope. The request includes user accounts, appointment booking, and online deposit payments, so approval and requirements clarification are needed before implementation.",
        [
          "What booking rules, availability, cancellation, and confirmation flow are required?",
          "Which payment provider and deposit rules should be supported?",
          "Is the two-week timeline fixed, and what budget and approval process apply to the additional functionality?",
        ],
        [
          {
            action: "Compare the requested accounts, booking, and payment functionality with the existing agreement.",
            ownerRole: "Account Manager",
            completionCriterion:
              "The scope gap and each requested capability are documented against the existing agreement.",
          },
          {
            action: "Define the booking, payment, and account requirements before implementation.",
            ownerRole: "Product Manager",
            completionCriterion:
              "Written acceptance criteria exist for account creation, booking, payments, and relevant edge cases.",
          },
          {
            action: "Obtain approval for the expanded scope before implementation begins.",
            ownerRole: "Account Manager",
            completionCriterion:
              "The client has approved the expanded scope, timeline, and commercial terms in writing.",
          },
        ],
      );
    }

    return buildResult(
      "UNCLEAR",
      "The request does not contain enough information to confidently classify the work. More context is needed before determining the appropriate delivery path.",
      [
        "What outcome is the client trying to achieve?",
        "Is this related to an existing website or agreement, or is it a new request?",
        "What timeline, constraints, and relevant existing scope should the team consider?",
      ],
      [
        {
          action: "Clarify the client's desired outcome and current situation.",
          ownerRole: "Account Manager",
          completionCriterion:
            "The desired outcome and relevant existing context are documented.",
        },
        {
          action: "Confirm whether the request is new work, support, or a change to existing scope.",
          ownerRole: "Account Manager",
          completionCriterion:
            "The request has enough information to assign one of the supported categories.",
        },
        {
          action: "Record the agreed next step after clarification.",
          ownerRole: "Account Manager",
          completionCriterion:
            "A specific next step, owner, and completion condition are documented.",
        },
      ],
    );
  }
}