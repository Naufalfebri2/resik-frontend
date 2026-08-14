"use client";

import { useState } from "react";
import { useOutflows } from "@/hooks/use-outflows";
import { CreateOutflowForm } from "@/components/create-outflow-form";
import { CloseDailyStockForm } from "@/components/close-daily-stock-form";
import { EditDailyStockDialog } from "@/components/edit-daily-stock-dialog";
import { DeleteDailyStockAlert } from "@/components/delete-daily-stock-alert";
import { OutflowItem } from "@/components/outflow-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatQuantity } from "@/lib/utils";
import type { DailyStock } from "@/types/inventory";

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
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isClosed = dailyStock.actual_closing_stock !== null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>{formatDate(dailyStock.date)}</SheetTitle>
              <div className="mr-8 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
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
                    <OutflowItem
                      key={outflow.id}
                      dailyStockId={dailyStock.id}
                      outflow={outflow}
                      unit={unit}
                    />
                  ))}
                </ul>
              )}
            </div>

            {!isLoading && outflows && (
              <CreateOutflowForm
                dailyStock={dailyStock}
                outflows={outflows}
                unit={unit}
              />
            )}

            <CloseDailyStockForm dailyStock={dailyStock} unit={unit} />
          </div>
        </SheetContent>
      </Sheet>

      <EditDailyStockDialog
        ingredientId={ingredientId}
        unit={unit}
        dailyStock={dailyStock}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteDailyStockAlert
        ingredientId={ingredientId}
        dailyStock={dailyStock}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => onOpenChange(false)}
      />
    </>
  );
}
