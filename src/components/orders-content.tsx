import { getSections } from "@/lib/sections";
import { getTables } from "@/lib/tables";
import { getOrders } from "@/lib/orders";
import { SectionTabs } from "@/components/section-tabs";
import { TableGrid } from "@/components/table-grid";

export async function OrdersContent({
  outletId,
  selectedSectionId,
}: {
  outletId: string;
  selectedSectionId: string | undefined;
}) {
  const sections = await getSections(outletId);
  const activeSectionId = selectedSectionId ?? sections[0]?.id;

  const [tables, orders] = await Promise.all([
    activeSectionId ? getTables(activeSectionId) : Promise.resolve([]),
    getOrders(outletId),
  ]);

  const openOrders = orders.filter((order) => order.status === "open");

  return (
    <div className="space-y-4">
      <SectionTabs
        sections={sections}
        outletId={outletId}
        selectedSectionId={activeSectionId}
      />
      <TableGrid tables={tables} openOrders={openOrders} outletId={outletId} />
    </div>
  );
}
