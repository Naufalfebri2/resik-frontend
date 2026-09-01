"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteBooking } from "@/hooks/use-delete-booking";

export function DeleteBookingDialog({
  bookingId,
  customerName,
  outletId,
  open,
  onOpenChange,
}: {
  bookingId: string;
  customerName: string;
  outletId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const deleteBooking = useDeleteBooking();

  function handleDelete() {
    deleteBooking.mutate(
      { outletId, bookingId },
      {
        onSuccess: () => {
          toast.success("Booking deleted");
          onOpenChange(false);
          router.refresh();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the booking for{" "}
            <strong>{customerName}</strong>? This can&apos;t be undone from
            here.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteBooking.isPending}
          >
            {deleteBooking.isPending ? "Deleting..." : "Delete Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
