import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/types/inventory";

const statusVariant: Record<
  PurchaseOrderStatus,
  "outline" | "default" | "secondary"
> = {
  draft: "outline",
  ordered: "default",
  received: "secondary",
};

const statusLabel: Record<PurchaseOrderStatus, string> = {
  draft: "Draft",
  ordered: "Ordered",
  received: "Received",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function calculateTotal(purchaseOrder: PurchaseOrder) {
  return purchaseOrder.items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
    0,
  );
}

export function PurchaseOrderTable({
  outletId,
  purchaseOrders,
}: {
  outletId: string;
  purchaseOrders: PurchaseOrder[];
}) {
  if (purchaseOrders.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No purchase orders yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchaseOrders.map((po) => (
          <TableRow key={po.id}>
            <TableCell>
              <Link
                href={`/dashboard/purchase-orders/${po.id}?outlet=${outletId}`}
                className="hover:underline"
              >
                {formatDate(po.date)}
              </Link>
            </TableCell>
            <TableCell>{po.supplier.name}</TableCell>
            <TableCell>{po.items.length}</TableCell>
            <TableCell>{formatCurrency(calculateTotal(po))}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[po.status]}>
                {statusLabel[po.status]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
