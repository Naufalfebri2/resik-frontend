import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ApiError, apiClient } from "@/lib/api-client";
import type { UpdateTablePayload, Table } from "@/types/orders";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string; tableId: string }> },
) {
  try {
    const { sectionId, tableId } = await params;
    const body: UpdateTablePayload = await request.json();

    const data = await apiClient<{ message: string; table: Table }>(
      `/sections/${sectionId}/tables/${tableId}`,
      { method: "PUT", body },
    );

    revalidatePath("/dashboard/tables");

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
  { params }: { params: Promise<{ sectionId: string; tableId: string }> },
) {
  try {
    const { sectionId, tableId } = await params;

    const data = await apiClient<{ message: string }>(
      `/sections/${sectionId}/tables/${tableId}`,
      { method: "DELETE" },
    );

    revalidatePath("/dashboard/tables");

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
