import { getMenus } from "@/lib/menus";
import { getTables } from "@/lib/tables";
import { NewOrderScreen } from "@/components/new-order-screen";

interface NewOrderPageProps {
  searchParams: Promise<{
    outlet?: string;
    section?: string;
    table?: string;
  }>;
}

export default async function NewOrderPage({
  searchParams,
}: NewOrderPageProps) {
  const params = await searchParams;

  if (!params.outlet || !params.section || !params.table) {
    return (
      <p className="text-sm text-muted-foreground">
        Missing outlet, section, or table. Please select a table from the Orders
        page.
      </p>
    );
  }

  const [menus, tables] = await Promise.all([
    getMenus(params.outlet),
    getTables(params.section),
  ]);

  const table = tables.find((t) => t.id === params.table);

  if (!table) {
    return (
      <p className="text-sm text-muted-foreground">
        Table not found. Please select a table from the Orders page.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Order</h1>
        <p className="text-sm text-muted-foreground">
          Add items for Table {table.table_number}.
        </p>
      </div>

      <NewOrderScreen
        outletId={params.outlet}
        tableId={table.id}
        tableNumber={table.table_number}
        menus={menus}
      />
    </div>
  );
}
