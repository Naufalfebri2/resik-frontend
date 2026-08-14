import { StockAdjustmentRow } from "@/components/stock-adjustment-row";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StockAdjustment } from "@/types/inventory";

export function StockAdjustmentTable({
  ingredientId,
  unit,
  adjustments,
}: {
  ingredientId: string;
  unit: string;
  adjustments: StockAdjustment[];
}) {
  if (adjustments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No stock adjustments recorded yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {adjustments.map((adjustment) => (
            <StockAdjustmentRow
              key={adjustment.id}
              ingredientId={ingredientId}
              adjustment={adjustment}
              unit={unit}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
