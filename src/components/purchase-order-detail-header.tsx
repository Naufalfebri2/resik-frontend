"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useUpdatePurchaseOrderStatus } from "@/hooks/use-update-purchase-order-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { MarkAsReceivedDialog } from "@/components/mark-as-received-dialog";
import { EditPurchaseOrderDialog } from "@/components/edit-purchase-order-dialog";
import { DeletePurchaseOrderAlert } from "@/components/delete-purchase-order-alert";
import type {
  CashAccount,
  Ingredient,
  PurchaseOrder,
  PurchaseOrderStatus,
  Supplier,
} from "@/types/inventory";

const statusVariant: Record<
  PurchaseOrderStatus,
  "outline" | "default" | "secondary"
> = {
  draft: "outline",
  ordered: "default",
  received: "secondary",
};

const statusLabel: Record<PurchaseOrderStatus, string> = {
  draft: "Draft",
  ordered: "Ordered",
  received: "Received",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function PurchaseOrderDetailHeader({
  outletId,
  purchaseOrder,
  cashAccounts,
  suppliers,
  ingredients,
}: {
  outletId: string;
  purchaseOrder: PurchaseOrder;
  cashAccounts: CashAccount[];
  suppliers: Supplier[];
  ingredients: Ingredient[];
}) {
  const router = useRouter();
  const [receivedDialogOpen, setReceivedDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateStatus = useUpdatePurchaseOrderStatus();

  function handleMarkAsOrdered() {
    updateStatus.mutate(
      {
        outletId,
        purchaseOrderId: purchaseOrder.id,
        status: "ordered",
      },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Purchase order marked as ordered");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <div className="space-y-4">
      <Link
        href={`/dashboard/purchase-orders?outlet=${outletId}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Purchase Orders
      </Link>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {purchaseOrder.supplier.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(purchaseOrder.date)}
            {purchaseOrder.received_at &&
              ` · Received on ${formatDate(purchaseOrder.received_at)}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[purchaseOrder.status]}>
            {statusLabel[purchaseOrder.status]}
          </Badge>

          {purchaseOrder.status === "draft" && (
            <Button
              onClick={handleMarkAsOrdered}
              disabled={updateStatus.isPending}
            >
              {updateStatus.isPending ? "Saving..." : "Mark as Ordered"}
            </Button>
          )}

          {purchaseOrder.status === "ordered" && (
            <Button onClick={() => setReceivedDialogOpen(true)}>
              Mark as Received
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <MarkAsReceivedDialog
        outletId={outletId}
        purchaseOrder={purchaseOrder}
        cashAccounts={cashAccounts}
        open={receivedDialogOpen}
        onOpenChange={setReceivedDialogOpen}
      />

      <EditPurchaseOrderDialog
        outletId={outletId}
        purchaseOrder={purchaseOrder}
        suppliers={suppliers}
        ingredients={ingredients}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeletePurchaseOrderAlert
        outletId={outletId}
        purchaseOrder={purchaseOrder}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
