"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ReviewRequestButtonProps = {
  requestId: string;
  summary: string;
  category: "NEW_PROJECT" | "SUPPORT" | "CHANGE_REQUEST" | "UNCLEAR";
};

export function ReviewRequestButton({
  requestId,
  summary,
  category,
}: ReviewRequestButtonProps) {
  const router = useRouter();

  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState("");

  async function handleReview() {
    setError("");
    setIsReviewing(true);

    try {
      const response = await fetch(
        `/api/requests/${requestId}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary,
            category,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to mark request as reviewed.",
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to mark request as reviewed.",
      );
    } finally {
      setIsReviewing(false);
    }
  }

  return (
    <div className="mt-6 border-t border-slate-200 pt-5">
      <p className="text-sm leading-6 text-slate-600">
        Review the summary and category before marking this request as
        reviewed. After review, the triage result becomes read-only.
      </p>

      <button
        type="button"
        onClick={handleReview}
        disabled={isReviewing}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isReviewing ? "Marking as reviewed..." : "Mark as reviewed"}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}