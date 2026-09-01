"use client";

import { useMutation } from "@tanstack/react-query";
import type { TableBooking, UpdateBookingPayload } from "@/types/booking";

interface UpdateBookingErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function updateBookingRequest(payload: {
  outletId: string;
  bookingId: string;
  data: UpdateBookingPayload;
}): Promise<{ message: string; booking: TableBooking }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/bookings/${payload.bookingId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateBookingErrorResponse;
    throw new Error(error.message || "Failed to update booking");
  }

  return data;
}

export function useUpdateBooking() {
  return useMutation({
    mutationFn: updateBookingRequest,
  });
}
