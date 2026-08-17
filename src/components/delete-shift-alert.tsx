"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteShift } from "@/hooks/use-delete-shift";
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
import type { Shift } from "@/types/hr";

export function DeleteShiftAlert({
  shift,
  open,
  onOpenChange,
}: {
  shift: Shift;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const deleteShift = useDeleteShift();

  function handleDelete() {
    deleteShift.mutate(
      { sectionId: shift.section_id, shiftId: shift.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success(`"${shift.shift_name}" deleted successfully`);
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete &quot;{shift.shift_name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            shift.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteShift.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteShift.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteShift.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
