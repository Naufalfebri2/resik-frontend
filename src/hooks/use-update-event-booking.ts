"use client";

import { useMutation } from "@tanstack/react-query";
import type { TableBooking, UpdateEventBookingPayload } from "@/types/booking";

interface UpdateEventBookingErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  unavailable_table_ids?: string[];
}

async function updateEventBookingRequest(payload: {
  outletId: string;
  bookingId: string;
  data: UpdateEventBookingPayload;
}): Promise<{ message: string; booking: TableBooking }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/bookings/${payload.bookingId}/event`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as UpdateEventBookingErrorResponse;
    throw new Error(error.message || "Failed to update event booking");
  }

  return data;
}

export function useUpdateEventBooking() {
  return useMutation({
    mutationFn: updateEventBookingRequest,
  });
}
