"use client";

import { useMutation } from "@tanstack/react-query";

interface DeleteBookingErrorResponse {
  message: string;
}

async function deleteBookingRequest(payload: {
  outletId: string;
  bookingId: string;
}): Promise<{ message: string }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/bookings/${payload.bookingId}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeleteBookingErrorResponse;
    throw new Error(error.message || "Failed to delete booking");
  }

  return data;
}

export function useDeleteBooking() {
  return useMutation({
    mutationFn: deleteBookingRequest,
  });
}
