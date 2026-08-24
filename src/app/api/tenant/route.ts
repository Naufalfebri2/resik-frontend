import { NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Tenant } from "@/types/tenant";

export async function GET() {
  try {
    const data = await apiClient<Tenant>("/tenant");
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
