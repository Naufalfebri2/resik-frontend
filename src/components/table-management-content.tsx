import { getSections } from "@/lib/sections";
import { getTables } from "@/lib/tables";
import { getOrders } from "@/lib/orders";
import { SectionTabs } from "@/components/section-tabs";
import { CreateTableDialog } from "@/components/create-table-dialog";
import { EditTableDialog } from "@/components/edit-table-dialog";
import { DeleteTableButton } from "@/components/delete-table-button";
import { TableQrCode } from "@/components/table-qr-code";

export async function TableManagementContent({
  outletId,
  selectedSectionId,
}: {
  outletId: string;
  selectedSectionId: string | undefined;
}) {
  const sections = await getSections(outletId);
  const activeSectionId = selectedSectionId ?? sections[0]?.id;

  const [tables, allOrders] = await Promise.all([
    activeSectionId ? getTables(activeSectionId) : Promise.resolve([]),
    getOrders(outletId),
  ]);

  const openOrders = allOrders.filter((order) => order.status === "open");
  const occupiedTableIds = new Set(
    openOrders
      .filter((order) => order.table_id !== null)
      .map((order) => order.table_id as string),
  );

  return (
    <div className="space-y-4">
      <SectionTabs
        sections={sections}
        outletId={outletId}
        selectedSectionId={activeSectionId}
      />

      {sections.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No sections found for this outlet.
        </p>
      ) : (
        <>
          {activeSectionId && (
            <div className="flex justify-end">
              <CreateTableDialog sectionId={activeSectionId} />
            </div>
          )}

          {tables.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No tables in this section yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tables.map((table) => {
                const isOccupied = occupiedTableIds.has(table.id);

                return (
                  <div
                    key={table.id}
                    className="flex items-center justify-between gap-4 rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{table.table_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {isOccupied ? "Occupied" : "Available"}
                      </p>
                      <div className="flex gap-1 pt-1">
                        <EditTableDialog
                          sectionId={activeSectionId!}
                          table={table}
                        />
                        <DeleteTableButton
                          sectionId={activeSectionId!}
                          tableId={table.id}
                          tableNumber={table.table_number}
                          isOccupied={isOccupied}
                        />
                      </div>
                    </div>
                    <TableQrCode
                      sectionId={activeSectionId!}
                      tableId={table.id}
                      tableNumber={table.table_number}
                      qrCode={table.qr_code}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
