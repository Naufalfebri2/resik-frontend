import { apiClient } from "@/lib/api-client";
import type { CashAccount } from "@/types/inventory";

export async function getCashAccounts(
  outletId: string,
): Promise<CashAccount[]> {
  return apiClient<CashAccount[]>(`/outlets/${outletId}/cash-accounts`);
}
