import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/orders";
import type { BookingHistoryFilters, TableBooking } from "@/types/booking";

export async function getBookings(outletId: string): Promise<TableBooking[]> {
  return apiClient<TableBooking[]>(`/outlets/${outletId}/bookings`);
}

export async function getBooking(
  outletId: string,
  bookingId: string,
): Promise<TableBooking> {
  return apiClient<TableBooking>(`/outlets/${outletId}/bookings/${bookingId}`);
}

export async function getBookingHistory(
  outletId: string,
  filters?: BookingHistoryFilters,
): Promise<PaginatedResponse<TableBooking>> {
  const params = new URLSearchParams();

  if (filters?.status) params.set("status", filters.status);
  if (filters?.is_event !== undefined)
    params.set("is_event", String(filters.is_event));
  if (filters?.date_from) params.set("date_from", filters.date_from);
  if (filters?.date_to) params.set("date_to", filters.date_to);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.per_page) params.set("per_page", String(filters.per_page));

  const query = params.toString();

  return apiClient<PaginatedResponse<TableBooking>>(
    `/outlets/${outletId}/bookings/history${query ? `?${query}` : ""}`,
  );
}
