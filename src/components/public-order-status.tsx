"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { PublicOrderStatusResponse } from "@/types/public-order";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

async function fetchStatus(
  orderId: string,
): Promise<PublicOrderStatusResponse> {
  const response = await fetch(`/api/public/orders/${orderId}/status`);
  if (!response.ok) throw new Error("Failed to load order status");
  return response.json();
}

const STATUS_DISPLAY: Record<
  string,
  { label: string; icon: typeof Clock; className: string }
> = {
  open: {
    label: "Order received - preparing",
    icon: Clock,
    className: "text-orange-600",
  },
  paid: {
    label: "Order completed",
    icon: CheckCircle2,
    className: "text-green-600",
  },
  partially_refunded: {
    label: "Order completed (partial refund)",
    icon: CheckCircle2,
    className: "text-green-600",
  },
  refunded: {
    label: "Order refunded",
    icon: XCircle,
    className: "text-red-600",
  },
  cancelled: {
    label: "Order cancelled",
    icon: XCircle,
    className: "text-red-600",
  },
};

export function PublicOrderStatus({
  orderId,
  initialData,
  qrCode,
}: {
  orderId: string;
  initialData: PublicOrderStatusResponse;
  qrCode?: string;
}) {
  const { data } = useQuery({
    queryKey: ["public-order-status", orderId],
    queryFn: () => fetchStatus(orderId),
    initialData,
    // Keep polling while the order is still open; once it reaches a
    // final state there is nothing left to change, so we stop.
    refetchInterval: (query) =>
      query.state.data?.status === "open" ? 5000 : false,
  });

  const statusInfo = STATUS_DISPLAY[data.status] ?? {
    label: data.status,
    icon: Clock,
    className: "text-muted-foreground",
  };
  const StatusIcon = statusInfo.icon;

  const activeItems = data.items.filter(
    (item) => item.refund_status === "none",
  );

  return (
    <div className="mx-auto max-w-md p-4">
      <div className="space-y-1 border-b pb-4 text-center">
        <p className="text-sm text-muted-foreground">
          {data.order_number}
          {data.table_number ? ` - Table ${data.table_number}` : ""}
        </p>
        {data.customer_name && (
          <p className="text-sm text-muted-foreground">{data.customer_name}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 py-6">
        <StatusIcon className={`size-10 ${statusInfo.className}`} />
        <p className={`font-medium ${statusInfo.className}`}>
          {statusInfo.label}
        </p>
      </div>

      <div className="space-y-2 divide-y">
        {activeItems.map((item) => (
          <div key={item.id} className="flex justify-between py-2 text-sm">
            <span>
              {item.menu?.name ?? "Item"} x{item.quantity}
            </span>
            <span>
              {formatCurrency(Number(item.unit_price) * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t pt-3 font-semibold">
        <span>Total</span>
        <span>{formatCurrency(data.total)}</span>
      </div>

      {data.status === "open" && qrCode && (
        <Link
          href={`/order/${qrCode}`}
          className="mt-6 block w-full rounded-md border p-3 text-center text-sm font-medium hover:bg-accent"
        >
          Add more items
        </Link>
      )}
    </div>
  );
}
