import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { IngredientDetail } from "@/types/inventory";

const riskCategoryLabel: Record<string, string> = {
  perishable: "Perishable",
  dry_goods: "Dry Goods",
};

export function IngredientDetailHeader({
  ingredient,
}: {
  ingredient: IngredientDetail;
}) {
  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/inventory"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Inventory
      </Link>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {ingredient.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {ingredient.section.outlet.name} · {ingredient.section.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">{ingredient.unit}</Badge>
          <Badge variant="secondary">
            {riskCategoryLabel[ingredient.risk_category] ??
              ingredient.risk_category}
          </Badge>
          <Badge variant="outline">
            {ingredient.section.outlet.recording_mode === "detail"
              ? "Detail Mode"
              : "Simple Mode"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
