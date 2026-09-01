import type { BookingStatus } from "@/types/booking";

const ADVANCE_LABEL: Record<BookingStatus, string | null> = {
  pending: null,
  awaiting_deposit: "Confirm",
  confirmed: "Seat Guest",
  seated: null,
  cancelled: null,
  no_show: null,
};

const ADVANCE_LABEL_REGULAR_PENDING = "Confirm";
const ADVANCE_LABEL_EVENT_PENDING = "Mark Deposit Received";

export function getAdvanceLabel(
  status: BookingStatus,
  isEvent: boolean,
): string | null {
  if (status === "pending") {
    return isEvent
      ? ADVANCE_LABEL_EVENT_PENDING
      : ADVANCE_LABEL_REGULAR_PENDING;
  }
  return ADVANCE_LABEL[status];
}

const CANCELLABLE_STATUSES: BookingStatus[] = [
  "pending",
  "awaiting_deposit",
  "confirmed",
];

const EDITABLE_STATUSES: BookingStatus[] = [
  "pending",
  "awaiting_deposit",
  "confirmed",
];

const LOCKED_FOR_DELETE_STATUSES: BookingStatus[] = ["seated"];

export function canCancelOrNoShow(status: BookingStatus): boolean {
  return CANCELLABLE_STATUSES.includes(status);
}

export function canEditBooking(status: BookingStatus): boolean {
  return EDITABLE_STATUSES.includes(status);
}

export function canDeleteBooking(status: BookingStatus): boolean {
  return !LOCKED_FOR_DELETE_STATUSES.includes(status);
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  awaiting_deposit: "Awaiting Deposit",
  confirmed: "Confirmed",
  seated: "Seated",
  cancelled: "Cancelled",
  no_show: "No-Show",
};

export const STATUS_BADGE_CLASSNAME: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  awaiting_deposit: "bg-orange-100 text-orange-800",
  confirmed: "bg-blue-100 text-blue-800",
  seated: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-600",
  no_show: "bg-red-100 text-red-800",
};
