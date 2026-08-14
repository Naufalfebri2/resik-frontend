"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateDailyStock } from "@/hooks/use-update-daily-stock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatQuantity } from "@/lib/utils";
import type { DailyStock } from "@/types/inventory";

export function EditDailyStockDialog({
  ingredientId,
  unit,
  dailyStock,
  open,
  onOpenChange,
}: {
  ingredientId: string;
  unit: string;
  dailyStock: DailyStock;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [openingStock, setOpeningStock] = useState(
    formatQuantity(dailyStock.opening_stock),
  );

  const updateDailyStock = useUpdateDailyStock();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateDailyStock.mutate(
      {
        ingredientId,
        dailyStockId: dailyStock.id,
        opening_stock: Number(openingStock),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success("Daily stock updated successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Daily Stock</DialogTitle>
            <DialogDescription>
              Update the opening stock for this date.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_opening_stock">Opening Stock ({unit})</Label>
              <Input
                id="edit_opening_stock"
                type="number"
                step="1"
                min="0"
                value={openingStock}
                onChange={(e) => setOpeningStock(e.target.value)}
                required
              />
            </div>

            {updateDailyStock.isError && (
              <p className="text-sm text-destructive">
                {updateDailyStock.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={updateDailyStock.isPending}>
              {updateDailyStock.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
