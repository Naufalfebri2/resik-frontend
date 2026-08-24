import Link from "next/link";
import { History } from "lucide-react";
import { getOutlets } from "@/lib/outlets";
import { OutletSwitcher } from "@/components/outlet-switcher";
import { OrdersContent } from "@/components/orders-content";
import { Button } from "@/components/ui/button";

interface OrdersPageProps {
  searchParams: Promise<{ outlet?: string; section?: string }>;
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
          <OutletSwitcher
            outlets={outlets}
            selectedOutletId={selectedOutletId}
          />
        </div>
      </div>

      <OrdersContent
        outletId={selectedOutletId}
        selectedSectionId={params.section}
      />
    </div>
  );
}
