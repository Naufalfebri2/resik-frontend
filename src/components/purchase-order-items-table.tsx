import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatQuantity } from "@/lib/utils";
import type { PurchaseOrderItem } from "@/types/inventory";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function PurchaseOrderItemsTable({
  items,
}: {
  items: PurchaseOrderItem[];
}) {
  const total = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
    0,
  );

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ingredient</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const subtotal = Number(item.quantity) * Number(item.unit_price);

            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.ingredient.name}
                </TableCell>
                <TableCell>
                  {formatQuantity(item.quantity)} {item.ingredient.unit}
                </TableCell>
                <TableCell>{formatCurrency(Number(item.unit_price))}</TableCell>
                <TableCell>{formatCurrency(subtotal)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">
              Total
            </TableCell>
            <TableCell className="font-medium">
              {formatCurrency(total)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
