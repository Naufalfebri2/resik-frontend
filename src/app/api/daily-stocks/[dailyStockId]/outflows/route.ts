import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { DailyStock, StockOutflow } from "@/types/inventory";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dailyStockId: string }> },
) {
  try {
    const { dailyStockId } = await params;

    const data = await apiClient<StockOutflow[]>(
      `/daily-stocks/${dailyStockId}/outflows`,
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
  { params }: { params: Promise<{ dailyStockId: string }> },
) {
  try {
    const { dailyStockId } = await params;
    const body = await request.json();

    const data = await apiClient<{
      message: string;
      stock_outflow: StockOutflow;
      daily_stock: DailyStock;
    }>(`/daily-stocks/${dailyStockId}/outflows`, { method: "POST", body });

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
