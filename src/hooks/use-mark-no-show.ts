"use client";

import { useMutation } from "@tanstack/react-query";
import type { TableBooking } from "@/types/booking";

interface MarkNoShowErrorResponse {
  message: string;
}

async function markNoShowRequest(payload: {
  outletId: string;
  bookingId: string;
}): Promise<{ message: string; booking: TableBooking }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/bookings/${payload.bookingId}/no-show`,
    { method: "PUT" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as MarkNoShowErrorResponse;
    throw new Error(error.message || "Failed to mark booking as no-show");
  }

  return data;
}

export function useMarkNoShow() {
  return useMutation({
    mutationFn: markNoShowRequest,
  });
}
