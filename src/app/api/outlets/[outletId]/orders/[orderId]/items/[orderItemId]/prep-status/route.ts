import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ApiError, apiClient } from "@/lib/api-client";
import type { OrderItem } from "@/types/orders";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      outletId: string;
      orderId: string;
      orderItemId: string;
    }>;
  },
) {
  try {
    const { outletId, orderId, orderItemId } = await params;
    const body = await request.json();

    const data = await apiClient<{ message: string; order_item: OrderItem }>(
      `/outlets/${outletId}/orders/${orderId}/items/${orderItemId}/prep-status`,
      { method: "PUT", body },
    );

    revalidatePath(`/dashboard/orders/${orderId}`);
    revalidatePath("/dashboard/delivery");

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
