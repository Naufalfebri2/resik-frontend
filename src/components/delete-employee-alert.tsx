"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteEmployee } from "@/hooks/use-delete-employee";
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
import type { Employee } from "@/types/hr";

export function DeleteEmployeeAlert({
  employee,
  open,
  onOpenChange,
}: {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const deleteEmployee = useDeleteEmployee();

  function handleDelete() {
    deleteEmployee.mutate(
      { sectionId: employee.section_id, employeeId: employee.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success(`"${employee.name}" deleted successfully`);
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete &quot;{employee.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            employee record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteEmployee.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteEmployee.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteEmployee.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
