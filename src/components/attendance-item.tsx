import { Badge } from "@/components/ui/badge";
import type { Attendance, AttendanceStatus } from "@/types/hr";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateTimeStr: string) {
  return new Date(dateTimeStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  on_time: "On Time",
  late: "Late",
  sick_with_letter: "Sick (with letter)",
  sick_without_letter: "Sick (no letter)",
  leave: "Leave",
  time_off: "Time Off",
  absent: "Absent",
};

const STATUS_VARIANTS: Record<
  AttendanceStatus,
  "secondary" | "destructive" | "outline"
> = {
  on_time: "secondary",
  late: "outline",
  sick_with_letter: "secondary",
  sick_without_letter: "outline",
  leave: "secondary",
  time_off: "outline",
  absent: "destructive",
};

export function AttendanceItem({ attendance }: { attendance: Attendance }) {
  return (
    <li className="space-y-1 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{formatDate(attendance.date)}</p>
        <Badge variant={STATUS_VARIANTS[attendance.status]}>
          {STATUS_LABELS[attendance.status]}
        </Badge>
      </div>

      {attendance.check_in_time && (
        <p className="text-sm text-muted-foreground">
          Check-in: {formatTime(attendance.check_in_time)}
          {attendance.late_minutes > 0 && ` (${attendance.late_minutes}m late)`}
        </p>
      )}

      {attendance.check_out_time && (
        <p className="text-sm text-muted-foreground">
          Check-out: {formatTime(attendance.check_out_time)}
        </p>
      )}

      {!attendance.check_in_time && !attendance.check_out_time && (
        <p className="text-sm text-muted-foreground">
          No check-in/check-out recorded.
        </p>
      )}
    </li>
  );
}
