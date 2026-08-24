"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCancelOrder } from "@/hooks/use-cancel-order";

export function CancelOrderButton({
  outletId,
  orderId,
}: {
  outletId: string;
  orderId: string;
}) {
  const router = useRouter();
  const cancelOrder = useCancelOrder();

  function handleConfirm() {
    cancelOrder.mutate(
      { outletId, orderId },
      {
        onSuccess: () => {
          toast.success("Order cancelled");
          router.push(`/dashboard/orders?outlet=${outletId}`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-destructive">
          Cancel Order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
          <AlertDialogDescription>
            This will cancel the entire order and refund all items. This
            cannot be undone. Only possible if no items have started
            preparation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Order</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Cancel Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}