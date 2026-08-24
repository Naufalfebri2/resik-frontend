"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { usePayOrder } from "@/hooks/use-pay-order";
import type { PaymentMethod } from "@/types/orders";
import type { CashAccount } from "@/types/inventory";
import type { Tenant } from "@/types/tenant";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  edc_bca: "EDC BCA",
  edc_bri: "EDC BRI",
  qr_bri: "QR BRI",
  qr_gopay: "QR GoPay",
  qr_shopeepay: "QR ShopeePay",
  other: "Other",
};

const VAT_PERCENTAGE = 11;

interface PaymentRow {
  method: PaymentMethod;
  amount: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

async function fetchCashAccounts(outletId: string): Promise<CashAccount[]> {
  const response = await fetch(`/api/outlets/${outletId}/cash-accounts`);
  if (!response.ok) throw new Error("Failed to load cash accounts");
  return response.json();
}

async function fetchTenant(): Promise<Tenant> {
  const response = await fetch("/api/tenant");
  if (!response.ok) throw new Error("Failed to load tenant settings");
  return response.json();
}

export function PayOrderDialog({
  outletId,
  orderId,
  subtotal,
}: {
  outletId: string;
  orderId: string;
  subtotal: number;
}) {
  const router = useRouter();
  const payOrder = usePayOrder();

  const [open, setOpen] = useState(false);
  const [cashAccountId, setCashAccountId] = useState("");
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [cashReceived, setCashReceived] = useState("");

  const { data: cashAccounts = [] } = useQuery({
    queryKey: ["cash-accounts", outletId],
    queryFn: () => fetchCashAccounts(outletId),
    enabled: open,
  });

  const { data: tenant } = useQuery({
    queryKey: ["tenant"],
    queryFn: fetchTenant,
    enabled: open,
  });

  const servicePercentage = tenant?.settings?.service_charge_percentage ?? 0;
  const taxAmount = Math.round(subtotal * (VAT_PERCENTAGE / 100));
  const serviceChargeAmount = Math.round(subtotal * (servicePercentage / 100));
  const totalDue = subtotal + taxAmount + serviceChargeAmount;

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      setRows([{ method: "cash", amount: String(totalDue) }]);
      setCashReceived("");
    }
    setOpen(newOpen);
  }

  const totalEntered = rows.reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0,
  );

  const change = Number(cashReceived) - totalDue;

  function updateRow(index: number, patch: Partial<PaymentRow>) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function addRow() {
    setRows((prev) => [...prev, { method: "cash", amount: "" }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    let cashReceivedApplied = false;

    const payments = rows.map((row) => {
      const shouldApplyCashReceived =
        row.method === "cash" && cashReceived && !cashReceivedApplied;

      if (shouldApplyCashReceived) {
        cashReceivedApplied = true;
      }

      return {
        method: row.method,
        amount: Number(row.amount),
        cash_received: shouldApplyCashReceived
          ? Number(cashReceived)
          : undefined,
      };
    });

    payOrder.mutate(
      {
        outletId,
        orderId,
        data: {
          cash_account_id: cashAccountId,
          payments,
        },
      },
      {
        onSuccess: () => {
          toast.success("Order paid successfully");
          setOpen(false);
          router.refresh();
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Pay</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay Order</DialogTitle>
          <DialogDescription>
            Review the total before charging.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1 text-sm border rounded-md p-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                VAT ({VAT_PERCENTAGE}%)
              </span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Service Charge ({servicePercentage}%)
              </span>
              <span>{formatCurrency(serviceChargeAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-1 mt-1">
              <span>Total Due</span>
              <span>{formatCurrency(totalDue)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cash Account</Label>
            <Select value={cashAccountId} onValueChange={setCashAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select cash account" />
              </SelectTrigger>
              <SelectContent>
                {cashAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {cashAccounts.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No cash account found for this outlet. Create one first before
                accepting payment.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Payments</Label>
            {rows.map((row, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={row.method}
                  onValueChange={(value) =>
                    updateRow(index, { method: value as PaymentMethod })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PAYMENT_METHOD_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={row.amount}
                  onChange={(e) => updateRow(index, { amount: e.target.value })}
                  placeholder="Amount"
                />
                {rows.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(index)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="size-4" /> Add payment method
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Entered total: {formatCurrency(totalEntered)}
          </p>

          <div className="space-y-2 border-t pt-3">
            <Label htmlFor="cash_received">Cash Received (optional)</Label>
            <Input
              id="cash_received"
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              placeholder="e.g. 200000"
            />
            <p className="text-xs text-muted-foreground">
              Applied to the first cash payment row. Used to calculate and store
              the change given.
            </p>
            {cashReceived && (
              <p
                className={
                  change >= 0
                    ? "text-sm font-medium"
                    : "text-sm font-medium text-destructive"
                }
              >
                {change >= 0
                  ? `Change: ${formatCurrency(change)}`
                  : `Short by: ${formatCurrency(Math.abs(change))}`}
              </p>
            )}
          </div>

          {payOrder.isError && (
            <p className="text-sm text-destructive">{payOrder.error.message}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!cashAccountId || payOrder.isPending}
          >
            {payOrder.isPending ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
