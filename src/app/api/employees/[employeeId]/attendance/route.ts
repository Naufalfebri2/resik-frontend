import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Attendance } from "@/types/hr";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  try {
    const { employeeId } = await params;

    const data = await apiClient<Attendance[]>(
      `/employees/${employeeId}/attendance`,
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
