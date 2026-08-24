import { getTenant } from "@/lib/tenant";
import { ServiceChargeSettings } from "@/components/service-charge-settings";

export default async function SettingsPage() {
  const tenant = await getTenant();
  const currentPercentage = tenant.settings?.service_charge_percentage ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Tenant-wide configuration.
        </p>
      </div>

      <ServiceChargeSettings currentPercentage={currentPercentage} />
    </div>
  );
}
