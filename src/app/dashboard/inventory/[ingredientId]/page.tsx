import { notFound } from "next/navigation";
import { getIngredient } from "@/lib/ingredients";
import { getStockAdjustments } from "@/lib/stock-adjustments";
import { ApiError } from "@/lib/api-client";
import { IngredientDetailHeader } from "@/components/ingredient-detail-header";
import { CreateDailyStockDialog } from "@/components/create-daily-stock-dialog";
import { DailyStockTable } from "@/components/daily-stock-table";
import { CreateStockAdjustmentDialog } from "@/components/create-stock-adjustment-dialog";
import { StockAdjustmentTable } from "@/components/stock-adjustment-table";

interface IngredientDetailPageProps {
  params: Promise<{ ingredientId: string }>;
}

export default async function IngredientDetailPage({
  params,
}: IngredientDetailPageProps) {
  const { ingredientId } = await params;

  let ingredient;
  try {
    ingredient = await getIngredient(ingredientId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const stockAdjustments = await getStockAdjustments(ingredientId);

  const previousClosingStock =
    ingredient.daily_stocks.find((ds) => ds.actual_closing_stock !== null)
      ?.actual_closing_stock ?? null;

  return (
    <div className="space-y-6">
      <IngredientDetailHeader ingredient={ingredient} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Daily Stock History</h2>
        <CreateDailyStockDialog
          ingredientId={ingredient.id}
          unit={ingredient.unit}
          recordingMode={ingredient.section.outlet.recording_mode}
          previousClosingStock={previousClosingStock}
        />
      </div>

      <DailyStockTable
        ingredientId={ingredient.id}
        unit={ingredient.unit}
        dailyStocks={ingredient.daily_stocks}
      />

      <div className="flex items-center justify-between pt-4">
        <h2 className="text-lg font-medium">Stock Adjustments</h2>
        <CreateStockAdjustmentDialog
          ingredientId={ingredient.id}
          unit={ingredient.unit}
          dailyStocks={ingredient.daily_stocks}
        />
      </div>

      <StockAdjustmentTable
        ingredientId={ingredient.id}
        unit={ingredient.unit}
        adjustments={stockAdjustments}
      />
    </div>
  );
}
