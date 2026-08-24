import { getOrder } from "@/lib/orders";
import { getOutlets } from "@/lib/outlets";
import { ReceiptView } from "@/components/receipt-view";

interface ReceiptPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ outlet?: string }>;
}

export default async function ReceiptPage({
  params,
  searchParams,
}: ReceiptPageProps) {
  const { orderId } = await params;
  const { outlet: outletId } = await searchParams;

  if (!outletId) {
    return (
      <p className="text-sm text-muted-foreground">
        Missing outlet. Please open this receipt from the order page.
      </p>
    );
  }

  const [order, outlets] = await Promise.all([
    getOrder(outletId, orderId),
    getOutlets(),
  ]);

  const outlet = outlets.find((o) => o.id === outletId);

  return (
    <ReceiptView
      order={order}
      outletName={outlet?.name ?? "-"}
      outletId={outletId}
    />
  );
}
