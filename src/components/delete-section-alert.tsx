"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useDeleteSection } from "@/hooks/use-delete-section";
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
import type { Section } from "@/types/inventory";

export function DeleteSectionAlert({
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
  const searchParams = useSearchParams();
  const deleteSection = useDeleteSection();

  function handleDelete() {
    deleteSection.mutate(
      { outletId, sectionId: section.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          const params = new URLSearchParams(searchParams);
          params.delete("section");
          router.push(`?${params.toString()}`);
          toast.success(`"${section.name}" deleted successfully`);
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete &quot;{section.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Deleting a section may fail if it
            still has employees, shifts, or ingredients assigned to it.
          </AlertDialogDescription>
          {deleteSection.isError && (
            <p className="text-sm text-destructive">
              {deleteSection.error.message}
            </p>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSection.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSection.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteSection.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
