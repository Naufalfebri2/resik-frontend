"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateShift } from "@/hooks/use-create-shift";
import { toast } from "sonner";
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
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateShiftDialog({ sectionId }: { sectionId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeError, setTimeError] = useState("");

  const createShift = useCreateShift();

  function resetForm() {
    setShiftName("");
    setStartTime("");
    setEndTime("");
    setTimeError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (startTime === endTime) {
      setTimeError("Start time and end time cannot be the same.");
      return;
    }
    setTimeError("");

    createShift.mutate(
      {
        sectionId,
        shift_name: shiftName,
        start_time: startTime,
        end_time: endTime,
      },
      {
        onSuccess: () => {
          setOpen(false);
          resetForm();
          router.refresh();
          toast.success("Shift added successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Shift</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Shift</DialogTitle>
            <DialogDescription>
              Add a new shift to this section.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="shift_name">Shift Name</Label>
              <Input
                id="shift_name"
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
                placeholder="e.g. Morning Shift"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
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

            {createShift.isError && (
              <p className="text-sm text-destructive">
                {createShift.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createShift.isPending}>
              {createShift.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
