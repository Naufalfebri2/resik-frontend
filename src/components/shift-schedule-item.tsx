"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeleteShiftSchedule } from "@/hooks/use-delete-shift-schedule";
import { RequestSwapDialog } from "@/components/request-swap-dialog";
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
  normal: "Scheduled",
  swap_pending: "Swap Pending",
  swap_approved: "Swapped",
};

export function ShiftScheduleItem({
  employeeId,
  sectionId,
  schedule,
}: {
  employeeId: string;
  sectionId: string;
  schedule: ShiftSchedule;
}) {
  const [swapOpen, setSwapOpen] = useState(false);
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

  const canRequestSwap = schedule.swap_status === "normal";

  return (
    <>
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
        <div className="flex flex-col items-end gap-1">
          {canRequestSwap && (
            <Button variant="ghost" size="sm" onClick={() => setSwapOpen(true)}>
              Request Swap
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={deleteShiftSchedule.isPending}
          >
            {deleteShiftSchedule.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </li>

      <RequestSwapDialog
        requesterSchedule={schedule}
        sectionId={sectionId}
        currentEmployeeId={employeeId}
        open={swapOpen}
        onOpenChange={setSwapOpen}
      />
    </>
  );
}
