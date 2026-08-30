"use client";

import { useMutation } from "@tanstack/react-query";
import type { CreateBookingPayload, TableBooking } from "@/types/booking";

interface CreateBookingErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createBookingRequest(payload: {
  outletId: string;
  data: CreateBookingPayload;
}): Promise<{ message: string; booking: TableBooking }> {
  const response = await fetch(`/api/outlets/${payload.outletId}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.data),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateBookingErrorResponse;
    throw new Error(error.message || "Failed to create booking");
  }

  return data;
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: createBookingRequest,
  });
}
