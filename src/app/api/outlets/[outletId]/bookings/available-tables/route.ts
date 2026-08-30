import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { TableAvailability } from "@/types/booking";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string }> },
) {
  try {
    const { outletId } = await params;
    const searchParams = request.nextUrl.searchParams;

    const datetime = searchParams.get("datetime");
    const durationMinutes = searchParams.get("duration_minutes");
    const excludeBookingId = searchParams.get("exclude_booking_id");

    if (!datetime) {
      return NextResponse.json(
        { message: "datetime is required" },
        { status: 422 },
      );
    }

    const query = new URLSearchParams({ datetime });
    if (durationMinutes) query.set("duration_minutes", durationMinutes);
    if (excludeBookingId) query.set("exclude_booking_id", excludeBookingId);

    const data = await apiClient<TableAvailability[]>(
      `/outlets/${outletId}/bookings/available-tables?${query.toString()}`,
      { method: "GET" },
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
