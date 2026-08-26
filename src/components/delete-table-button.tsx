"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import { useDeleteTable } from "@/hooks/use-delete-table";

export function DeleteTableButton({
  sectionId,
  tableId,
  tableNumber,
  isOccupied,
}: {
  sectionId: string;
  tableId: string;
  tableNumber: string;
  isOccupied: boolean;
}) {
  const router = useRouter();
  const deleteTable = useDeleteTable();
  const [open, setOpen] = useState(false);

  function handleDelete() {
    deleteTable.mutate(
      { sectionId, tableId },
      {
        onSuccess: () => {
          toast.success("Table deleted successfully");
          setOpen(false);
          router.refresh();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon-sm" disabled={isOccupied}>
          <Trash2 className="size-3.5 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete table {tableNumber}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the table and its QR code. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTable.isPending}
          >
            {deleteTable.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
