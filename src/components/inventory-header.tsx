import { OutletSwitcher } from "@/components/outlet-switcher";
import type { Outlet } from "@/types/inventory";

export function InventoryHeader({
  outlets,
  selectedOutletId,
}: {
  outlets: Outlet[];
  selectedOutletId: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Manage ingredients and stock levels per section
        </p>
      </div>
      <OutletSwitcher outlets={outlets} selectedOutletId={selectedOutletId} />
    </div>
  );
}
