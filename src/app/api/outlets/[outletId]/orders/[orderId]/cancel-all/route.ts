import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Order } from "@/types/orders";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string; orderId: string }> },
) {
  try {
    const { outletId, orderId } = await params;

    const data = await apiClient<{ message: string; order: Order }>(
      `/outlets/${outletId}/orders/${orderId}/cancel-all`,
      { method: "POST" },
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
