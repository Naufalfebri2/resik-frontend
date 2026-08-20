import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { PayrollPeriod } from "@/types/payroll";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = await apiClient<{
      message: string;
      payroll_periods: PayrollPeriod[];
    }>("/payroll-periods/generate", { method: "POST", body });

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
