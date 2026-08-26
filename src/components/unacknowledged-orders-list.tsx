import Link from "next/link";
import { AcknowledgeOrderButton } from "@/components/acknowledge-order-button";
import type { Order } from "@/types/orders";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getOrderTotal(order: Order) {
  if (!order.items) return 0;

  return order.items
    .filter((item) => item.refund_status === "none")
    .reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0);
}

export function UnacknowledgedOrdersList({
  outletId,
  orders,
}: {
  outletId: string;
  orders: Order[];
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-md border py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No orders waiting for acknowledgement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/orders/${order.id}?outlet=${outletId}`}
                className="font-medium text-primary hover:underline"
              >
                {order.order_number}
              </Link>
              <span className="text-xs text-muted-foreground">
                {order.table?.table_number
                  ? `Table ${order.table.table_number}`
                  : "No table"}
              </span>
            </div>
            {order.customer_name && (
              <p className="text-sm text-muted-foreground">
                {order.customer_name}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {formatTime(order.created_at)} -{" "}
              {formatCurrency(getOrderTotal(order))}
            </p>
          </div>

          <AcknowledgeOrderButton outletId={outletId} orderId={order.id} />
        </div>
      ))}
    </div>
  );
}
