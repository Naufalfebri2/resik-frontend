import { getOutlets } from "@/lib/outlets";
import { getOrders } from "@/lib/orders";
import { getMenus } from "@/lib/menus";
import { OutletSwitcher } from "@/components/outlet-switcher";
import { DeliveryOrdersContent } from "@/components/delivery-orders-content";
import { CreateDeliveryOrderDialog } from "@/components/create-delivery-order-dialog";

interface DeliveryPageProps {
  searchParams: Promise<{ outlet?: string }>;
}

export default async function DeliveryPage({
  searchParams,
}: DeliveryPageProps) {
  const params = await searchParams;
  const outlets = await getOutlets();
  const selectedOutletId = params.outlet ?? outlets[0]?.id;

  if (!selectedOutletId) {
    return (
      <p className="text-sm text-muted-foreground">
        No outlets found. Please create an outlet first.
      </p>
    );
  }

  const [orders, menus] = await Promise.all([
    getOrders(selectedOutletId),
    getMenus(selectedOutletId),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Delivery</h1>
          <p className="text-sm text-muted-foreground">
            Manually record and track orders from delivery platforms.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateDeliveryOrderDialog
            outletId={selectedOutletId}
            menus={menus}
          />
          <OutletSwitcher
            outlets={outlets}
            selectedOutletId={selectedOutletId}
          />
        </div>
      </div>

      <DeliveryOrdersContent outletId={selectedOutletId} orders={orders} />
    </div>
  );
}
