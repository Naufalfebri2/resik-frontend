import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type {
  SubmitPickupOrderPayload,
  SubmitPickupOrderResponse,
} from "@/types/public-order";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string }> },
) {
  try {
    const { outletId } = await params;
    const body: SubmitPickupOrderPayload = await request.json();

    const data = await apiClient<SubmitPickupOrderResponse>(
      `/public/outlets/${outletId}/pickup-order`,
      { method: "POST", body, skipAuth: true },
    );

    return NextResponse.json(data, { status: 201 });
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
