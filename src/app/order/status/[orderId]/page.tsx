import { notFound } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import { PublicOrderStatus } from "@/components/public-order-status";
import type { PublicOrderStatusResponse } from "@/types/public-order";

export default async function OrderStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ qrCode?: string }>;
}) {
  const { orderId } = await params;
  const { qrCode } = await searchParams;

  let statusData: PublicOrderStatusResponse;

  try {
    statusData = await apiClient<PublicOrderStatusResponse>(
      `/public/orders/${orderId}/status`,
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
            : "Something went wrong loading your order status."}
        </p>
      </div>
    );
  }

  return (
    <PublicOrderStatus
      orderId={orderId}
      initialData={statusData}
      qrCode={qrCode}
    />
  );
}
