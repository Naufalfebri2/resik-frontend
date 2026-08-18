"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useEmployees } from "@/hooks/use-employees";
import { useShiftSchedules } from "@/hooks/use-shift-schedules";
import { useCreateShiftSwapRequest } from "@/hooks/use-create-shift-swap-request";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ShiftSchedule } from "@/types/hr";

function formatScheduleDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RequestSwapDialog({
  requesterSchedule,
  sectionId,
  currentEmployeeId,
  open,
  onOpenChange,
}: {
  requesterSchedule: ShiftSchedule;
  sectionId: string;
  currentEmployeeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [targetEmployeeId, setTargetEmployeeId] = useState("");
  const [targetScheduleId, setTargetScheduleId] = useState("");

  const { data: employees, isLoading: employeesLoading } = useEmployees(
    sectionId,
    open,
  );
  const { data: targetSchedules, isLoading: schedulesLoading } =
    useShiftSchedules(targetEmployeeId, open && !!targetEmployeeId);

  const createSwapRequest = useCreateShiftSwapRequest();

  const otherEmployees =
    employees?.filter((employee) => employee.id !== currentEmployeeId) ?? [];

  function handleEmployeeChange(employeeId: string) {
    setTargetEmployeeId(employeeId);
    setTargetScheduleId("");
  }

  function resetForm() {
    setTargetEmployeeId("");
    setTargetScheduleId("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!targetScheduleId) return;

    createSwapRequest.mutate(
      {
        requester_schedule_id: requesterSchedule.id,
        target_schedule_id: targetScheduleId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
          toast.success("Swap request created successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request Shift Swap</DialogTitle>
            <DialogDescription>
              Choose an employee and one of their scheduled shifts to swap with.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="target_employee">Swap With</Label>
              <Select
                value={targetEmployeeId}
                onValueChange={handleEmployeeChange}
              >
                <SelectTrigger id="target_employee">
                  <SelectValue
                    placeholder={
                      employeesLoading
                        ? "Loading employees..."
                        : "Select employee"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {otherEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {targetEmployeeId && (
              <div className="space-y-2">
                <Label htmlFor="target_schedule">Their Schedule</Label>
                <Select
                  value={targetScheduleId}
                  onValueChange={setTargetScheduleId}
                >
                  <SelectTrigger id="target_schedule">
                    <SelectValue
                      placeholder={
                        schedulesLoading
                          ? "Loading schedules..."
                          : "Select schedule"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {targetSchedules
                      ?.filter((schedule) => schedule.swap_status === "normal")
                      .map((schedule) => (
                        <SelectItem key={schedule.id} value={schedule.id}>
                          {formatScheduleDate(schedule.date)} —{" "}
                          {schedule.shift?.shift_name ?? "Unknown shift"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {createSwapRequest.isError && (
              <p className="text-sm text-destructive">
                {createSwapRequest.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={createSwapRequest.isPending || !targetScheduleId}
            >
              {createSwapRequest.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
