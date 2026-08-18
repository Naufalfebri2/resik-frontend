"use client";

import { useShiftSchedules } from "@/hooks/use-shift-schedules";
import { CreateShiftScheduleForm } from "@/components/create-shift-schedule-form";
import { ShiftScheduleItem } from "@/components/shift-schedule-item";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Employee } from "@/types/hr";

export function ShiftScheduleSheet({
  employee,
  open,
  onOpenChange,
}: {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: schedules, isLoading } = useShiftSchedules(employee.id, open);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{employee.name}&apos;s Schedule</SheetTitle>
          <SheetDescription>
            Manage shift schedule assignments for this employee.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-4">
          <CreateShiftScheduleForm
            employeeId={employee.id}
            sectionId={employee.section_id}
          />

          <div>
            <p className="mb-2 text-sm font-medium">Scheduled Shifts</p>

            {isLoading && (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}

            {!isLoading && schedules && schedules.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No shift schedules yet.
              </p>
            )}

            {!isLoading && schedules && schedules.length > 0 && (
              <ul className="space-y-2">
                {schedules.map((schedule) => (
                  <ShiftScheduleItem
                    key={schedule.id}
                    employeeId={employee.id}
                    sectionId={employee.section_id}
                    schedule={schedule}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
