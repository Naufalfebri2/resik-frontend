"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import type { OutletStaffMember, PaymentMethod, Table } from "@/types/orders";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  edc_bca: "EDC BCA",
  edc_bri: "EDC BRI",
  qr_bri: "QR BRI",
  qr_gopay: "QR GoPay",
  qr_shopeepay: "QR ShopeePay",
  other: "Other",
};

// Radix Select does not allow an empty string as an item value, so we use
// this sentinel to represent "no filter selected" instead.
const ALL_VALUE = "__all__";

export function OrderHistoryFilters({
  outletId,
  tables,
  staff,
}: {
  outletId: string;
  tables: Table[];
  staff: OutletStaffMember[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [dateFrom, setDateFrom] = useState(searchParams.get("date_from") ?? "");
  const [dateTo, setDateTo] = useState(searchParams.get("date_to") ?? "");
  const [tableId, setTableId] = useState(
    searchParams.get("table_id") ?? ALL_VALUE,
  );
  const [cashierId, setCashierId] = useState(
    searchParams.get("cashier_id") ?? ALL_VALUE,
  );
  const [paymentMethod, setPaymentMethod] = useState(
    searchParams.get("payment_method") ?? ALL_VALUE,
  );

  const hasActiveFilters =
    Boolean(searchParams.get("date_from")) ||
    Boolean(searchParams.get("date_to")) ||
    Boolean(searchParams.get("table_id")) ||
    Boolean(searchParams.get("cashier_id")) ||
    Boolean(searchParams.get("payment_method"));

  function applyFilters() {
    const params = new URLSearchParams(searchParams);
    params.set("outlet", outletId);

    if (dateFrom) params.set("date_from", dateFrom);
    else params.delete("date_from");

    if (dateTo) params.set("date_to", dateTo);
    else params.delete("date_to");

    if (tableId !== ALL_VALUE) params.set("table_id", tableId);
    else params.delete("table_id");

    if (cashierId !== ALL_VALUE) params.set("cashier_id", cashierId);
    else params.delete("cashier_id");

    if (paymentMethod !== ALL_VALUE)
      params.set("payment_method", paymentMethod);
    else params.delete("payment_method");

    // Applying filters should always reset back to page 1.
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    setDateFrom("");
    setDateTo("");
    setTableId(ALL_VALUE);
    setCashierId(ALL_VALUE);
    setPaymentMethod(ALL_VALUE);

    const params = new URLSearchParams(searchParams);
    params.set("outlet", outletId);
    params.delete("date_from");
    params.delete("date_to");
    params.delete("table_id");
    params.delete("cashier_id");
    params.delete("payment_method");
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-md border p-3">
      <div className="space-y-1">
        <Label htmlFor="date_from" className="text-xs">
          From
        </Label>
        <Input
          id="date_from"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-40"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="date_to" className="text-xs">
          To
        </Label>
        <Input
          id="date_to"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-40"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Table</Label>
        <Select value={tableId} onValueChange={setTableId}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All tables" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All tables</SelectItem>
            {tables.map((table) => (
              <SelectItem key={table.id} value={table.id}>
                {table.table_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Cashier</Label>
        <Select value={cashierId} onValueChange={setCashierId}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All cashiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All cashiers</SelectItem>
            {staff.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Payment Method</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All methods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All methods</SelectItem>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={applyFilters}>
          Apply
        </Button>
        {hasActiveFilters && (
          <Button size="sm" variant="ghost" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
