import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { CashAccount } from "@/types/inventory";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string }> },
) {
  try {
    const { outletId } = await params;

    const data = await apiClient<CashAccount[]>(
      `/outlets/${outletId}/cash-accounts`,
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
  { params }: { params: Promise<{ outletId: string }> },
) {
  try {
    const { outletId } = await params;
    const body = await request.json();

    const data = await apiClient<{
      message: string;
      cash_account: CashAccount;
    }>(`/outlets/${outletId}/cash-accounts`, { method: "POST", body });

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
