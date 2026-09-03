import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ApiError, apiClient } from "@/lib/api-client";
import type { CashReconciliation } from "@/types/inventory";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ cashAccountId: string; reconciliationId: string }> },
) {
  try {
    const { cashAccountId, reconciliationId } = await params;

    const data = await apiClient<{
      message: string;
      reconciliation: CashReconciliation;
    }>(
      `/cash-accounts/${cashAccountId}/reconciliations/${reconciliationId}/approve`,
      { method: "PUT" },
    );

    revalidatePath("/dashboard/finance/reconciliation");
    revalidatePath("/dashboard/finance/cash-accounts");

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message, errors: error.errors },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
