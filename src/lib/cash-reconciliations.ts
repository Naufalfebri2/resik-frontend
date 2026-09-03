import { apiClient } from "@/lib/api-client";
import type { CashReconciliation } from "@/types/inventory";

export async function getCashReconciliations(
  cashAccountId: string,
): Promise<CashReconciliation[]> {
  return apiClient<CashReconciliation[]>(
    `/cash-accounts/${cashAccountId}/reconciliations`,
  );
}
