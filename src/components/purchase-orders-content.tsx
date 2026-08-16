import { getPurchaseOrders } from "@/lib/purchase-orders";
import { getSuppliers } from "@/lib/suppliers";
import { getIngredientsByOutlet } from "@/lib/ingredients";
import { PurchaseOrderTable } from "@/components/purchase-order-table";
import { CreatePurchaseOrderDialog } from "@/components/create-purchase-order-dialog";

export async function PurchaseOrdersContent({
  outletId,
}: {
  outletId: string;
}) {
  const [purchaseOrders, suppliers, ingredients] = await Promise.all([
    getPurchaseOrders(outletId),
    getSuppliers(),
    getIngredientsByOutlet(outletId),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreatePurchaseOrderDialog
          outletId={outletId}
          suppliers={suppliers}
          ingredients={ingredients}
        />
      </div>

      <PurchaseOrderTable outletId={outletId} purchaseOrders={purchaseOrders} />
    </div>
  );
}
