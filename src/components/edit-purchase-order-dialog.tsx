"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { useUpdatePurchaseOrder } from "@/hooks/use-update-purchase-order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatQuantity } from "@/lib/utils";
import type { Ingredient, PurchaseOrder, Supplier } from "@/types/inventory";

interface ItemRow {
  ingredientId: string;
  quantity: string;
  unitPrice: string;
}

export function EditPurchaseOrderDialog({
  outletId,
  purchaseOrder,
  suppliers,
  ingredients,
  open,
  onOpenChange,
}: {
  outletId: string;
  purchaseOrder: PurchaseOrder;
  suppliers: Supplier[];
  ingredients: Ingredient[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [supplierId, setSupplierId] = useState(purchaseOrder.supplier_id);
  const [date, setDate] = useState(purchaseOrder.date.slice(0, 10));
  const [items, setItems] = useState<ItemRow[]>(
    purchaseOrder.items.map((item) => ({
      ingredientId: item.ingredient_id,
      quantity: formatQuantity(item.quantity),
      unitPrice: formatQuantity(item.unit_price),
    })),
  );

  const updatePurchaseOrder = useUpdatePurchaseOrder();

  function updateItem(index: number, field: keyof ItemRow, value: string) {
    setItems((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function addItemRow() {
    setItems((prev) => [
      ...prev,
      { ingredientId: "", quantity: "", unitPrice: "" },
    ]);
  }

  function removeItemRow(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!supplierId) return;

    updatePurchaseOrder.mutate(
      {
        outletId,
        purchaseOrderId: purchaseOrder.id,
        supplier_id: supplierId,
        date,
        items: items.map((row) => ({
          ingredient_id: row.ingredientId,
          quantity: Number(row.quantity),
          unit_price: Number(row.unitPrice),
        })),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success("Purchase order updated successfully");
        },
      },
    );
  }

  const canSubmit =
    supplierId &&
    date &&
    items.length > 0 &&
    items.every((row) => row.ingredientId && row.quantity && row.unitPrice);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Purchase Order</DialogTitle>
            <DialogDescription>
              Update this purchase order&apos;s details.
              {purchaseOrder.status === "received" && (
                <span className="mt-1 block text-amber-600">
                  This order has been received. Editing items will recalculate
                  stock and the recorded cash transaction.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_supplier">Supplier</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger id="edit_supplier">
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_date">Date</Label>
              <Input
                id="edit_date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItemRow}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Item
                </Button>
              </div>

              {items.map((row, index) => (
                <div key={index} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Item {index + 1}
                    </span>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItemRow(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <Select
                    value={row.ingredientId}
                    onValueChange={(value) =>
                      updateItem(index, "ingredientId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                      {ingredients.map((ingredient) => (
                        <SelectItem key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} ({ingredient.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        step="1"
                        min="0"
                        value={row.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Unit Price (Rp)</Label>
                      <Input
                        type="number"
                        step="1"
                        min="0"
                        value={row.unitPrice}
                        onChange={(e) =>
                          updateItem(index, "unitPrice", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {updatePurchaseOrder.isError && (
              <p className="text-sm text-destructive">
                {updatePurchaseOrder.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={updatePurchaseOrder.isPending || !canSubmit}
            >
              {updatePurchaseOrder.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
