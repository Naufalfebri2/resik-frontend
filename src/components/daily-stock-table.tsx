import { DailyStockRow } from "@/components/daily-stock-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DailyStock } from "@/types/inventory";

export function DailyStockTable({
  ingredientId,
  unit,
  dailyStocks,
}: {
  ingredientId: string;
  unit: string;
  dailyStocks: DailyStock[];
}) {
  if (dailyStocks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No daily stock records yet. Add one to get started.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Opening</TableHead>
            <TableHead>Stock In</TableHead>
            <TableHead>Production</TableHead>
            <TableHead>Waste</TableHead>
            <TableHead>Supplier Return</TableHead>
            <TableHead>Total Out</TableHead>
            <TableHead>Expected Closing</TableHead>
            <TableHead>Actual Closing</TableHead>
            <TableHead>Variance</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dailyStocks.map((dailyStock) => (
            <DailyStockRow
              key={dailyStock.id}
              ingredientId={ingredientId}
              unit={unit}
              dailyStock={dailyStock}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
