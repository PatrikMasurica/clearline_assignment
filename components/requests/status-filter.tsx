"use client";

import { useRouter } from "next/navigation";

type Status = "NEW" | "DRAFT_READY" | "REVIEWED";

type StatusFilterProps = {
  value?: Status;
};

export function StatusFilter({
  value,
}: StatusFilterProps) {
  const router = useRouter();

  function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const selectedStatus = event.target.value;

    router.push(
      selectedStatus === "ALL"
        ? "/"
        : `/?status=${selectedStatus}`,
    );
  }

  return (
    <div className="mt-4">
      <label
        htmlFor="status-filter"
        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        Filter by status
      </label>

      <select
        id="status-filter"
        defaultValue={value ?? "ALL"}
        onChange={handleChange}
        className="mt-2 min-h-11 w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
      >
        <option value="ALL">All statuses</option>
        <option value="NEW">New</option>
        <option value="DRAFT_READY">Draft ready</option>
        <option value="REVIEWED">Reviewed</option>
      </select>
    </div>
  );
}