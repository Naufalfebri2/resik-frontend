"use client";

import { useMutation } from "@tanstack/react-query";
import type { TableBooking } from "@/types/booking";

interface CancelBookingErrorResponse {
  message: string;
}

async function cancelBookingRequest(payload: {
  outletId: string;
  bookingId: string;
}): Promise<{ message: string; booking: TableBooking }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/bookings/${payload.bookingId}/cancel`,
    { method: "PUT" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as CancelBookingErrorResponse;
    throw new Error(error.message || "Failed to cancel booking");
  }

  return data;
}

export function useCancelBooking() {
  return useMutation({
    mutationFn: cancelBookingRequest,
  });
}
