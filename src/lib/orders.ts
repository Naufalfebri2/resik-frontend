import { apiClient } from "@/lib/api-client";
import type {
  Order,
  OrderHistoryFilters,
  OrderHistoryItem,
  PaginatedResponse,
} from "@/types/orders";

export async function getOrders(
  outletId: string,
  options?: { unacknowledgedOnly?: boolean },
): Promise<Order[]> {
  const query = options?.unacknowledgedOnly ? "?unacknowledged_only=true" : "";
  return apiClient<Order[]>(`/outlets/${outletId}/orders${query}`);
}

export async function getOrder(
  outletId: string,
  orderId: string,
): Promise<Order> {
  return apiClient<Order>(`/outlets/${outletId}/orders/${orderId}`);
}

export async function getOrderHistory(
  outletId: string,
  filters?: OrderHistoryFilters,
): Promise<PaginatedResponse<OrderHistoryItem>> {
  const params = new URLSearchParams();

  if (filters?.status) params.set("status", filters.status);
  if (filters?.date_from) params.set("date_from", filters.date_from);
  if (filters?.date_to) params.set("date_to", filters.date_to);
  if (filters?.table_id) params.set("table_id", filters.table_id);
  if (filters?.cashier_id) params.set("cashier_id", filters.cashier_id);
  if (filters?.payment_method)
    params.set("payment_method", filters.payment_method);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.per_page) params.set("per_page", String(filters.per_page));

  const query = params.toString();

  return apiClient<PaginatedResponse<OrderHistoryItem>>(
    `/outlets/${outletId}/orders/history${query ? `?${query}` : ""}`,
  );
}
