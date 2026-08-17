"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useShifts } from "@/hooks/use-shifts";
import { useCreateShiftSchedule } from "@/hooks/use-create-shift-schedule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateShiftScheduleForm({
  employeeId,
  sectionId,
}: {
  employeeId: string;
  sectionId: string;
}) {
  const { data: shifts, isLoading: shiftsLoading } = useShifts(sectionId, true);
  const [shiftId, setShiftId] = useState("");
  const [date, setDate] = useState("");

  const createShiftSchedule = useCreateShiftSchedule();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!shiftId) return;

    createShiftSchedule.mutate(
      { employeeId, shift_id: shiftId, date },
      {
        onSuccess: () => {
          setShiftId("");
          setDate("");
          toast.success("Shift schedule added successfully");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
      <p className="text-sm font-medium">Add Schedule</p>

      <div className="space-y-2">
        <Label htmlFor="schedule_shift">Shift</Label>
        <Select value={shiftId} onValueChange={setShiftId}>
          <SelectTrigger id="schedule_shift">
            <SelectValue
              placeholder={shiftsLoading ? "Loading shifts..." : "Select shift"}
            />
          </SelectTrigger>
          <SelectContent>
            {shifts?.map((shift) => (
              <SelectItem key={shift.id} value={shift.id}>
                {shift.shift_name} ({shift.start_time} - {shift.end_time})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule_date">Date</Label>
        <Input
          id="schedule_date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {createShiftSchedule.isError && (
        <p className="text-sm text-destructive">
          {createShiftSchedule.error.message}
        </p>
      )}

      <Button
        type="submit"
        size="sm"
        disabled={createShiftSchedule.isPending || !shiftId}
      >
        {createShiftSchedule.isPending ? "Adding..." : "Add Schedule"}
      </Button>
    </form>
  );
}
