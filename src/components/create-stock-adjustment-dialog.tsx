"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateStockAdjustment } from "@/hooks/use-create-stock-adjustment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DailyStock } from "@/types/inventory";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function CreateStockAdjustmentDialog({
  ingredientId,
  unit,
  dailyStocks,
}: {
  ingredientId: string;
  unit: string;
  dailyStocks: DailyStock[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [reason, setReason] = useState("");

  const createStockAdjustment = useCreateStockAdjustment();

  function resetForm() {
    setDate("");
    setAdjustmentQuantity("");
    setReason("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!date) return;

    createStockAdjustment.mutate(
      {
        ingredientId,
        date,
        adjustment_quantity: Number(adjustmentQuantity),
        reason,
      },
      {
        onSuccess: () => {
          setOpen(false);
          resetForm();
          router.refresh();
          toast.success("Stock adjustment recorded successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Adjustment</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Stock Adjustment</DialogTitle>
            <DialogDescription>
              Correct stock levels for a date that already has a daily stock
              record. Use a negative number to reduce stock, positive to
              increase.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adjustment_date">Date</Label>
              <Select value={date} onValueChange={setDate}>
                <SelectTrigger id="adjustment_date">
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  {dailyStocks.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No daily stock records available
                    </div>
                  ) : (
                    dailyStocks.map((ds) => (
                      <SelectItem key={ds.id} value={ds.date}>
                        {formatDate(ds.date)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjustment_quantity">
                Adjustment Quantity ({unit})
              </Label>
              <Input
                id="adjustment_quantity"
                type="number"
                step="1"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(e.target.value)}
                placeholder="e.g. -2 or 3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Found damaged during stock opname"
                required
              />
            </div>

            {createStockAdjustment.isError && (
              <p className="text-sm text-destructive">
                {createStockAdjustment.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={createStockAdjustment.isPending || !date}
            >
              {createStockAdjustment.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
