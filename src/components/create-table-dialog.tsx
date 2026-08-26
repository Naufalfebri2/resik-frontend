"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { useCreateTable } from "@/hooks/use-create-table";

export function CreateTableDialog({ sectionId }: { sectionId: string }) {
  const router = useRouter();
  const createTable = useCreateTable();

  const [open, setOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) setTableNumber("");
    setOpen(newOpen);
  }

  function handleSubmit() {
    createTable.mutate(
      { sectionId, data: { table_number: tableNumber } },
      {
        onSuccess: () => {
          toast.success("Table created successfully");
          setOpen(false);
          router.refresh();
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" /> Add Table
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Table</DialogTitle>
          <DialogDescription>
            Create a new table for this section. A QR code will be generated
            automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="table_number">Table Number</Label>
          <Input
            id="table_number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="e.g. A1"
          />
        </div>

        {createTable.isError && (
          <p className="text-sm text-destructive">
            {createTable.error.message}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!tableNumber.trim() || createTable.isPending}
          >
            {createTable.isPending ? "Creating..." : "Create Table"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
