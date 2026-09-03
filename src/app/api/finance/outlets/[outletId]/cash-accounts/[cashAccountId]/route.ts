import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ApiError, apiClient } from "@/lib/api-client";
import type { CashAccount } from "@/types/inventory";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string; cashAccountId: string }> },
) {
  try {
    const { outletId, cashAccountId } = await params;
    const body = await request.json();

    const data = await apiClient<{
      message: string;
      cash_account: CashAccount;
    }>(`/outlets/${outletId}/cash-accounts/${cashAccountId}`, {
      method: "PUT",
      body,
    });

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string; cashAccountId: string }> },
) {
  try {
    const { outletId, cashAccountId } = await params;

    const data = await apiClient<{ message: string }>(
      `/outlets/${outletId}/cash-accounts/${cashAccountId}`,
      { method: "DELETE" },
    );

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
