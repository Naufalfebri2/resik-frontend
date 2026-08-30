"use client";

import { useMutation } from "@tanstack/react-query";
import type { CreateEventBookingPayload, TableBooking } from "@/types/booking";

interface CreateEventBookingErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  unavailable_table_ids?: string[];
}

async function createEventBookingRequest(payload: {
  outletId: string;
  data: CreateEventBookingPayload;
}): Promise<{ message: string; booking: TableBooking }> {
  const response = await fetch(
    `/api/outlets/${payload.outletId}/bookings/event`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateEventBookingErrorResponse;
    throw new Error(error.message || "Failed to create event booking");
  }

  return data;
}

export function useCreateEventBooking() {
  return useMutation({
    mutationFn: createEventBookingRequest,
  });
}
