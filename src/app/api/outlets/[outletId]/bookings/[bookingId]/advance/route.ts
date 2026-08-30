import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ApiError, apiClient } from "@/lib/api-client";
import type { TableBooking } from "@/types/booking";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string; bookingId: string }> },
) {
  try {
    const { outletId, bookingId } = await params;

    const data = await apiClient<{ message: string; booking: TableBooking }>(
      `/outlets/${outletId}/bookings/${bookingId}/advance`,
      { method: "PUT" },
    );

    revalidatePath("/dashboard/bookings");

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
