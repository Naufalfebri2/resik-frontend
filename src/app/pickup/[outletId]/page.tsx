import { notFound } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import { PublicPickupOrderMenu } from "@/components/public-pickup-order-menu";
import type { PublicPickupMenuResponse } from "@/types/public-order";

export default async function CustomerPickupPage({
  params,
}: {
  params: Promise<{ outletId: string }>;
}) {
  const { outletId } = await params;

  let menuData: PublicPickupMenuResponse;

  try {
    menuData = await apiClient<PublicPickupMenuResponse>(
      `/public/outlets/${outletId}/pickup-menu`,
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
            : "Something went wrong. Please try again."}
        </p>
      </div>
    );
  }

  return <PublicPickupOrderMenu outletId={outletId} initialData={menuData} />;
}
