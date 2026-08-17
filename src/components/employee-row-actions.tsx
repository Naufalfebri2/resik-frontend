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
import { EditEmployeeDialog } from "@/components/edit-employee-dialog";
import { DeleteEmployeeAlert } from "@/components/delete-employee-alert";
import { ShiftScheduleSheet } from "@/components/shift-schedule-sheet";
import type { CustomFieldDefinition, Employee } from "@/types/hr";

export function EmployeeRowActions({
  employee,
  customFieldDefinitions,
}: {
  employee: Employee;
  customFieldDefinitions: CustomFieldDefinition[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

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
          <DropdownMenuItem onClick={() => setScheduleOpen(true)}>
            View Schedule
          </DropdownMenuItem>
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

      <EditEmployeeDialog
        employee={employee}
        customFieldDefinitions={customFieldDefinitions}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteEmployeeAlert
        employee={employee}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
      <ShiftScheduleSheet
        employee={employee}
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
      />
    </>
  );
}
