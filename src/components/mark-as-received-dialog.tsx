"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdatePurchaseOrderStatus } from "@/hooks/use-update-purchase-order-status";
import { useCreateCashAccount } from "@/hooks/use-create-cash-account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CashAccount, PurchaseOrder } from "@/types/inventory";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function MarkAsReceivedDialog({
  outletId,
  purchaseOrder,
  cashAccounts,
  open,
  onOpenChange,
}: {
  outletId: string;
  purchaseOrder: PurchaseOrder;
  cashAccounts: CashAccount[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [date, setDate] = useState(todayIso());
  const [cashAccountId, setCashAccountId] = useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");

  const updateStatus = useUpdatePurchaseOrderStatus();
  const createCashAccount = useCreateCashAccount();

  const total = purchaseOrder.items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
    0,
  );

  function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();

    createCashAccount.mutate(
      { outletId, name: newAccountName, type: "cash" },
      {
        onSuccess: (data) => {
          setCashAccountId(data.cash_account.id);
          setShowCreateAccount(false);
          setNewAccountName("");
          router.refresh();
          toast.success("Cash account created successfully");
        },
      },
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!cashAccountId) return;

    updateStatus.mutate(
      {
        outletId,
        purchaseOrderId: purchaseOrder.id,
        status: "received",
        cash_account_id: cashAccountId,
        date,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success("Purchase order marked as received");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Mark as Received</DialogTitle>
            <DialogDescription>
              This will record a {formatCurrency(total)} expense and update
              stock for the selected date. Make sure daily stock has been closed
              for all ingredients on that date.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="received_date">Received Date</Label>
              <Input
                id="received_date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {!showCreateAccount ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cash_account">Cash Account</Label>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => setShowCreateAccount(true)}
                  >
                    + New account
                  </Button>
                </div>
                <Select value={cashAccountId} onValueChange={setCashAccountId}>
                  <SelectTrigger id="cash_account">
                    <SelectValue placeholder="Select a cash account" />
                  </SelectTrigger>
                  <SelectContent>
                    {cashAccounts.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No cash accounts yet
                      </div>
                    ) : (
                      cashAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({formatCurrency(account.balance)})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2 rounded-lg border p-3">
                <Label htmlFor="new_account_name">New Cash Account Name</Label>
                <Input
                  id="new_account_name"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="e.g. Kas Outlet"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateAccount}
                    disabled={createCashAccount.isPending || !newAccountName}
                  >
                    {createCashAccount.isPending ? "Creating..." : "Create"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowCreateAccount(false)}
                  >
                    Cancel
                  </Button>
                </div>
                {createCashAccount.isError && (
                  <p className="text-sm text-destructive">
                    {createCashAccount.error.message}
                  </p>
                )}
              </div>
            )}

            {updateStatus.isError && (
              <p className="text-sm text-destructive">
                {updateStatus.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={updateStatus.isPending || !cashAccountId}
            >
              {updateStatus.isPending ? "Saving..." : "Confirm Received"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
