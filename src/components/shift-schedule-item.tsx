"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeleteShiftSchedule } from "@/hooks/use-delete-shift-schedule";
import type { ShiftSchedule, ShiftScheduleSwapStatus } from "@/types/hr";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const SWAP_STATUS_LABELS: Record<ShiftScheduleSwapStatus, string> = {
  none: "Scheduled",
  pending: "Swap Pending",
  swapped: "Swapped",
};

export function ShiftScheduleItem({
  employeeId,
  schedule,
}: {
  employeeId: string;
  schedule: ShiftSchedule;
}) {
  const deleteShiftSchedule = useDeleteShiftSchedule();

  function handleDelete() {
    deleteShiftSchedule.mutate(
      { employeeId, scheduleId: schedule.id },
      {
        onSuccess: () => {
          toast.success("Shift schedule deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <li className="flex items-center justify-between rounded-md border p-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">{formatDate(schedule.date)}</p>
        <p className="text-sm text-muted-foreground">
          {schedule.shift?.shift_name ?? "Unknown shift"}
          {schedule.shift && (
            <>
              {" "}
              ({schedule.shift.start_time} - {schedule.shift.end_time})
            </>
          )}
        </p>
        <Badge variant="secondary">
          {SWAP_STATUS_LABELS[schedule.swap_status] ?? "Scheduled"}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive"
        onClick={handleDelete}
        disabled={deleteShiftSchedule.isPending}
      >
        {deleteShiftSchedule.isPending ? "Deleting..." : "Delete"}
      </Button>
    </li>
  );
}
