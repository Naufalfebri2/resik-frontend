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
import { EditSupplierDialog } from "@/components/edit-supplier-dialog";
import { DeleteSupplierAlert } from "@/components/delete-supplier-alert";
import type { Supplier } from "@/types/inventory";

export function SupplierRowActions({ supplier }: { supplier: Supplier }) {
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

      <EditSupplierDialog
        supplier={supplier}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteSupplierAlert
        supplier={supplier}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
