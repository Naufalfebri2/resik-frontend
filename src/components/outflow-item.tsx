"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { useUpdateOutflow } from "@/hooks/use-update-outflow";
import { useDeleteOutflow } from "@/hooks/use-delete-outflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatQuantity } from "@/lib/utils";
import type { StockOutflow, StockOutflowCategory } from "@/types/inventory";

const categoryLabel: Record<string, string> = {
  production: "Production",
  waste: "Waste",
  supplier_return: "Supplier Return",
};

const categoryOptions: { value: StockOutflowCategory; label: string }[] = [
  { value: "production", label: "Production" },
  { value: "waste", label: "Waste" },
  { value: "supplier_return", label: "Supplier Return" },
];

export function OutflowItem({
  dailyStockId,
  outflow,
  unit,
}: {
  dailyStockId: string;
  outflow: StockOutflow;
  unit: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [category, setCategory] = useState<StockOutflowCategory>(
    outflow.category,
  );
  const [quantity, setQuantity] = useState(formatQuantity(outflow.quantity));

  const updateOutflow = useUpdateOutflow();
  const deleteOutflow = useDeleteOutflow();

  function invalidateAndRefresh() {
    queryClient.invalidateQueries({ queryKey: ["outflows", dailyStockId] });
    router.refresh();
  }

  function handleSave() {
    updateOutflow.mutate(
      {
        dailyStockId,
        outflowId: outflow.id,
        category,
        quantity: Number(quantity),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          invalidateAndRefresh();
          toast.success("Stock outflow updated successfully");
        },
      },
    );
  }

  function handleDelete() {
    deleteOutflow.mutate(
      { dailyStockId, outflowId: outflow.id },
      {
        onSuccess: () => {
          setDeleteOpen(false);
          invalidateAndRefresh();
          toast.success("Stock outflow deleted successfully");
        },
      },
    );
  }

  if (isEditing) {
    return (
      <li className="space-y-2 rounded-lg border px-3 py-2">
        <div className="flex gap-2">
          <Select
            value={category}
            onValueChange={(value) =>
              setCategory(value as StockOutflowCategory)
            }
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            step="1"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-24"
          />
        </div>

        {updateOutflow.isError && (
          <p className="text-sm text-destructive">
            {updateOutflow.error.message}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateOutflow.isPending}
          >
            {updateOutflow.isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsEditing(false);
              setCategory(outflow.category);
              setQuantity(formatQuantity(outflow.quantity));
            }}
            disabled={updateOutflow.isPending}
          >
            Cancel
          </Button>
        </div>
      </li>
    );
  }

  return (
    <>
      <li className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
        <span>{categoryLabel[outflow.category] ?? outflow.category}</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {formatQuantity(outflow.quantity)} {unit}
          </span>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </li>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this outflow?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              stock outflow record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteOutflow.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteOutflow.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteOutflow.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
