import type { RequestStatus } from "@/app/generated/prisma/client";

const allowedTransitions: Record<RequestStatus, RequestStatus[]> = {
  NEW: ["DRAFT_READY"],
  DRAFT_READY: ["REVIEWED"],
  REVIEWED: [],
};

export function canTransition(
  currentStatus: RequestStatus,
  nextStatus: RequestStatus,
): boolean {
  return allowedTransitions[currentStatus].includes(nextStatus);
}

export function assertTransition(
  currentStatus: RequestStatus,
  nextStatus: RequestStatus,
): void {
  if (!canTransition(currentStatus, nextStatus)) {
    throw new Error(
      `Invalid request status transition: ${currentStatus} -> ${nextStatus}`,
    );
  }
}