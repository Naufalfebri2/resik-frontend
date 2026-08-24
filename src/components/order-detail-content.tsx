import Link from "next/link";
import { getOrder } from "@/lib/orders";
import { getMenus } from "@/lib/menus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import { OrderItemsTable } from "@/components/order-items-table";
import { AddItemsPanel } from "@/components/add-items-panel";
import { PayOrderDialog } from "@/components/pay-order-dialog";
import { CancelOrderButton } from "@/components/cancel-order-button";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  paid: "Paid",
  partially_refunded: "Partially Refunded",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

export async function OrderDetailContent({
  outletId,
  orderId,
}: {
  outletId: string;
  orderId: string;
}) {
  const [order, menus] = await Promise.all([
    getOrder(outletId, orderId),
    getMenus(outletId),
  ]);

  const items = order.items ?? [];
  const activeItems = items.filter((item) => item.refund_status === "none");
  const subtotal = activeItems.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0,
  );

  const isPaid = order.subtotal !== null;
  const taxAmount = Number(order.tax_amount ?? 0);
  const serviceChargeAmount = Number(order.service_charge_amount ?? 0);
  const grandTotal = isPaid
    ? Number(order.subtotal) + taxAmount + serviceChargeAmount
    : subtotal;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {order.order_number}
            </h1>
            <Badge variant="secondary">{STATUS_LABELS[order.status]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {order.table ? `Table ${order.table.table_number}` : "No table"}
            {order.customer_name ? ` — ${order.customer_name}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link
              href={`/dashboard/orders/${order.id}/receipt?outlet=${outletId}`}
            >
              <Receipt className="size-4" /> Receipt
            </Link>
          </Button>
          {order.status === "open" && (
            <>
              <CancelOrderButton outletId={outletId} orderId={order.id} />
              <PayOrderDialog
                outletId={outletId}
                orderId={order.id}
                subtotal={subtotal}
              />
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-2">Order Items</h2>
        <OrderItemsTable items={items} outletId={outletId} orderId={order.id} />

        <div className="space-y-1 pt-3 border-t mt-3 max-w-xs ml-auto text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {isPaid && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Charge</span>
                <span>{formatCurrency(serviceChargeAmount)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between font-semibold pt-1 border-t">
            <span>Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {order.status === "open" && (
        <AddItemsPanel outletId={outletId} orderId={order.id} menus={menus} />
      )}
    </div>
  );
}
