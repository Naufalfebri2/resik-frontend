import { notFound } from "next/navigation";
import { getPurchaseOrder } from "@/lib/purchase-orders";
import { getCashAccounts } from "@/lib/cash-accounts";
import { getSuppliers } from "@/lib/suppliers";
import { getIngredientsByOutlet } from "@/lib/ingredients";
import { ApiError } from "@/lib/api-client";
import { PurchaseOrderDetailHeader } from "@/components/purchase-order-detail-header";
import { PurchaseOrderItemsTable } from "@/components/purchase-order-items-table";

interface PurchaseOrderDetailPageProps {
  params: Promise<{ purchaseOrderId: string }>;
  searchParams: Promise<{ outlet?: string }>;
}

export default async function PurchaseOrderDetailPage({
  params,
  searchParams,
}: PurchaseOrderDetailPageProps) {
  const { purchaseOrderId } = await params;
  const { outlet: outletId } = await searchParams;

  if (!outletId) {
    notFound();
  }

  let purchaseOrder;
  try {
    purchaseOrder = await getPurchaseOrder(outletId, purchaseOrderId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const [cashAccounts, suppliers, ingredients] = await Promise.all([
    getCashAccounts(outletId),
    getSuppliers(),
    getIngredientsByOutlet(outletId),
  ]);

  return (
    <div className="space-y-6">
      <PurchaseOrderDetailHeader
        outletId={outletId}
        purchaseOrder={purchaseOrder}
        cashAccounts={cashAccounts}
        suppliers={suppliers}
        ingredients={ingredients}
      />

      <PurchaseOrderItemsTable items={purchaseOrder.items} />
    </div>
  );
}
