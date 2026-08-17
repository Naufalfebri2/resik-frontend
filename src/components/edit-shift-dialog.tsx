"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateShift } from "@/hooks/use-update-shift";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Shift } from "@/types/hr";

export function EditShiftDialog({
  shift,
  open,
  onOpenChange,
}: {
  shift: Shift;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [shiftName, setShiftName] = useState(shift.shift_name);
  const [startTime, setStartTime] = useState(shift.start_time.slice(0, 5));
  const [endTime, setEndTime] = useState(shift.end_time.slice(0, 5));
  const [timeError, setTimeError] = useState("");

  const updateShift = useUpdateShift();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (startTime === endTime) {
      setTimeError("Start time and end time cannot be the same.");
      return;
    }
    setTimeError("");

    updateShift.mutate(
      {
        sectionId: shift.section_id,
        shiftId: shift.id,
        shift_name: shiftName,
        start_time: startTime,
        end_time: endTime,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success("Shift updated successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
            <DialogDescription>Update shift details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_shift_name">Shift Name</Label>
              <Input
                id="edit_shift_name"
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_start_time">Start Time</Label>
              <Input
                id="edit_start_time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_end_time">End Time</Label>
              <Input
                id="edit_end_time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                If end time is earlier than start time, the shift is treated as
                an overnight shift.
              </p>
            </div>

            {timeError && (
              <p className="text-sm text-destructive">{timeError}</p>
            )}

            {updateShift.isError && (
              <p className="text-sm text-destructive">
                {updateShift.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={updateShift.isPending}>
              {updateShift.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
