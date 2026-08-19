import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Section } from "@/types/inventory";

function revalidateSectionPages() {
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard/hr/employees");
  revalidatePath("/dashboard/hr/shifts");
  revalidatePath("/dashboard/hr/attendance");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string; sectionId: string }> },
) {
  try {
    const { outletId, sectionId } = await params;
    const body = await request.json();

    const data = await apiClient<{ message: string; section: Section }>(
      `/outlets/${outletId}/sections/${sectionId}`,
      { method: "PUT", body },
    );

    revalidateSectionPages();

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
  { params }: { params: Promise<{ outletId: string; sectionId: string }> },
) {
  try {
    const { outletId, sectionId } = await params;

    const data = await apiClient<{ message: string }>(
      `/outlets/${outletId}/sections/${sectionId}`,
      { method: "DELETE" },
    );

    revalidateSectionPages();

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
