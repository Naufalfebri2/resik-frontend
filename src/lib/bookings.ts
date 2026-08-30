import { apiClient } from "@/lib/api-client";
import type { TableBooking } from "@/types/booking";

export async function getBookings(outletId: string): Promise<TableBooking[]> {
  return apiClient<TableBooking[]>(`/outlets/${outletId}/bookings`);
}

export async function getBooking(
  outletId: string,
  bookingId: string,
): Promise<TableBooking> {
  return apiClient<TableBooking>(`/outlets/${outletId}/bookings/${bookingId}`);
}
