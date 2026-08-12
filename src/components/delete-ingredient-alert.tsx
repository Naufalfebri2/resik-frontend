"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteIngredient } from "@/hooks/use-delete-ingredient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Ingredient } from "@/types/inventory";

export function DeleteIngredientAlert({
  ingredient,
  open,
  onOpenChange,
}: {
  ingredient: Ingredient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const deleteIngredient = useDeleteIngredient();

  function handleDelete() {
    deleteIngredient.mutate(
      { sectionId: ingredient.section_id, ingredientId: ingredient.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success(`"${ingredient.name}" deleted successfully`);
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete &quot;{ingredient.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            ingredient and its stock history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteIngredient.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteIngredient.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteIngredient.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
