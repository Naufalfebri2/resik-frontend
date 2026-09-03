"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateFinanceCashAccount } from "@/hooks/use-update-finance-cash-account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CashAccount } from "@/types/inventory";

interface EditCashAccountDialogProps {
  cashAccount: CashAccount;
  outletId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCashAccountDialog({
  cashAccount,
  outletId,
  open,
  onOpenChange,
}: EditCashAccountDialogProps) {
  const router = useRouter();
  const [name, setName] = useState(cashAccount.name);
  const [type, setType] = useState<"cash" | "bank">(cashAccount.type);

  const updateCashAccount = useUpdateFinanceCashAccount();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateCashAccount.mutate(
      { outletId, cashAccountId: cashAccount.id, name, type },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success("Cash account updated successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Cash Account</DialogTitle>
            <DialogDescription>
              Update the name or type of this account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as "cash" | "bank")}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {updateCashAccount.isError && (
              <p className="text-sm text-destructive">
                {updateCashAccount.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={updateCashAccount.isPending}>
              {updateCashAccount.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
