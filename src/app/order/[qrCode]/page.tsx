import { notFound } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import { PublicOrderMenu } from "@/components/public-order-menu";
import type { PublicMenuResponse } from "@/types/public-order";

export default async function CustomerOrderPage({
  params,
}: {
  params: Promise<{ qrCode: string }>;
}) {
  const { qrCode } = await params;

  let menuData: PublicMenuResponse;

  try {
    menuData = await apiClient<PublicMenuResponse>(
      `/public/tables/${qrCode}/menu`,
      { skipAuth: true },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try scanning the QR code again."}
        </p>
      </div>
    );
  }

  return <PublicOrderMenu qrCode={qrCode} initialData={menuData} />;
}
