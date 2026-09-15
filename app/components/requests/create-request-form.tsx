"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FormValues = {
  clientName: string;
  existingScope: string;
  clientMessage: string;
};

const initialValues: FormValues = {
  clientName: "",
  existingScope: "",
  clientMessage: "",
};

export function CreateRequestForm() {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(initialValues);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(
    field: keyof FormValues,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        const firstIssue = result.issues?.[0]?.message;

        throw new Error(
          firstIssue ?? result.error ?? "Unable to create request.",
        );
      }

      router.push(`/requests/${result.id}`);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="space-y-6">
        <div>
          <label
            htmlFor="clientName"
            className="block text-sm font-semibold text-slate-900"
          >
            Client name
          </label>

          <input
            id="clientName"
            name="clientName"
            type="text"
            value={values.clientName}
            onChange={(event) =>
              updateField("clientName", event.target.value)
            }
            placeholder="e.g. Mira Tiles"
            required
            disabled={isSubmitting}
            className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="existingScope"
            className="block text-sm font-semibold text-slate-900"
          >
            Existing scope / service agreement
            <span className="ml-1 font-normal text-slate-500">
              (optional)
            </span>
          </label>

          <textarea
            id="existingScope"
            name="existingScope"
            value={values.existingScope}
            onChange={(event) =>
              updateField("existingScope", event.target.value)
            }
            placeholder="Paste the relevant existing scope or agreement details..."
            rows={5}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 disabled:bg-slate-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            If there is no existing scope, leave this empty. Coverage will be
            treated as unknown.
          </p>
        </div>

        <div>
          <label
            htmlFor="clientMessage"
            className="block text-sm font-semibold text-slate-900"
          >
            Client message
          </label>

          <textarea
            id="clientMessage"
            name="clientMessage"
            value={values.clientMessage}
            onChange={(event) =>
              updateField("clientMessage", event.target.value)
            }
            placeholder="Paste the client's request or message..."
            rows={9}
            required
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 disabled:bg-slate-100"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving request..." : "Save request"}
          </button>
        </div>
      </div>
    </form>
  );
}