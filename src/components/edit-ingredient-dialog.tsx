"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateIngredient } from "@/hooks/use-update-ingredient";
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
import type { Ingredient, RiskCategory } from "@/types/inventory";

export function EditIngredientDialog({
  ingredient,
  open,
  onOpenChange,
}: {
  ingredient: Ingredient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(ingredient.name);
  const [unit, setUnit] = useState(ingredient.unit);
  const [riskCategory, setRiskCategory] = useState<RiskCategory>(
    ingredient.risk_category,
  );
  const [alertThreshold, setAlertThreshold] = useState(
    ingredient.alert_threshold,
  );

  const updateIngredient = useUpdateIngredient();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateIngredient.mutate(
      {
        sectionId: ingredient.section_id,
        ingredientId: ingredient.id,
        name,
        unit,
        risk_category: riskCategory,
        alert_threshold: alertThreshold === "" ? 0 : Number(alertThreshold),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success("Ingredient updated successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Ingredient</DialogTitle>
            <DialogDescription>Update ingredient details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Name</Label>
              <Input
                id="edit_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_unit">Unit</Label>
              <Input
                id="edit_unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_risk_category">Risk Category</Label>
              <Select
                value={riskCategory}
                onValueChange={(value) =>
                  setRiskCategory(value as RiskCategory)
                }
              >
                <SelectTrigger id="edit_risk_category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perishable">Perishable</SelectItem>
                  <SelectItem value="dry_goods">Dry Goods</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_alert_threshold">
                Alert Threshold{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="edit_alert_threshold"
                type="number"
                step="0.01"
                min="0"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
              />
            </div>

            {updateIngredient.isError && (
              <p className="text-sm text-destructive">
                {updateIngredient.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={updateIngredient.isPending}>
              {updateIngredient.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
