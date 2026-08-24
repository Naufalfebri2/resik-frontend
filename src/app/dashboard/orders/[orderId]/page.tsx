import { OrderDetailContent } from "@/components/order-detail-content";

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ outlet?: string }>;
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: OrderDetailPageProps) {
  const { orderId } = await params;
  const { outlet } = await searchParams;

  if (!outlet) {
    return (
      <p className="text-sm text-muted-foreground">
        Missing outlet. Please open this order from the Orders page.
      </p>
    );
  }

  return <OrderDetailContent outletId={outlet} orderId={orderId} />;
}
