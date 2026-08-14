import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { DailyStock, StockOutflow } from "@/types/inventory";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dailyStockId: string; outflowId: string }> },
) {
  try {
    const { dailyStockId, outflowId } = await params;
    const body = await request.json();

    const data = await apiClient<{
      message: string;
      stock_outflow: StockOutflow;
      daily_stock: DailyStock;
    }>(`/daily-stocks/${dailyStockId}/outflows/${outflowId}`, {
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
  { params }: { params: Promise<{ dailyStockId: string; outflowId: string }> },
) {
  try {
    const { dailyStockId, outflowId } = await params;

    const data = await apiClient<{ message: string }>(
      `/daily-stocks/${dailyStockId}/outflows/${outflowId}`,
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
