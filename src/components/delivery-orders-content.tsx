import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CourierStatusButton } from "@/components/courier-status-button";
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
  if (order.subtotal !== null) {
    return (
      Number(order.subtotal) +
      Number(order.tax_amount ?? 0) +
      Number(order.service_charge_amount ?? 0)
    );
  }

  if (!order.items) return 0;

  return order.items
    .filter((item) => item.refund_status === "none")
    .reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0);
}

const SOURCE_PLATFORM_LABELS: Record<string, string> = {
  grab: "GrabFood",
  gojek: "GoFood",
  shopeefood: "ShopeeFood",
  direct_call: "Direct Call",
  other: "Other",
};

const COURIER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  prepared: "Prepared",
  picked_up_by_courier: "Picked Up",
};

export function DeliveryOrdersContent({
  outletId,
  orders,
}: {
  outletId: string;
  orders: Order[];
}) {
  const deliveryOrders = orders.filter(
    (order) => order.order_type === "online_delivery",
  );

  if (deliveryOrders.length === 0) {
    return (
      <div className="rounded-md border py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No delivery orders recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {deliveryOrders.map((order) => (
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
              <Badge variant="outline">
                {order.source_platform
                  ? SOURCE_PLATFORM_LABELS[order.source_platform]
                  : "-"}
              </Badge>
              {order.courier_status && (
                <Badge
                  variant={
                    order.courier_status === "picked_up_by_courier"
                      ? "default"
                      : "secondary"
                  }
                >
                  {COURIER_STATUS_LABELS[order.courier_status]}
                </Badge>
              )}
            </div>
            {order.platform_order_id && (
              <p className="text-sm text-muted-foreground">
                Ref: {order.platform_order_id}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {formatTime(order.created_at)} -{" "}
              {formatCurrency(getOrderTotal(order))}
            </p>
          </div>

          {order.courier_status && (
            <CourierStatusButton
              outletId={outletId}
              orderId={order.id}
              courierStatus={order.courier_status}
            />
          )}
        </div>
      ))}
    </div>
  );
}
