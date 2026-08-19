import { NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Outlet } from "@/types/inventory";

export async function GET() {
  try {
    const data = await apiClient<Outlet[]>("/outlets");
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
