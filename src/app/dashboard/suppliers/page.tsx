import { getSuppliers } from "@/lib/suppliers";
import { SupplierTable } from "@/components/supplier-table";
import { CreateSupplierDialog } from "@/components/create-supplier-dialog";

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground">
            Manage your supplier contacts.
          </p>
        </div>
        <CreateSupplierDialog />
      </div>

      <SupplierTable suppliers={suppliers} />
    </div>
  );
}
