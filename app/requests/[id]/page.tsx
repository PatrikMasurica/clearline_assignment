import Link from "next/link";
import { notFound } from "next/navigation";

import { getRequest } from "@/features/requests/server/get-request";

import { RequestActions } from "@/components/requests/request-actions";

const statusLabels = {
  NEW: "New",
  DRAFT_READY: "Draft ready",
  REVIEWED: "Reviewed",
} as const;

const categoryLabels = {
  NEW_PROJECT: "New project",
  SUPPORT: "Support",
  CHANGE_REQUEST: "Change request",
  UNCLEAR: "Unclear",
} as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

type RequestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RequestDetailPage({
  params,
}: RequestDetailPageProps) {
  const { id } = await params;

  const request = await getRequest(id);

  if (!request) {
    notFound();
  }

const draft = request.drafts;
const review = request.review;

const clarificationQuestions = Array.isArray(
  draft?.clarificationQuestions,
)
  ? draft.clarificationQuestions.map(String)
  : [];

const category =
  review?.finalCategory ??
  draft?.category ??
  null;

  const summary =
    review?.finalSummary ??
    draft?.summary ??
    null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-slate-600 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
        >
          ← Back to requests
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              {request.clientName}
            </h1>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {statusLabels[request.status]}
            </span>

            {category && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {categoryLabels[category]}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Created {formatDate(request.createdAt)}
          </p>
          <RequestActions
  requestId={request.id}
  status={request.status}
/>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Original client request
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Client name
                </p>
                <p className="mt-1 text-sm text-slate-900">
                  {request.clientName}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Existing scope / agreement
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {request.existingScope ??
                    "No existing scope provided. Coverage is unknown."}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Client message
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {request.clientMessage}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Review draft
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Provider: {draft?.provider ?? "Not generated"}
                </p>
              </div>
            </div>

            {!draft ? (
              <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="font-medium text-slate-900">
                  No draft generated yet.
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Generate a draft to classify this request and prepare the
                  review information.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Summary
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {summary}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {category ? categoryLabels[category] : "Not classified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Clarification questions
                  </p>

                  <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                   {clarificationQuestions.map((question, index) => (
  <li key={index}>{question}</li>
))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Next actions
                  </p>

                  <div className="mt-3 space-y-3">
                    {draft.nextActions.map((action) => (
                      <div
                        key={action.id}
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {action.position}. {action.action}
                        </p>

                        <p className="mt-2 text-xs font-medium text-slate-500">
                          Owner: {action.ownerRole}
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          Completion: {action.completionCriterion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {review && (
          <section className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
            <h2 className="font-semibold text-green-900">
              Reviewed
            </h2>

            <p className="mt-1 text-sm text-green-800">
              This triage decision was reviewed on{" "}
              {formatDate(review.reviewedAt)}.
            </p>

            <p className="mt-2 text-xs text-green-700">
              Reviewed requests are read-only.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}