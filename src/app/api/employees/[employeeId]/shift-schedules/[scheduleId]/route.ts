import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string; scheduleId: string }> },
) {
  try {
    const { employeeId, scheduleId } = await params;

    const data = await apiClient<{ message: string }>(
      `/employees/${employeeId}/shift-schedules/${scheduleId}`,
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
