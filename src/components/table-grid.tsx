import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Order, Table } from "@/types/orders";

export function TableGrid({
  tables,
  openOrders,
  outletId,
}: {
  tables: Table[];
  openOrders: Order[];
  outletId: string;
}) {
  if (tables.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No tables in this section yet.
      </p>
    );
  }

  const orderByTableId = new Map(
    openOrders
      .filter((order) => order.table_id !== null)
      .map((order) => [order.table_id as string, order]),
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {tables.map((table) => {
        const activeOrder = orderByTableId.get(table.id);
        const isOccupied = !!activeOrder;

        const href = isOccupied
          ? `/dashboard/orders/${activeOrder.id}?outlet=${outletId}`
          : `/dashboard/orders/new?outlet=${outletId}&section=${table.section_id}&table=${table.id}`;

        return (
          <Link
            key={table.id}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-lg border p-4 aspect-square transition-colors",
              isOccupied
                ? "border-destructive/50 bg-destructive/5 hover:bg-destructive/10"
                : "border-border hover:bg-accent",
            )}
          >
            <span className="text-lg font-semibold">{table.table_number}</span>
            <span
              className={cn(
                "text-xs font-medium",
                isOccupied ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {isOccupied ? "Occupied" : "Available"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
