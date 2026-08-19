"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateSection } from "@/hooks/use-update-section";
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
import type { Section } from "@/types/inventory";

export function EditSectionDialog({
  section,
  outletId,
  open,
  onOpenChange,
}: {
  section: Section;
  outletId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(section.name);

  const updateSection = useUpdateSection();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateSection.mutate(
      { outletId, sectionId: section.id, name },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success("Section updated successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>Update the section name.</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-2">
            <Label htmlFor="edit_section_name">Name</Label>
            <Input
              id="edit_section_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {updateSection.isError && (
              <p className="text-sm text-destructive">
                {updateSection.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={updateSection.isPending}>
              {updateSection.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
