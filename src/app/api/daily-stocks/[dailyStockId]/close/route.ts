import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { DailyStock } from "@/types/inventory";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dailyStockId: string }> },
) {
  try {
    const { dailyStockId } = await params;
    const body = await request.json();

    const data = await apiClient<{ message: string; daily_stock: DailyStock }>(
      `/daily-stocks/${dailyStockId}/close`,
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
