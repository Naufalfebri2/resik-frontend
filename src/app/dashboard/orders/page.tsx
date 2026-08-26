import Link from "next/link";
import { History } from "lucide-react";
import { getOutlets } from "@/lib/outlets";
import { getOrders } from "@/lib/orders";
import { OutletSwitcher } from "@/components/outlet-switcher";
import { OrdersContent } from "@/components/orders-content";
import { OrdersViewTabs } from "@/components/orders-view-tabs";
import { UnacknowledgedOrdersList } from "@/components/unacknowledged-orders-list";
import { Button } from "@/components/ui/button";

interface OrdersPageProps {
  searchParams: Promise<{
    outlet?: string;
    section?: string;
    tab?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
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

  const activeTab = params.tab === "unacknowledged" ? "unacknowledged" : "tables";

  const unacknowledgedOrders =
    activeTab === "unacknowledged"
      ? await getOrders(selectedOutletId, { unacknowledgedOnly: true })
      : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Orders (POS)
          </h1>
          <p className="text-sm text-muted-foreground">
            Select a table to start or continue an order.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/orders/history?outlet=${selectedOutletId}`}>
              <History className="size-4" />
              History
            </Link>
          </Button>
          <OutletSwitcher outlets={outlets} selectedOutletId={selectedOutletId} />
        </div>
      </div>

      <OrdersViewTabs
        outletId={selectedOutletId}
        unacknowledgedCount={unacknowledgedOrders.length}
      />

      {activeTab === "tables" ? (
        <OrdersContent
          outletId={selectedOutletId}
          selectedSectionId={params.section}
        />
      ) : (
        <UnacknowledgedOrdersList
          outletId={selectedOutletId}
          orders={unacknowledgedOrders}
        />
      )}
    </div>
  );
}