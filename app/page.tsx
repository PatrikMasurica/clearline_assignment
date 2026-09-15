import Link from "next/link";

import { listRequests } from "@/features/requests/server/list-requests";

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

export default async function HomePage() {
  const requests = await listRequests();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Clearline Tech
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Client Request Review Tool
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Review incoming client requests, generate a structured draft,
              and approve the final triage decision.
            </p>
          </div>

          <Link
            href="/requests/new"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
          >
            New request
          </Link>
        </header>

        <section
          aria-labelledby="requests-heading"
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 px-5 py-4">
            <h2
              id="requests-heading"
              className="text-lg font-semibold text-slate-950"
            >
              Client requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {requests.length}{" "}
              {requests.length === 1 ? "request" : "requests"} in the system.
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-medium text-slate-900">
                No client requests yet.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create the first request to start the review workflow.
              </p>

              <Link
                href="/requests/new"
                className="mt-5 inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
              >
                Create request
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {requests.map((request) => {
                const category =
                  request.drafts?.category ??
                  request.review?.finalCategory ??
                  null;

                return (
                  <Link
                    key={request.id}
                    href={`/requests/${request.id}`}
                    className="block px-5 py-5 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-950"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-950">
                            {request.clientName}
                          </h3>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {statusLabels[request.status]}
                          </span>

                          {category && (
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                              {categoryLabels[category]}
                            </span>
                          )}
                        </div>

                        <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">
                          {request.clientMessage}
                        </p>
                      </div>

                      <time
                        dateTime={request.createdAt.toISOString()}
                        className="shrink-0 text-xs text-slate-500"
                      >
                        {formatDate(request.createdAt)}
                      </time>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}