import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Shift } from "@/types/hr";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string; shiftId: string }> },
) {
  try {
    const { sectionId, shiftId } = await params;
    const body = await request.json();

    const data = await apiClient<{ message: string; shift: Shift }>(
      `/sections/${sectionId}/shifts/${shiftId}`,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string; shiftId: string }> },
) {
  try {
    const { sectionId, shiftId } = await params;

    const data = await apiClient<{ message: string }>(
      `/sections/${sectionId}/shifts/${shiftId}`,
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
