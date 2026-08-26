"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateTable } from "@/hooks/use-update-table";
import type { Table } from "@/types/orders";

export function EditTableDialog({
  sectionId,
  table,
}: {
  sectionId: string;
  table: Table;
}) {
  const router = useRouter();
  const updateTable = useUpdateTable();

  const [open, setOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState(table.table_number);

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) setTableNumber(table.table_number);
    setOpen(newOpen);
  }

  function handleSubmit() {
    updateTable.mutate(
      { sectionId, tableId: table.id, data: { table_number: tableNumber } },
      {
        onSuccess: () => {
          toast.success("Table updated successfully");
          setOpen(false);
          router.refresh();
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <Pencil className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Table</DialogTitle>
          <DialogDescription>
            Update the table number. The QR code stays the same.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="edit_table_number">Table Number</Label>
          <Input
            id="edit_table_number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          />
        </div>

        {updateTable.isError && (
          <p className="text-sm text-destructive">
            {updateTable.error.message}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!tableNumber.trim() || updateTable.isPending}
          >
            {updateTable.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
