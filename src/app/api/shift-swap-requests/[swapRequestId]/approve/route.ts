import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { ShiftSwapRequest } from "@/types/hr";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ swapRequestId: string }> },
) {
  try {
    const { swapRequestId } = await params;

    const data = await apiClient<{
      message: string;
      shift_swap_request: ShiftSwapRequest;
    }>(`/shift-swap-requests/${swapRequestId}/approve`, { method: "PUT" });

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
