"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useAssignSplitLabel } from "@/hooks/use-assign-split-label";
import { useRefundItem } from "@/hooks/use-refund-item";
import { useUpdatePrepStatus } from "@/hooks/use-update-prep-status";
import type { OrderItem } from "@/types/orders";

function formatCurrency(value: string | number) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numeric);
}

function SplitLabelCell({
  item,
  outletId,
  orderId,
}: {
  item: OrderItem;
  outletId: string;
  orderId: string;
}) {
  const router = useRouter();
  const assignSplitLabel = useAssignSplitLabel();
  const [value, setValue] = useState(item.split_label ?? "");

  function handleBlur() {
    if (value === (item.split_label ?? "")) return;

    assignSplitLabel.mutate(
      {
        outletId,
        orderId,
        orderItemId: item.id,
        data: { split_label: value || null },
      },
      {
        onSuccess: () => {
          toast.success("Split label updated");
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      placeholder="e.g. A"
      className="h-8 w-20"
      disabled={assignSplitLabel.isPending}
    />
  );
}

const PREP_STATUS_LABELS: Record<OrderItem["prep_status"], string> = {
  pending: "Pending",
  preparing: "Preparing",
  prepared: "Prepared",
};

const PREP_STATUS_NEXT: Record<
  OrderItem["prep_status"],
  { target: "preparing" | "prepared"; label: string } | null
> = {
  pending: { target: "preparing", label: "Start Preparing" },
  preparing: { target: "prepared", label: "Mark Prepared" },
  prepared: null,
};

function PrepStatusCell({
  item,
  outletId,
  orderId,
}: {
  item: OrderItem;
  outletId: string;
  orderId: string;
}) {
  const router = useRouter();
  const updatePrepStatus = useUpdatePrepStatus();

  if (item.refund_status === "refunded") {
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  const next = PREP_STATUS_NEXT[item.prep_status];

  function handleClick() {
    if (!next) return;

    updatePrepStatus.mutate(
      { outletId, orderId, orderItemId: item.id, prepStatus: next.target },
      {
        onSuccess: () => {
          toast.success(`Item marked as ${next.target}`);
          router.refresh();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={item.prep_status === "prepared" ? "default" : "secondary"}
      >
        {PREP_STATUS_LABELS[item.prep_status]}
      </Badge>
      {next && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={updatePrepStatus.isPending}
        >
          {updatePrepStatus.isPending ? "..." : next.label}
        </Button>
      )}
    </div>
  );
}

function RefundButton({
  item,
  outletId,
  orderId,
}: {
  item: OrderItem;
  outletId: string;
  orderId: string;
}) {
  const router = useRouter();
  const refundItem = useRefundItem();

  function handleConfirm() {
    refundItem.mutate(
      {
        outletId,
        orderId,
        orderItemId: item.id,
        data: { refund_to_cash: false },
      },
      {
        onSuccess: () => {
          toast.success("Item refunded");
          router.refresh();
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
        <Button variant="ghost" size="sm" className="text-destructive">
          Refund
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Refund this item?</AlertDialogTitle>
          <AlertDialogDescription>
            Refund {item.menu?.name} ({item.quantity}x). This cannot be undone.
            Refunding to cash can be handled separately via the reconciliation
            flow.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Refund</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function OrderItemsTable({
  items,
  outletId,
  orderId,
}: {
  items: OrderItem[];
  outletId: string;
  orderId: string;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No items in this order yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Split Label</TableHead>
          <TableHead>Prep Status</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-24" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.menu?.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>
              {formatCurrency(Number(item.unit_price) * item.quantity)}
            </TableCell>
            <TableCell>
              <SplitLabelCell
                item={item}
                outletId={outletId}
                orderId={orderId}
              />
            </TableCell>
            <TableCell>
              <PrepStatusCell
                item={item}
                outletId={outletId}
                orderId={orderId}
              />
            </TableCell>
            <TableCell>
              {item.refund_status === "refunded" ? (
                <Badge variant="destructive">Refunded</Badge>
              ) : (
                <Badge variant="secondary">Active</Badge>
              )}
            </TableCell>
            <TableCell>
              {item.refund_status === "none" && (
                <RefundButton
                  item={item}
                  outletId={outletId}
                  orderId={orderId}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
