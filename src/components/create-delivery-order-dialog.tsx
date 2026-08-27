"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useCreateDeliveryOrder } from "@/hooks/use-create-delivery-order";
import type { Menu, SourcePlatform } from "@/types/orders";

const SOURCE_PLATFORM_LABELS: Record<SourcePlatform, string> = {
  grab: "GrabFood",
  gojek: "GoFood",
  shopeefood: "ShopeeFood",
  direct_call: "Direct Call",
  other: "Other",
};

function formatCurrency(value: string | number) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numeric);
}

export function CreateDeliveryOrderDialog({
  outletId,
  menus,
}: {
  outletId: string;
  menus: Menu[];
}) {
  const router = useRouter();
  const createDeliveryOrder = useCreateDeliveryOrder();

  const [open, setOpen] = useState(false);
  const [sourcePlatform, setSourcePlatform] = useState<SourcePlatform | "">("");
  const [platformOrderId, setPlatformOrderId] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      setSourcePlatform("");
      setPlatformOrderId("");
      setCart({});
    }
    setOpen(newOpen);
  }

  function addToCart(menuId: string) {
    setCart((prev) => ({ ...prev, [menuId]: (prev[menuId] ?? 0) + 1 }));
  }

  function removeFromCart(menuId: string) {
    setCart((prev) => {
      const nextQty = (prev[menuId] ?? 0) - 1;
      const next = { ...prev };
      if (nextQty <= 0) delete next[menuId];
      else next[menuId] = nextQty;
      return next;
    });
  }

  const cartItems = Object.entries(cart);
  const cartTotal = cartItems.reduce((sum, [menuId, qty]) => {
    const menu = menus.find((m) => m.id === menuId);
    return sum + (menu ? Number(menu.price) * qty : 0);
  }, 0);

  function handleSubmit() {
    if (!sourcePlatform) return;

    createDeliveryOrder.mutate(
      {
        outletId,
        data: {
          source_platform: sourcePlatform,
          platform_order_id: platformOrderId || undefined,
          items: cartItems.map(([menu_id, quantity]) => ({
            menu_id,
            quantity,
          })),
        },
      },
      {
        onSuccess: () => {
          toast.success("Delivery order recorded successfully");
          setOpen(false);
          router.refresh();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  const canSubmit = sourcePlatform !== "" && cartItems.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" /> Record Delivery Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Delivery Order</DialogTitle>
          <DialogDescription>
            Manually enter an order received from a delivery platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Source Platform</Label>
            <Select
              value={sourcePlatform}
              onValueChange={(value) =>
                setSourcePlatform(value as SourcePlatform)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SOURCE_PLATFORM_LABELS).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform_order_id">
              Platform Order ID (optional)
            </Label>
            <Input
              id="platform_order_id"
              value={platformOrderId}
              onChange={(e) => setPlatformOrderId(e.target.value)}
              placeholder="e.g. GF-123456"
            />
          </div>

          <div className="space-y-2">
            <Label>Items</Label>
            <div className="divide-y rounded-md border">
              {menus.map((menu) => {
                const qty = cart[menu.id] ?? 0;

                return (
                  <div
                    key={menu.id}
                    className="flex items-center justify-between p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{menu.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(menu.price)}
                      </p>
                    </div>

                    {qty === 0 ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(menu.id)}
                      >
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
          </div>

          {cartItems.length > 0 && (
            <p className="text-right text-sm font-medium">
              Total: {formatCurrency(cartTotal)}
            </p>
          )}

          {createDeliveryOrder.isError && (
            <p className="text-sm text-destructive">
              {createDeliveryOrder.error.message}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || createDeliveryOrder.isPending}
          >
            {createDeliveryOrder.isPending ? "Saving..." : "Record Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
