import { getOutlets } from "@/lib/outlets";
import { InventoryHeader } from "@/components/inventory-header";
import { InventoryContent } from "@/components/inventory-content";

interface InventoryPageProps {
  searchParams: Promise<{ outlet?: string; section?: string }>;
}

export default async function InventoryPage({
  searchParams,
}: InventoryPageProps) {
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
      <InventoryHeader outlets={outlets} selectedOutletId={selectedOutletId} />
      <InventoryContent
        outletId={selectedOutletId}
        selectedSectionId={params.section}
      />
    </div>
  );
}
