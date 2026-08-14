import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { DailyStock } from "@/types/inventory";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ ingredientId: string; dailyStockId: string }> },
) {
  try {
    const { ingredientId, dailyStockId } = await params;
    const body = await request.json();

    const data = await apiClient<{ message: string; daily_stock: DailyStock }>(
      `/ingredients/${ingredientId}/daily-stocks/${dailyStockId}`,
      { method: "PUT", body },
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

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ ingredientId: string; dailyStockId: string }> },
) {
  try {
    const { ingredientId, dailyStockId } = await params;

    const data = await apiClient<{ message: string }>(
      `/ingredients/${ingredientId}/daily-stocks/${dailyStockId}`,
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
