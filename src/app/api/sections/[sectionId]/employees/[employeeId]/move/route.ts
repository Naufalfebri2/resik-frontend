import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Employee } from "@/types/hr";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string; employeeId: string }> },
) {
  try {
    const { sectionId, employeeId } = await params;
    const body = await request.json();

    const data = await apiClient<{ message: string; employee: Employee }>(
      `/sections/${sectionId}/employees/${employeeId}/move`,
      { method: "PUT", body },
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
