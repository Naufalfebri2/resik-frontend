"use client";

import { useAttendance } from "@/hooks/use-attendance";
import { MarkAttendanceStatusForm } from "@/components/mark-attendance-status-form";
import { AttendanceItem } from "@/components/attendance-item";
import type { Employee } from "@/types/hr";

export function EmployeeAttendancePanel({ employee }: { employee: Employee }) {
  const { data: attendance, isLoading } = useAttendance(employee.id, true);

  return (
    <div className="grid gap-6 md:grid-cols-2">
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
  );
}
