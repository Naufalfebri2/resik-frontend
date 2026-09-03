import { apiClient } from "@/lib/api-client";
import type { CashTransaction } from "@/types/inventory";

export async function getCashTransactions(
  cashAccountId: string,
): Promise<CashTransaction[]> {
  return apiClient<CashTransaction[]>(
    `/cash-accounts/${cashAccountId}/transactions`,
  );
}
