import Link from "next/link";
import { cn } from "@/lib/utils";
import type { OrderHistoryItem, PaymentMethod } from "@/types/orders";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  edc_bca: "EDC BCA",
  edc_bri: "EDC BRI",
  qr_bri: "QR BRI",
  qr_gopay: "QR GoPay",
  qr_shopeepay: "QR ShopeePay",
  other: "Other",
};

const STATUS_BADGES: Record<
  OrderHistoryItem["status"],
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-secondary text-secondary-foreground",
  },
  paid: {
    label: "Success",
    className: "bg-green-100 text-green-800",
  },
  partially_refunded: {
    label: "Refund",
    className: "bg-orange-100 text-orange-800",
  },
  refunded: {
    label: "Refund",
    className: "bg-orange-100 text-orange-800",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800",
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getCashierName(order: OrderHistoryItem) {
  if (!order.opened_by) return "-";
  return order.opened_by.employee?.name ?? order.opened_by.email;
}

function getTotal(order: OrderHistoryItem) {
  if (order.subtotal === null) return null;

  const subtotal = Number(order.subtotal);
  const tax = Number(order.tax_amount ?? 0);
  const serviceCharge = Number(order.service_charge_amount ?? 0);

  return subtotal + tax + serviceCharge;
}

function getPaymentMethods(order: OrderHistoryItem) {
  if (!order.payments || order.payments.length === 0) return "-";

  const uniqueMethods = Array.from(
    new Set(order.payments.map((payment) => payment.method)),
  );

  return uniqueMethods
    .map((method) => PAYMENT_METHOD_LABELS[method])
    .join(", ");
}

export function OrderHistoryTable({
  outletId,
  orders,
}: {
  outletId: string;
  orders: OrderHistoryItem[];
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-md border py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No orders found for the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="px-4 py-2 font-medium">Order</th>
            <th className="px-4 py-2 font-medium">Date</th>
            <th className="px-4 py-2 font-medium">Table</th>
            <th className="px-4 py-2 font-medium">Cashier</th>
            <th className="px-4 py-2 font-medium">Payment</th>
            <th className="px-4 py-2 font-medium text-right">Total</th>
            <th className="px-4 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const badge = STATUS_BADGES[order.status];
            const total = getTotal(order);

            return (
              <tr
                key={order.id}
                className="border-b last:border-0 hover:bg-muted/30"
              >
                <td className="px-4 py-2">
                  <Link
                    href={`/dashboard/orders/${order.id}?outlet=${outletId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {order.order_number}
                  </Link>
                  {order.customer_name && (
                    <p className="text-xs text-muted-foreground">
                      {order.customer_name}
                    </p>
                  )}
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {formatDateTime(order.created_at)}
                </td>
                <td className="px-4 py-2">
                  {order.table?.table_number ?? "-"}
                </td>
                <td className="px-4 py-2">{getCashierName(order)}</td>
                <td className="px-4 py-2">{getPaymentMethods(order)}</td>
                <td className="px-4 py-2 text-right">
                  {total !== null ? formatCurrency(total) : "-"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={cn(
                      "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                      badge.className,
                    )}
                  >
                    {badge.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
