"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditSectionDialog } from "@/components/edit-section-dialog";
import { DeleteSectionAlert } from "@/components/delete-section-alert";
import type { Section } from "@/types/inventory";

export function SectionActions({
  section,
  outletId,
}: {
  section: Section | undefined;
  outletId: string;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!section) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => setEditOpen(true)}
      >
        <Pencil className="size-4" />
        <span className="sr-only">Edit section</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-destructive hover:text-destructive"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="size-4" />
        <span className="sr-only">Delete section</span>
      </Button>

      <EditSectionDialog
        section={section}
        outletId={outletId}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteSectionAlert
        section={section}
        outletId={outletId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
