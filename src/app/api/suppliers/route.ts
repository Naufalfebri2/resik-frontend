import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Supplier } from "@/types/inventory";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = await apiClient<{ message: string; supplier: Supplier }>(
      "/suppliers",
      { method: "POST", body },
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
