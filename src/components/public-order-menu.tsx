"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import type {
  PublicMenuResponse,
  PublicOrderCartItem,
  SubmitPublicOrderResponse,
} from "@/types/public-order";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

async function submitOrder(payload: {
  qrCode: string;
  customerName?: string;
  items: PublicOrderCartItem[];
}): Promise<SubmitPublicOrderResponse> {
  const response = await fetch(`/api/public/tables/${payload.qrCode}/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_name: payload.customerName,
      items: payload.items,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit order");
  }

  return data;
}

export function PublicOrderMenu({
  qrCode,
  initialData,
}: {
  qrCode: string;
  initialData: PublicMenuResponse;
}) {
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const submitMutation = useMutation({
    mutationFn: submitOrder,
  });

  function addToCart(menuId: string) {
    setCart((prev) => ({ ...prev, [menuId]: (prev[menuId] ?? 0) + 1 }));
  }

  function removeFromCart(menuId: string) {
    setCart((prev) => {
      const nextQty = (prev[menuId] ?? 0) - 1;
      const next = { ...prev };
      if (nextQty <= 0) {
        delete next[menuId];
      } else {
        next[menuId] = nextQty;
      }
      return next;
    });
  }

  const cartItems = Object.entries(cart);
  const cartCount = cartItems.reduce((sum, [, qty]) => sum + qty, 0);
  const cartTotal = cartItems.reduce((sum, [menuId, qty]) => {
    const menu = initialData.menus.find((m) => m.id === menuId);
    return sum + (menu ? Number(menu.price) * qty : 0);
  }, 0);

  function handleSubmit() {
    const items: PublicOrderCartItem[] = cartItems.map(
      ([menu_id, quantity]) => ({
        menu_id,
        quantity,
      }),
    );

    submitMutation.mutate(
      { qrCode, customerName: customerName || undefined, items },
      {
        onSuccess: (data) => {
          toast.success("Order submitted successfully");
          router.push(`/order/status/${data.order_id}?qrCode=${qrCode}`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-md pb-24">
      <div className="border-b p-4">
        <h1 className="text-lg font-semibold">{initialData.outlet.name}</h1>
        <p className="text-sm text-muted-foreground">
          Table {initialData.table.table_number}
        </p>
      </div>

      <div className="divide-y">
        {initialData.menus.map((menu) => {
          const qty = cart[menu.id] ?? 0;

          return (
            <div
              key={menu.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="font-medium">{menu.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(Number(menu.price))}
                </p>
              </div>

              {qty === 0 ? (
                <Button size="sm" onClick={() => addToCart(menu.id)}>
                  Add
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => removeFromCart(menu.id)}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="w-4 text-center text-sm">{qty}</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => addToCart(menu.id)}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t bg-background p-4">
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="size-4" />
                  {cartCount} item{cartCount > 1 ? "s" : ""}
                </span>
                <span>{formatCurrency(cartTotal)}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Your Order</SheetTitle>
              </SheetHeader>

              <div className="space-y-3 px-4">
                {cartItems.map(([menuId, qty]) => {
                  const menu = initialData.menus.find((m) => m.id === menuId);
                  if (!menu) return null;

                  return (
                    <div key={menuId} className="flex justify-between text-sm">
                      <span>
                        {menu.name} x{qty}
                      </span>
                      <span>{formatCurrency(Number(menu.price) * qty)}</span>
                    </div>
                  );
                })}

                <div className="flex justify-between border-t pt-3 font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="customer_name">Your Name</Label>
                  <Input
                    id="customer_name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Bryan"
                  />
                </div>

                {submitMutation.isError && (
                  <p className="text-sm text-destructive">
                    {submitMutation.error.message}
                  </p>
                )}
              </div>

              <SheetFooter>
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Submitting..." : "Place Order"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
}
