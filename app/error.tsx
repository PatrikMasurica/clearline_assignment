"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section
        role="alert"
        className="w-full max-w-lg rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Something went wrong
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-950">
          We could not load the requests.
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Please try again. Your existing requests have not been changed.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
        >
          Try again
        </button>
      </section>
    </main>
  );
}