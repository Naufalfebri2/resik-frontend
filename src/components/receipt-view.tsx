"use client";

import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import type { Order } from "@/types/orders";

const VAT_PERCENTAGE = 11;

function formatCurrency(value: string | number) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numeric);
}

export function ReceiptView({
  order,
  outletName,
  outletId,
}: {
  order: Order;
  outletName: string;
  outletId: string;
}) {
  const items = order.items ?? [];
  const activeItems = items.filter((item) => item.refund_status === "none");

  const isPaid = order.subtotal !== null;
  const subtotal = isPaid
    ? Number(order.subtotal)
    : activeItems.reduce(
        (sum, item) => sum + Number(item.unit_price) * item.quantity,
        0,
      );
  const taxAmount = Number(order.tax_amount ?? 0);
  const serviceChargeAmount = Number(order.service_charge_amount ?? 0);
  const grandTotal = subtotal + taxAmount + serviceChargeAmount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-semibold tracking-tight">Receipt</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" /> Print
          </Button>
          <Button asChild>
            <a
              href={`/api/outlets/${outletId}/orders/${order.id}/receipt`}
              download
            >
              <Download className="size-4" /> Download PDF
            </a>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-sm border rounded-lg p-6 font-mono text-sm bg-white print:border-0 print:shadow-none print:max-w-full">
        <div className="text-center space-y-1 pb-3">
          <p className="font-bold text-base">{outletName}</p>
          <p>{order.order_number}</p>
          <p>
            {new Date(order.created_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}
            {new Date(order.created_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="border-t border-dashed py-2 space-y-1">
          <div className="flex justify-between">
            <span>Table</span>
            <span>{order.table?.table_number ?? "-"}</span>
          </div>
          {order.customer_name && (
            <div className="flex justify-between">
              <span>Customer</span>
              <span>{order.customer_name}</span>
            </div>
          )}
        </div>

        <div className="border-t border-dashed py-2 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-2">
              <div className="flex-1">
                <p>
                  {item.menu?.name}
                  {item.refund_status === "refunded" && (
                    <span className="text-xs"> (REFUNDED)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  x{item.quantity}
                  {item.split_label ? ` — Label: ${item.split_label}` : ""}
                </p>
              </div>
              <span className="whitespace-nowrap">
                {formatCurrency(Number(item.unit_price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed pt-2 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {isPaid && (
            <>
              <div className="flex justify-between">
                <span>VAT ({VAT_PERCENTAGE}%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge</span>
                <span>{formatCurrency(serviceChargeAmount)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between font-bold border-t border-dashed pt-1">
            <span>TOTAL</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {order.payments && order.payments.length > 0 && (
          <div className="border-t border-dashed mt-2 pt-2 space-y-1">
            {order.payments.map((payment) => (
              <div key={payment.id}>
                <div className="flex justify-between">
                  <span className="uppercase">
                    {payment.method.replace("_", " ")}
                  </span>
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
                {payment.cash_received !== null && (
                  <>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Cash Received</span>
                      <span>{formatCurrency(payment.cash_received)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Change</span>
                      <span>{formatCurrency(payment.change_amount ?? 0)}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-center pt-4 text-xs">Thank you!</p>
      </div>
    </div>
  );
}
