"use client";

import { useAttendance } from "@/hooks/use-attendance";
import { MarkAttendanceStatusForm } from "@/components/mark-attendance-status-form";
import { AttendanceItem } from "@/components/attendance-item";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Employee } from "@/types/hr";

export function AttendanceSheet({
  employee,
  open,
  onOpenChange,
}: {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: attendance, isLoading } = useAttendance(employee.id, open);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{employee.name}&apos;s Attendance</SheetTitle>
          <SheetDescription>
            View attendance history and record manual status.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-4">
          <MarkAttendanceStatusForm employeeId={employee.id} />

          <div>
            <p className="mb-2 text-sm font-medium">Attendance History</p>

            {isLoading && (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}

            {!isLoading && attendance && attendance.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No attendance records yet.
              </p>
            )}

            {!isLoading && attendance && attendance.length > 0 && (
              <ul className="space-y-2">
                {attendance.map((record) => (
                  <AttendanceItem key={record.id} attendance={record} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
