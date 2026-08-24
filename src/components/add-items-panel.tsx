"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuGrid } from "@/components/menu-grid";
import { useAddOrderItems } from "@/hooks/use-add-order-items";
import type { Menu } from "@/types/orders";

interface CartRow {
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

export function AddItemsPanel({
  outletId,
  orderId,
  menus,
}: {
  outletId: string;
  orderId: string;
  menus: Menu[];
}) {
  const router = useRouter();
  const addItems = useAddOrderItems();
  const [rows, setRows] = useState<CartRow[]>([]);

  function handleSelect(menu: Menu) {
    setRows((prev) => {
      const existing = prev.find((row) => row.menu.id === menu.id);
      if (existing) {
        return prev.map((row) =>
          row.menu.id === menu.id
            ? { ...row, quantity: row.quantity + 1 }
            : row,
        );
      }
      return [...prev, { menu, quantity: 1 }];
    });
  }

  function updateQuantity(menuId: string, delta: number) {
    setRows((prev) =>
      prev
        .map((row) =>
          row.menu.id === menuId
            ? { ...row, quantity: row.quantity + delta }
            : row,
        )
        .filter((row) => row.quantity > 0),
    );
  }

  function removeRow(menuId: string) {
    setRows((prev) => prev.filter((row) => row.menu.id !== menuId));
  }

  function handleSubmit() {
    addItems.mutate(
      {
        outletId,
        orderId,
        data: {
          items: rows.map((row) => ({
            menu_id: row.menu.id,
            quantity: row.quantity,
          })),
        },
      },
      {
        onSuccess: () => {
          toast.success("Items added to order");
          setRows([]);
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Add More Items</p>
      <MenuGrid menus={menus} onSelect={handleSelect} />

      {rows.length > 0 && (
        <div className="space-y-2 border rounded-lg p-3">
          {rows.map((row) => (
            <div
              key={row.menu.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{row.menu.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(Number(row.menu.price))}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-6"
                  onClick={() => updateQuantity(row.menu.id, -1)}
                >
                  <Minus className="size-3" />
                </Button>
                <span className="w-5 text-center">{row.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-6"
                  onClick={() => updateQuantity(row.menu.id, 1)}
                >
                  <Plus className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-destructive"
                  onClick={() => removeRow(row.menu.id)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={addItems.isPending}
          >
            {addItems.isPending ? "Adding..." : "Add to Order"}
          </Button>
        </div>
      )}
    </div>
  );
}