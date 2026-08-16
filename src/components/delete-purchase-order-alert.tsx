"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeletePurchaseOrder } from "@/hooks/use-delete-purchase-order";
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
import type { PurchaseOrder } from "@/types/inventory";

export function DeletePurchaseOrderAlert({
  outletId,
  purchaseOrder,
  open,
  onOpenChange,
}: {
  outletId: string;
  purchaseOrder: PurchaseOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const deletePurchaseOrder = useDeletePurchaseOrder();

  function handleDelete() {
    deletePurchaseOrder.mutate(
      { outletId, purchaseOrderId: purchaseOrder.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.push(`/dashboard/purchase-orders?outlet=${outletId}`);
          toast.success("Purchase order deleted successfully");
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this purchase order?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            purchase order and its items.
            {purchaseOrder.status === "received" && (
              <span className="mt-1 block text-amber-600">
                This order has been received — the associated cash transaction
                will be deleted and stock will be recalculated.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePurchaseOrder.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deletePurchaseOrder.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deletePurchaseOrder.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
