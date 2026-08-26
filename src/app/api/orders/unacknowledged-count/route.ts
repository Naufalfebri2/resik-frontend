import { NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";

export async function GET() {
  try {
    const data = await apiClient<{ count: number }>(
      "/orders/unacknowledged-count",
    );

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
