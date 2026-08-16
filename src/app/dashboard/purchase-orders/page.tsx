import { getOutlets } from "@/lib/outlets";
import { OutletSwitcher } from "@/components/outlet-switcher";
import { PurchaseOrdersContent } from "@/components/purchase-orders-content";

interface PurchaseOrdersPageProps {
  searchParams: Promise<{ outlet?: string }>;
}

export default async function PurchaseOrdersPage({
  searchParams,
}: PurchaseOrdersPageProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Purchase Orders
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage stock purchases from your suppliers.
          </p>
        </div>
        <OutletSwitcher outlets={outlets} selectedOutletId={selectedOutletId} />
      </div>

      <PurchaseOrdersContent outletId={selectedOutletId} />
    </div>
  );
}
