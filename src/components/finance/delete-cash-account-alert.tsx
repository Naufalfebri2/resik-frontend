"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteFinanceCashAccount } from "@/hooks/use-delete-finance-cash-account";
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
import type { CashAccount } from "@/types/inventory";

export function DeleteCashAccountAlert({
  cashAccount,
  outletId,
  open,
  onOpenChange,
}: {
  cashAccount: CashAccount;
  outletId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const deleteCashAccount = useDeleteFinanceCashAccount();

  function handleDelete() {
    deleteCashAccount.mutate(
      { outletId, cashAccountId: cashAccount.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success(`"${cashAccount.name}" deleted successfully`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete &quot;{cashAccount.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this cash
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteCashAccount.isError && (
          <p className="text-sm text-destructive">
            {deleteCashAccount.error.message}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCashAccount.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteCashAccount.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteCashAccount.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
