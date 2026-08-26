import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Order } from "@/types/orders";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string; orderId: string }> },
) {
  try {
    const { outletId, orderId } = await params;

    const data = await apiClient<{ message: string; order: Order }>(
      `/outlets/${outletId}/orders/${orderId}/acknowledge`,
      { method: "PUT" },
    );

    revalidatePath("/dashboard/orders");

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
