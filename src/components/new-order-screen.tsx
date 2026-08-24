"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MenuGrid } from "@/components/menu-grid";
import { OrderCart, type CartItem } from "@/components/order-cart";
import { useCreateOrder } from "@/hooks/use-create-order";
import type { Menu } from "@/types/orders";

export function NewOrderScreen({
  outletId,
  tableId,
  tableNumber,
  menus,
}: {
  outletId: string;
  tableId: string;
  tableNumber: string;
  menus: Menu[];
}) {
  const router = useRouter();
  const createOrder = useCreateOrder();

  const [items, setItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");

  function handleSelectMenu(menu: Menu) {
    setItems((prev) => {
      const existing = prev.find((item) => item.menu.id === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menu.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { menu, quantity: 1 }];
    });
  }

  function handleIncrement(menuId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.menu.id === menuId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function handleDecrement(menuId: string) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.menu.id === menuId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function handleRemove(menuId: string) {
    setItems((prev) => prev.filter((item) => item.menu.id !== menuId));
  }

  function handleSubmit() {
    createOrder.mutate(
      {
        outletId,
        data: {
          table_id: tableId,
          customer_name: customerName || undefined,
          items: items.map((item) => ({
            menu_id: item.menu.id,
            quantity: item.quantity,
          })),
        },
      },
      {
        onSuccess: (data) => {
          toast.success("Order sent successfully");
          router.push(`/dashboard/orders/${data.order.id}?outlet=${outletId}`);
        },
      },
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4 h-[calc(100vh-180px)]">
      <div className="overflow-y-auto pr-2">
        <MenuGrid menus={menus} onSelect={handleSelectMenu} />
      </div>
      <OrderCart
        tableNumber={tableNumber}
        items={items}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
        onSubmit={handleSubmit}
        isSubmitting={createOrder.isPending}
        error={createOrder.isError ? createOrder.error.message : null}
      />
    </div>
  );
}
