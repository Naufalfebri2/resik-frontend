"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { Menu } from "@/types/orders";

export interface CartItem {
  menu: Menu;
  quantity: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function OrderCart({
  tableNumber,
  items,
  customerName,
  onCustomerNameChange,
  onIncrement,
  onDecrement,
  onRemove,
  onSubmit,
  isSubmitting,
  error,
}: {
  tableNumber: string;
  items: CartItem[];
  customerName: string;
  onCustomerNameChange: (value: string) => void;
  onIncrement: (menuId: string) => void;
  onDecrement: (menuId: string) => void;
  onRemove: (menuId: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const total = items.reduce(
    (sum, item) => sum + Number(item.menu.price) * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col h-full border-l pl-4">
      <div className="pb-3 border-b">
        <p className="text-sm text-muted-foreground">Table</p>
        <p className="font-semibold">{tableNumber}</p>
      </div>

      <div className="py-3 space-y-2">
        <Label htmlFor="customer_name">Customer Name (optional)</Label>
        <Input
          id="customer_name"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          placeholder="Walk-in"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 py-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No items yet. Tap a menu to add.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.menu.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.menu.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(Number(item.menu.price))}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-6"
                  onClick={() => onDecrement(item.menu.id)}
                >
                  <Minus className="size-3" />
                </Button>
                <span className="w-5 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-6"
                  onClick={() => onIncrement(item.menu.id)}
                >
                  <Plus className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-destructive"
                  onClick={() => onRemove(item.menu.id)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t pt-3 space-y-2">
        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          className="w-full"
          disabled={items.length === 0 || isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "Sending..." : "Send Order"}
        </Button>
      </div>
    </div>
  );
}
