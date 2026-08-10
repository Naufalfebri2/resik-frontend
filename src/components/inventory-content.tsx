import { getSections } from "@/lib/sections";
import { getIngredients, getLowStockIngredients } from "@/lib/ingredients";
import { SectionTabs } from "@/components/section-tabs";
import { IngredientTable } from "@/components/ingredient-table";
import { CreateIngredientDialog } from "@/components/create-ingredient-dialog";

export async function InventoryContent({
  outletId,
  selectedSectionId,
}: {
  outletId: string;
  selectedSectionId: string | undefined;
}) {
  const sections = await getSections(outletId);
  const activeSectionId = selectedSectionId ?? sections[0]?.id;

  const [ingredients, lowStockIngredients] = await Promise.all([
    activeSectionId ? getIngredients(activeSectionId) : Promise.resolve([]),
    getLowStockIngredients(),
  ]);

  const lowStockIds = new Set(lowStockIngredients.map((i) => i.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTabs
          sections={sections}
          outletId={outletId}
          selectedSectionId={activeSectionId}
        />
        {activeSectionId && (
          <CreateIngredientDialog sectionId={activeSectionId} />
        )}
      </div>
      <IngredientTable ingredients={ingredients} lowStockIds={lowStockIds} />
    </div>
  );
}
