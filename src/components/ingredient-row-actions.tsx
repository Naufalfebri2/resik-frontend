"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditIngredientDialog } from "@/components/edit-ingredient-dialog";
import { DeleteIngredientAlert } from "@/components/delete-ingredient-alert";
import type { Ingredient } from "@/types/inventory";

export function IngredientRowActions({
  ingredient,
}: {
  ingredient: Ingredient;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditIngredientDialog
        ingredient={ingredient}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteIngredientAlert
        ingredient={ingredient}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
