import { SupplierRowActions } from "@/components/supplier-row-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Supplier } from "@/types/inventory";

export function SupplierTable({ suppliers }: { suppliers: Supplier[] }) {
  if (suppliers.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No suppliers yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell className="font-medium">{supplier.name}</TableCell>
            <TableCell>{supplier.contact}</TableCell>
            <TableCell>
              <SupplierRowActions supplier={supplier} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
