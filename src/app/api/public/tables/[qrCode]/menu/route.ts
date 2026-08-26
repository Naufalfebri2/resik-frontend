import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { PublicMenuResponse } from "@/types/public-order";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ qrCode: string }> },
) {
  try {
    const { qrCode } = await params;

    const data = await apiClient<PublicMenuResponse>(
      `/public/tables/${qrCode}/menu`,
      { skipAuth: true },
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
