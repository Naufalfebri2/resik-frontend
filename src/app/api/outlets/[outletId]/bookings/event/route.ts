import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ApiError, apiClient } from "@/lib/api-client";
import type { CreateEventBookingPayload, TableBooking } from "@/types/booking";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string }> },
) {
  try {
    const { outletId } = await params;
    const body: CreateEventBookingPayload = await request.json();

    const data = await apiClient<{ message: string; booking: TableBooking }>(
      `/outlets/${outletId}/bookings/event`,
      { method: "POST", body },
    );

    revalidatePath("/dashboard/bookings");

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
