import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { DailyStock, StockAdjustment } from "@/types/inventory";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ ingredientId: string; adjustmentId: string }> },
) {
  try {
    const { ingredientId, adjustmentId } = await params;
    const body = await request.json();

    const data = await apiClient<{
      message: string;
      stock_adjustment: StockAdjustment;
      daily_stock: DailyStock | null;
    }>(`/ingredients/${ingredientId}/stock-adjustments/${adjustmentId}`, {
      method: "PUT",
      body,
    });

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
  {
    params,
  }: { params: Promise<{ ingredientId: string; adjustmentId: string }> },
) {
  try {
    const { ingredientId, adjustmentId } = await params;

    const data = await apiClient<{ message: string }>(
      `/ingredients/${ingredientId}/stock-adjustments/${adjustmentId}`,
      { method: "DELETE" },
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
