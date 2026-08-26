import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Outlet, UpdateOutletPayload } from "@/types/inventory";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string }> },
) {
  try {
    const { outletId } = await params;
    const body: UpdateOutletPayload = await request.json();

    const data = await apiClient<{ message: string; outlet: Outlet }>(
      `/outlets/${outletId}`,
      { method: "PUT", body },
    );

    revalidatePath("/dashboard/tables");
    revalidatePath("/dashboard/orders");

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
