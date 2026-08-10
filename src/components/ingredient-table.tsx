import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Ingredient } from "@/types/inventory";

const RISK_LABELS: Record<string, string> = {
  perishable: "Perishable",
  dry_goods: "Dry Goods",
};

export function IngredientTable({
  ingredients,
  lowStockIds,
}: {
  ingredients: Ingredient[];
  lowStockIds: Set<string>;
}) {
  if (ingredients.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No ingredients in this section yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Risk Category</TableHead>
          <TableHead>Alert Threshold</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ingredients.map((ingredient) => {
          const isLowStock = lowStockIds.has(ingredient.id);

          return (
            <TableRow key={ingredient.id}>
              <TableCell className="font-medium">{ingredient.name}</TableCell>
              <TableCell>{ingredient.unit}</TableCell>
              <TableCell>
                {RISK_LABELS[ingredient.risk_category] ??
                  ingredient.risk_category}
              </TableCell>
              <TableCell>{ingredient.alert_threshold}</TableCell>
              <TableCell>
                {isLowStock ? (
                  <Badge variant="destructive">Low Stock</Badge>
                ) : (
                  <Badge variant="secondary">OK</Badge>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
