import { getTenant } from "@/lib/tenant";
import { getOutlets } from "@/lib/outlets";
import { ServiceChargeSettings } from "@/components/service-charge-settings";
import { OutletPickupSettings } from "@/components/outlet-pickup-settings";
import { OutletSwitcher } from "@/components/outlet-switcher";

interface SettingsPageProps {
  searchParams: Promise<{ outlet?: string }>;
}

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const params = await searchParams;
  const tenant = await getTenant();
  const outlets = await getOutlets();
  const currentPercentage = tenant.settings?.service_charge_percentage ?? 0;

  const selectedOutletId = params.outlet ?? outlets[0]?.id;
  const selectedOutlet = outlets.find(
    (outlet) => outlet.id === selectedOutletId,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Tenant-wide and per-outlet configuration.
        </p>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Tenant-wide
        </h2>
        <ServiceChargeSettings currentPercentage={currentPercentage} />
      </div>

      {selectedOutletId && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Per-outlet
            </h2>
            <OutletSwitcher
              outlets={outlets}
              selectedOutletId={selectedOutletId}
            />
          </div>
          {selectedOutlet && (
            <OutletPickupSettings
              outletId={selectedOutletId}
              enabled={selectedOutlet.online_pickup_enabled}
            />
          )}
        </div>
      )}
    </div>
  );
}
