import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Section } from "@/types/inventory";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string }> },
) {
  try {
    const { outletId } = await params;

    const data = await apiClient<Section[]>(`/outlets/${outletId}/sections`);

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string }> },
) {
  try {
    const { outletId } = await params;
    const body = await request.json();

    const data = await apiClient<{ message: string; section: Section }>(
      `/outlets/${outletId}/sections`,
      { method: "POST", body },
    );

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/hr/employees");
    revalidatePath("/dashboard/hr/shifts");
    revalidatePath("/dashboard/hr/attendance");

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
