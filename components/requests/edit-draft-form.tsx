"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category =
  | "NEW_PROJECT"
  | "SUPPORT"
  | "CHANGE_REQUEST"
  | "UNCLEAR";

type EditDraftFormProps = {
  requestId: string;
  initialSummary: string;
  initialCategory: Category;
};

const categoryLabels: Record<Category, string> = {
  NEW_PROJECT: "New project",
  SUPPORT: "Support",
  CHANGE_REQUEST: "Change request",
  UNCLEAR: "Unclear",
};

export function EditDraftForm({
  requestId,
  initialSummary,
  initialCategory,
}: EditDraftFormProps) {
  const router = useRouter();

  const [summary, setSummary] = useState(initialSummary);
  const [category, setCategory] = useState<Category>(initialCategory);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSave() {
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/requests/${requestId}/draft`,
        {
          method: "PATCH",
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
          result.issues?.[0]?.message ??
            result.error ??
            "Unable to save draft.",
        );
      }

      setSuccess("Draft changes saved.");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save draft.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-5 space-y-5">
      <div>
        <label
          htmlFor="draft-summary"
          className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          Summary
        </label>

        <textarea
          id="draft-summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={5}
          disabled={isSaving}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm leading-6 text-slate-950 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label
          htmlFor="draft-category"
          className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          Category
        </label>

        <select
          id="draft-category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as Category)
          }
          disabled={isSaving}
          className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 disabled:bg-slate-100"
        >
          {Object.entries(categoryLabels).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </select>
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm text-red-600"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="text-sm text-green-700"
        >
          {success}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving changes..." : "Save changes"}
      </button>
    </div>
  );
}