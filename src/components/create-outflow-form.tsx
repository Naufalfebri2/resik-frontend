"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCreateOutflow } from "@/hooks/use-create-outflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatQuantity } from "@/lib/utils";
import type {
  DailyStock,
  StockOutflow,
  StockOutflowCategory,
} from "@/types/inventory";

const categoryOptions: { value: StockOutflowCategory; label: string }[] = [
  { value: "production", label: "Production" },
  { value: "waste", label: "Waste" },
  { value: "supplier_return", label: "Supplier Return" },
];

export function CreateOutflowForm({
  dailyStock,
  outflows,
  unit,
}: {
  dailyStock: DailyStock;
  outflows: StockOutflow[];
  unit: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<StockOutflowCategory | "">("");
  const [quantity, setQuantity] = useState("");

  const createOutflow = useCreateOutflow();

  const totalOutflowSoFar = outflows.reduce(
    (sum, o) => sum + Number(o.quantity),
    0,
  );
  const availableStock = Number(dailyStock.opening_stock) - totalOutflowSoFar;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!category) return;

    createOutflow.mutate(
      {
        dailyStockId: dailyStock.id,
        category,
        quantity: Number(quantity),
      },
      {
        onSuccess: () => {
          setCategory("");
          setQuantity("");
          queryClient.invalidateQueries({
            queryKey: ["outflows", dailyStock.id],
          });
          router.refresh();
          toast.success("Stock outflow recorded successfully");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">
        Available stock:{" "}
        <span className="font-medium text-foreground">
          {formatQuantity(availableStock)} {unit}
        </span>
      </p>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as StockOutflowCategory)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity ({unit})</Label>
        <Input
          id="quantity"
          type="number"
          step="1"
          min="0"
          max={availableStock}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>

      {createOutflow.isError && (
        <p className="text-sm text-destructive">
          {createOutflow.error.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={createOutflow.isPending || !category}
        className="w-full"
      >
        {createOutflow.isPending ? "Recording..." : "Record Outflow"}
      </Button>
    </form>
  );
}
