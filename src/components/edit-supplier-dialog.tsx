"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateSupplier } from "@/hooks/use-update-supplier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Supplier } from "@/types/inventory";

export function EditSupplierDialog({
  supplier,
  open,
  onOpenChange,
}: {
  supplier: Supplier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(supplier.name);
  const [contact, setContact] = useState(supplier.contact);

  const updateSupplier = useUpdateSupplier();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateSupplier.mutate(
      { supplierId: supplier.id, name, contact },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success("Supplier updated successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update supplier details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Name</Label>
              <Input
                id="edit_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_contact">Contact</Label>
              <Input
                id="edit_contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>

            {updateSupplier.isError && (
              <p className="text-sm text-destructive">
                {updateSupplier.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={updateSupplier.isPending}>
              {updateSupplier.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
