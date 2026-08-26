import { getOutlets } from "@/lib/outlets";
import { OutletSwitcher } from "@/components/outlet-switcher";
import { OutletQrToggle } from "@/components/outlet-qr-toggle";
import { TableManagementContent } from "@/components/table-management-content";

interface TablesPageProps {
  searchParams: Promise<{ outlet?: string; section?: string }>;
}

export default async function TablesPage({ searchParams }: TablesPageProps) {
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

  const selectedOutlet = outlets.find(
    (outlet) => outlet.id === selectedOutletId,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tables</h1>
          <p className="text-sm text-muted-foreground">
            Manage tables and QR codes for self-service ordering.
          </p>
        </div>
        <OutletSwitcher outlets={outlets} selectedOutletId={selectedOutletId} />
      </div>

      {selectedOutlet && (
        <OutletQrToggle
          outletId={selectedOutletId}
          enabled={selectedOutlet.qr_ordering_enabled}
        />
      )}

      <TableManagementContent
        outletId={selectedOutletId}
        selectedSectionId={params.section}
      />
    </div>
  );
}
