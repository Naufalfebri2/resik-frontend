import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type {
  SubmitPublicOrderPayload,
  SubmitPublicOrderResponse,
} from "@/types/public-order";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ qrCode: string }> },
) {
  try {
    const { qrCode } = await params;
    const body: SubmitPublicOrderPayload = await request.json();

    const data = await apiClient<SubmitPublicOrderResponse>(
      `/public/tables/${qrCode}/order`,
      { method: "POST", body, skipAuth: true },
    );

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
