import Link from "next/link";

import { CreateRequestForm } from "@/components/requests/create-request-form";

export default function NewRequestPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
          >
            ← Back to requests
          </Link>

          <p className="mt-6 text-sm font-medium text-slate-500">
            New client request
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Capture client request
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Save the client&apos;s original message first. The request remains
            unchanged while the review draft is generated separately.
          </p>
        </div>

        <CreateRequestForm />
      </div>
    </main>
  );
}