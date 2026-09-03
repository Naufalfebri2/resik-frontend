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
import { EditCashAccountDialog } from "@/components/finance/edit-cash-account-dialog";
import { DeleteCashAccountAlert } from "@/components/finance/delete-cash-account-alert";
import type { CashAccount } from "@/types/inventory";

export function CashAccountRowActions({
  cashAccount,
  outletId,
}: {
  cashAccount: CashAccount;
  outletId: string;
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

      <EditCashAccountDialog
        cashAccount={cashAccount}
        outletId={outletId}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteCashAccountAlert
        cashAccount={cashAccount}
        outletId={outletId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
