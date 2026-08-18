import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Attendance } from "@/types/hr";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  try {
    const { employeeId } = await params;
    const body = await request.json();

    const data = await apiClient<{ message: string; attendance: Attendance }>(
      `/employees/${employeeId}/attendance/mark-status`,
      { method: "POST", body },
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
