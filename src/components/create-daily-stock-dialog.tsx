"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateDailyStock } from "@/hooks/use-create-daily-stock";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatQuantity } from "@/lib/utils";

export function CreateDailyStockDialog({
  ingredientId,
  unit,
  recordingMode,
  previousClosingStock,
}: {
  ingredientId: string;
  unit: string;
  recordingMode: "simple" | "detail";
  previousClosingStock: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [openingStock, setOpeningStock] = useState(
    recordingMode === "detail" && previousClosingStock !== null
      ? formatQuantity(previousClosingStock)
      : "",
  );

  const createDailyStock = useCreateDailyStock();

  function resetForm() {
    setDate("");
    setOpeningStock(
      recordingMode === "detail" && previousClosingStock !== null
        ? formatQuantity(previousClosingStock)
        : "",
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    createDailyStock.mutate(
      {
        ingredientId,
        date,
        opening_stock: Number(openingStock),
      },
      {
        onSuccess: () => {
          setOpen(false);
          resetForm();
          router.refresh();
          toast.success("Daily stock created successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Daily Stock</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Daily Stock</DialogTitle>
            <DialogDescription>
              Record today&apos;s opening stock count.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {recordingMode === "detail" && previousClosingStock !== null && (
              <p className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">
                This outlet uses Detail mode. Opening stock must match the
                previous closing stock:{" "}
                <span className="font-medium text-foreground">
                  {formatQuantity(previousClosingStock)} {unit}
                </span>
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="opening_stock">Opening Stock ({unit})</Label>
              <Input
                id="opening_stock"
                type="number"
                step="1"
                min="0"
                value={openingStock}
                onChange={(e) => setOpeningStock(e.target.value)}
                readOnly={
                  recordingMode === "detail" && previousClosingStock !== null
                }
                required
              />
            </div>

            {createDailyStock.isError && (
              <p className="text-sm text-destructive">
                {createDailyStock.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createDailyStock.isPending}>
              {createDailyStock.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
