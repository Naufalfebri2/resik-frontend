import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ outletId: string; orderId: string }> },
) {
  const { outletId, orderId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("bmp_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(
    `${API_URL}/outlets/${outletId}/orders/${orderId}/receipt`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { message: "Failed to generate receipt" },
      { status: response.status },
    );
  }

  const pdfBuffer = await response.arrayBuffer();
  const contentDisposition =
    response.headers.get("content-disposition") ??
    `attachment; filename="receipt-${orderId}.pdf"`;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": contentDisposition,
    },
  });
}
