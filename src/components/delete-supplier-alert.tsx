"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteSupplier } from "@/hooks/use-delete-supplier";
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
import type { Supplier } from "@/types/inventory";

export function DeleteSupplierAlert({
  supplier,
  open,
  onOpenChange,
}: {
  supplier: Supplier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const deleteSupplier = useDeleteSupplier();

  function handleDelete() {
    deleteSupplier.mutate(
      { supplierId: supplier.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success(`"${supplier.name}" deleted successfully`);
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete &quot;{supplier.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            supplier.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSupplier.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSupplier.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteSupplier.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
