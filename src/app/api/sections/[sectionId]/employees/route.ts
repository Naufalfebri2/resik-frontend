import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Employee } from "@/types/hr";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string }> },
) {
  try {
    const { sectionId } = await params;
    const body = await request.json();

    const data = await apiClient<{ message: string; employee: Employee }>(
      `/sections/${sectionId}/employees`,
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
