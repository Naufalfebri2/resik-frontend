"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateIngredient } from "@/hooks/use-create-ingredient";
import { toast } from "sonner";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RiskCategory } from "@/types/inventory";

export function CreateIngredientDialog({ sectionId }: { sectionId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [riskCategory, setRiskCategory] = useState<RiskCategory | "">("");
  const [alertThreshold, setAlertThreshold] = useState("");

  const createIngredient = useCreateIngredient();

  function resetForm() {
    setName("");
    setUnit("");
    setRiskCategory("");
    setAlertThreshold("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!riskCategory) return;

    createIngredient.mutate(
      {
        sectionId,
        name,
        unit,
        risk_category: riskCategory,
        alert_threshold: alertThreshold ? Number(alertThreshold) : 0,
      },
      {
        onSuccess: () => {
          setOpen(false);
          resetForm();
          router.refresh();
          toast.success("Ingredient added successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Ingredient</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Ingredient</DialogTitle>
            <DialogDescription>
              Add a new ingredient to this section.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chicken Fillet"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. kg, liter, pcs"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk_category">Risk Category</Label>
              <Select
                value={riskCategory}
                onValueChange={(value) =>
                  setRiskCategory(value as RiskCategory)
                }
              >
                <SelectTrigger id="risk_category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perishable">Perishable</SelectItem>
                  <SelectItem value="dry_goods">Dry Goods</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alert_threshold">
                Alert Threshold{" "}
                <span className="font-normal text-muted-foreground">
                  (optional, defaults to 0)
                </span>
              </Label>
              <Input
                id="alert_threshold"
                type="number"
                step="1"
                min="0"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                placeholder="Leave empty for no alert"
              />
            </div>

            {createIngredient.isError && (
              <p className="text-sm text-destructive">
                {createIngredient.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={createIngredient.isPending || !riskCategory}
            >
              {createIngredient.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
