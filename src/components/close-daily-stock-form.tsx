"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCloseDailyStock } from "@/hooks/use-close-daily-stock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatQuantity } from "@/lib/utils";
import type { DailyStock } from "@/types/inventory";

export function CloseDailyStockForm({
  dailyStock,
  unit,
}: {
  dailyStock: DailyStock;
  unit: string;
}) {
  const router = useRouter();
  const [actualClosingStock, setActualClosingStock] = useState("");

  const closeDailyStock = useCloseDailyStock();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    closeDailyStock.mutate(
      {
        dailyStockId: dailyStock.id,
        actual_closing_stock: Number(actualClosingStock),
      },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Daily stock closed successfully");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <div>
        <p className="text-sm font-medium">Close Daily Stock</p>
        <p className="text-sm text-muted-foreground">
          Expected closing stock:{" "}
          {dailyStock.expected_closing_stock !== null
            ? `${formatQuantity(dailyStock.expected_closing_stock)} ${unit}`
            : "—"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="actual_closing_stock">
          Actual Closing Stock ({unit})
        </Label>
        <Input
          id="actual_closing_stock"
          type="number"
          step="0.01"
          min="0"
          value={actualClosingStock}
          onChange={(e) => setActualClosingStock(e.target.value)}
          placeholder="Enter counted physical stock"
          required
        />
      </div>

      {closeDailyStock.isError && (
        <p className="text-sm text-destructive">
          {closeDailyStock.error.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={closeDailyStock.isPending}
        className="w-full"
      >
        {closeDailyStock.isPending ? "Closing..." : "Close Daily Stock"}
      </Button>
    </form>
  );
}
