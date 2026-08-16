import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { PurchaseOrder } from "@/types/inventory";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ outletId: string; purchaseOrderId: string }> },
) {
  try {
    const { outletId, purchaseOrderId } = await params;
    const body = await request.json();

    const data = await apiClient<{
      message: string;
      purchase_order: PurchaseOrder;
    }>(`/outlets/${outletId}/purchase-orders/${purchaseOrderId}`, {
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
  }: { params: Promise<{ outletId: string; purchaseOrderId: string }> },
) {
  try {
    const { outletId, purchaseOrderId } = await params;

    const data = await apiClient<{ message: string }>(
      `/outlets/${outletId}/purchase-orders/${purchaseOrderId}`,
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
