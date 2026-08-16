import { apiClient } from "@/lib/api-client";
import type { PurchaseOrder } from "@/types/inventory";

export async function getPurchaseOrders(
  outletId: string,
): Promise<PurchaseOrder[]> {
  return apiClient<PurchaseOrder[]>(`/outlets/${outletId}/purchase-orders`);
}

export async function getPurchaseOrder(
  outletId: string,
  purchaseOrderId: string,
): Promise<PurchaseOrder> {
  return apiClient<PurchaseOrder>(
    `/outlets/${outletId}/purchase-orders/${purchaseOrderId}`,
  );
}
