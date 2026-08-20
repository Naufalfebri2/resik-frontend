import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { PayrollPeriod } from "@/types/payroll";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ payrollPeriodId: string }> },
) {
  try {
    const { payrollPeriodId } = await params;
    const body = await request.json();

    const data = await apiClient<{
      message: string;
      payroll_period: PayrollPeriod;
    }>(`/payroll-periods/${payrollPeriodId}/status`, {
      method: "PUT",
      body,
    });

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
