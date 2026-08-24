"use client";

import { Card } from "@/components/ui/card";
import type { Menu } from "@/types/orders";

function formatCurrency(value: string | number) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numeric);
}

export function MenuGrid({
  menus,
  onSelect,
}: {
  menus: Menu[];
  onSelect: (menu: Menu) => void;
}) {
  const activeMenus = menus.filter((menu) => menu.is_active);

  if (activeMenus.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No active menu items available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {activeMenus.map((menu) => (
        <Card
          key={menu.id}
          onClick={() => onSelect(menu)}
          className="p-3 cursor-pointer hover:bg-accent transition-colors"
        >
          <p className="font-medium text-sm">{menu.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(menu.price)}
          </p>
        </Card>
      ))}
    </div>
  );
}
