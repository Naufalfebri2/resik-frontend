"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { DailyStockDetailSheet } from "@/components/daily-stock-detail-sheet";
import { formatQuantity } from "@/lib/utils";
import type { DailyStock, StockOutflowCategory } from "@/types/inventory";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function sumByCategory(
  outflows: DailyStock["stock_outflows"],
  category: StockOutflowCategory,
): number {
  if (!outflows) return 0;
  return outflows
    .filter((o) => o.category === category)
    .reduce((sum, o) => sum + Number(o.quantity), 0);
}

export function DailyStockRow({
  ingredientId,
  unit,
  dailyStock,
}: {
  ingredientId: string;
  unit: string;
  dailyStock: DailyStock;
}) {
  const [open, setOpen] = useState(false);

  const isClosed = dailyStock.actual_closing_stock !== null;
  const variance =
    dailyStock.variance !== null ? Number(dailyStock.variance) : null;
  const stockIn = Number(dailyStock.stock_in);

  const production = sumByCategory(dailyStock.stock_outflows, "production");
  const waste = sumByCategory(dailyStock.stock_outflows, "waste");
  const supplierReturn = sumByCategory(
    dailyStock.stock_outflows,
    "supplier_return",
  );
  const totalOut = production + waste + supplierReturn;

  return (
    <>
      <TableRow className="cursor-pointer" onClick={() => setOpen(true)}>
        <TableCell>{formatDate(dailyStock.date)}</TableCell>
        <TableCell>
          {formatQuantity(dailyStock.opening_stock)} {unit}
        </TableCell>
        <TableCell>
          {stockIn > 0 ? `${formatQuantity(stockIn)} ${unit}` : "—"}
        </TableCell>
        <TableCell>
          {production > 0 ? `${formatQuantity(production)} ${unit}` : "—"}
        </TableCell>
        <TableCell>
          {waste > 0 ? `${formatQuantity(waste)} ${unit}` : "—"}
        </TableCell>
        <TableCell>
          {supplierReturn > 0
            ? `${formatQuantity(supplierReturn)} ${unit}`
            : "—"}
        </TableCell>
        <TableCell>
          {totalOut > 0 ? `${formatQuantity(totalOut)} ${unit}` : "—"}
        </TableCell>
        <TableCell>
          {dailyStock.expected_closing_stock !== null
            ? `${formatQuantity(dailyStock.expected_closing_stock)} ${unit}`
            : "—"}
        </TableCell>
        <TableCell>
          {isClosed
            ? `${formatQuantity(dailyStock.actual_closing_stock!)} ${unit}`
            : "—"}
        </TableCell>
        <TableCell>
          {variance !== null ? (
            <Badge
              variant={
                variance === 0
                  ? "secondary"
                  : variance > 0
                    ? "default"
                    : "destructive"
              }
            >
              {variance > 0 ? "+" : ""}
              {formatQuantity(variance)} {unit}
            </Badge>
          ) : (
            "—"
          )}
        </TableCell>
        <TableCell>
          <Badge variant={isClosed ? "secondary" : "outline"}>
            {isClosed ? "Closed" : "Open"}
          </Badge>
        </TableCell>
      </TableRow>

      <DailyStockDetailSheet
        open={open}
        onOpenChange={setOpen}
        ingredientId={ingredientId}
        unit={unit}
        dailyStock={dailyStock}
      />
    </>
  );
}
