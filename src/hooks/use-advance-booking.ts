"use client";

import { useMutation } from "@tanstack/react-query";
import type { TableBooking } from "@/types/booking";

interface AdvanceBookingErrorResponse {
  message: string;
}

async function advanceBookingRequest(payload: {
  outletId: string;
  bookingId: string;
}): Promise<{ message: string; booking: TableBooking }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/bookings/${payload.bookingId}/advance`,
    { method: "PUT" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as AdvanceBookingErrorResponse;
    throw new Error(error.message || "Failed to advance booking status");
  }

  return data;
}

export function useAdvanceBooking() {
  return useMutation({
    mutationFn: advanceBookingRequest,
  });
}
