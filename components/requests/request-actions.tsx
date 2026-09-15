"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RequestActionsProps = {
  requestId: string;
  status: "NEW" | "DRAFT_READY" | "REVIEWED";
};

export function RequestActions({
  requestId,
  status,
}: RequestActionsProps) {
  const router = useRouter();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    setIsGenerating(true);

    try {
      const response = await fetch(
        `/api/requests/${requestId}/generate`,
        {
          method: "POST",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to generate draft.",
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to generate draft.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  if (status !== "NEW") {
    return null;
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGenerating ? "Generating draft..." : "Generate draft"}
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