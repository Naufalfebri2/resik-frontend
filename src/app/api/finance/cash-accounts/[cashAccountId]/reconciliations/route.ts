import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ApiError, apiClient } from "@/lib/api-client";
import type { CashReconciliation } from "@/types/inventory";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cashAccountId: string }> },
) {
  try {
    const { cashAccountId } = await params;

    const data = await apiClient<CashReconciliation[]>(
      `/cash-accounts/${cashAccountId}/reconciliations`,
    );

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cashAccountId: string }> },
) {
  try {
    const { cashAccountId } = await params;
    const body = await request.json();

    const data = await apiClient<{
      message: string;
      reconciliation: CashReconciliation;
    }>(`/cash-accounts/${cashAccountId}/reconciliations`, {
      method: "POST",
      body,
    });

    revalidatePath("/dashboard/finance/reconciliation");

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
