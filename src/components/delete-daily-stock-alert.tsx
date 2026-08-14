"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteDailyStock } from "@/hooks/use-delete-daily-stock";
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
import type { DailyStock } from "@/types/inventory";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DeleteDailyStockAlert({
  ingredientId,
  dailyStock,
  open,
  onOpenChange,
  onDeleted,
}: {
  ingredientId: string;
  dailyStock: DailyStock;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const deleteDailyStock = useDeleteDailyStock();

  function handleDelete() {
    deleteDailyStock.mutate(
      { ingredientId, dailyStockId: dailyStock.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success("Daily stock deleted successfully");
          onDeleted?.();
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete daily stock for {formatDate(dailyStock.date)}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            daily stock record and all its recorded outflows.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteDailyStock.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteDailyStock.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteDailyStock.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
