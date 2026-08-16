import { OutletSwitcher } from "@/components/outlet-switcher";
import { HrSubNav } from "@/components/hr-sub-nav";
import type { Outlet } from "@/types/inventory";

export function HrHeader({
  outlets,
  selectedOutletId,
}: {
  outlets: Outlet[];
  selectedOutletId: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">HR</h1>
          <p className="text-sm text-muted-foreground">
            Manage employees and shifts per section
          </p>
        </div>
        <OutletSwitcher outlets={outlets} selectedOutletId={selectedOutletId} />
      </div>
      <HrSubNav />
    </div>
  );
}
