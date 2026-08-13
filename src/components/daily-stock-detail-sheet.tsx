"use client";

import { useOutflows } from "@/hooks/use-outflows";
import { CreateOutflowForm } from "@/components/create-outflow-form";
import { CloseDailyStockForm } from "@/components/close-daily-stock-form";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatQuantity } from "@/lib/utils";
import type { DailyStock } from "@/types/inventory";

const categoryLabel: Record<string, string> = {
  production: "Production",
  waste: "Waste",
  supplier_return: "Supplier Return",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DailyStockDetailSheet({
  open,
  onOpenChange,
  ingredientId,
  unit,
  dailyStock,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredientId: string;
  unit: string;
  dailyStock: DailyStock;
}) {
  const { data: outflows, isLoading } = useOutflows(dailyStock.id, open);

  const isClosed = dailyStock.actual_closing_stock !== null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{formatDate(dailyStock.date)}</SheetTitle>
          <SheetDescription>
            Opening stock: {formatQuantity(dailyStock.opening_stock)} {unit}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Stock Outflows</p>
              <Badge variant={isClosed ? "secondary" : "outline"}>
                {isClosed ? "Closed" : "Open"}
              </Badge>
            </div>

            {isLoading && (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}

            {!isLoading && outflows && outflows.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No outflows recorded yet.
              </p>
            )}

            {!isLoading && outflows && outflows.length > 0 && (
              <ul className="space-y-2">
                {outflows.map((outflow) => (
                  <li
                    key={outflow.id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                  >
                    <span>
                      {categoryLabel[outflow.category] ?? outflow.category}
                    </span>
                    <span className="font-medium">
                      {formatQuantity(outflow.quantity)} {unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!isClosed && !isLoading && outflows && (
            <CreateOutflowForm
              dailyStock={dailyStock}
              outflows={outflows}
              unit={unit}
            />
          )}

          {!isClosed && (
            <CloseDailyStockForm dailyStock={dailyStock} unit={unit} />
          )}

          {isClosed && (
            <div className="rounded-lg border bg-muted/50 p-4 text-sm">
              <p>
                Actual closing stock:{" "}
                <span className="font-medium">
                  {formatQuantity(dailyStock.actual_closing_stock!)} {unit}
                </span>
              </p>
              <p className="mt-1">
                Variance:{" "}
                <span className="font-medium">
                  {Number(dailyStock.variance) > 0 ? "+" : ""}
                  {formatQuantity(dailyStock.variance!)} {unit}
                </span>
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
