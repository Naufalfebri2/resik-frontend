"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { useUpdateStockAdjustment } from "@/hooks/use-update-stock-adjustment";
import { useDeleteStockAdjustment } from "@/hooks/use-delete-stock-adjustment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TableCell, TableRow } from "@/components/ui/table";
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
import type { StockAdjustment } from "@/types/inventory";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function StockAdjustmentRow({
  ingredientId,
  adjustment,
  unit,
}: {
  ingredientId: string;
  adjustment: StockAdjustment;
  unit: string;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [quantity, setQuantity] = useState(
    formatQuantity(adjustment.adjustment_quantity),
  );
  const [reason, setReason] = useState(adjustment.reason);

  const updateAdjustment = useUpdateStockAdjustment();
  const deleteAdjustment = useDeleteStockAdjustment();

  function handleSave() {
    updateAdjustment.mutate(
      {
        ingredientId,
        adjustmentId: adjustment.id,
        adjustment_quantity: Number(quantity),
        reason,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          router.refresh();
          toast.success("Stock adjustment updated successfully");
        },
      },
    );
  }

  function handleDelete() {
    deleteAdjustment.mutate(
      { ingredientId, adjustmentId: adjustment.id },
      {
        onSuccess: () => {
          setDeleteOpen(false);
          router.refresh();
          toast.success("Stock adjustment deleted successfully");
        },
      },
    );
  }

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>{formatDate(adjustment.date)}</TableCell>
        <TableCell>
          <Input
            type="number"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-24"
          />
        </TableCell>
        <TableCell colSpan={2}>
          <div className="flex items-center gap-2">
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-9"
              rows={1}
            />
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateAdjustment.isPending}
            >
              {updateAdjustment.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setQuantity(formatQuantity(adjustment.adjustment_quantity));
                setReason(adjustment.reason);
              }}
              disabled={updateAdjustment.isPending}
            >
              Cancel
            </Button>
          </div>
          {updateAdjustment.isError && (
            <p className="mt-1 text-sm text-destructive">
              {updateAdjustment.error.message}
            </p>
          )}
        </TableCell>
      </TableRow>
    );
  }

  const quantityValue = Number(adjustment.adjustment_quantity);

  return (
    <>
      <TableRow>
        <TableCell>{formatDate(adjustment.date)}</TableCell>
        <TableCell>
          <Badge variant={quantityValue >= 0 ? "default" : "destructive"}>
            {quantityValue > 0 ? "+" : ""}
            {formatQuantity(quantityValue)} {unit}
          </Badge>
        </TableCell>
        <TableCell className="max-w-md truncate">{adjustment.reason}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
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
        </TableCell>
      </TableRow>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this adjustment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              stock adjustment record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteAdjustment.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteAdjustment.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteAdjustment.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
