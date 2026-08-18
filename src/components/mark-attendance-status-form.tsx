"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMarkAttendanceStatus } from "@/hooks/use-mark-attendance-status";
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
import type { MarkAttendanceStatusPayload } from "@/types/hr";

const STATUS_OPTIONS: {
  value: MarkAttendanceStatusPayload["status"];
  label: string;
}[] = [
  { value: "sick_with_letter", label: "Sick (with letter)" },
  { value: "sick_without_letter", label: "Sick (no letter)" },
  { value: "leave", label: "Leave" },
  { value: "time_off", label: "Time Off" },
  { value: "absent", label: "Absent" },
];

export function MarkAttendanceStatusForm({
  employeeId,
}: {
  employeeId: string;
}) {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<
    MarkAttendanceStatusPayload["status"] | ""
  >("");

  const markAttendanceStatus = useMarkAttendanceStatus();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!status) return;

    markAttendanceStatus.mutate(
      { employeeId, date, status },
      {
        onSuccess: () => {
          setDate("");
          setStatus("");
          toast.success("Attendance status recorded successfully");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
      <p className="text-sm font-medium">Mark Attendance Status</p>
      <p className="text-xs text-muted-foreground">
        Use this for manual records such as sick leave, time off, or absence.
        Regular check-in/check-out is recorded via the mobile app.
      </p>

      <div className="space-y-2">
        <Label htmlFor="attendance_date">Date</Label>
        <Input
          id="attendance_date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendance_status">Status</Label>
        <Select
          value={status}
          onValueChange={(value) =>
            setStatus(value as MarkAttendanceStatusPayload["status"])
          }
        >
          <SelectTrigger id="attendance_status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {markAttendanceStatus.isError && (
        <p className="text-sm text-destructive">
          {markAttendanceStatus.error.message}
        </p>
      )}

      <Button
        type="submit"
        size="sm"
        disabled={markAttendanceStatus.isPending || !status}
      >
        {markAttendanceStatus.isPending ? "Saving..." : "Save Status"}
      </Button>
    </form>
  );
}
