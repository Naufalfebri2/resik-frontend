import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShiftRowActions } from "@/components/shift-row-actions";
import type { Shift } from "@/types/hr";

function formatDuration(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  let endTotalMinutes = endHour * 60 + endMinute;

  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }

  const durationMinutes = endTotalMinutes - startTotalMinutes;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (minutes === 0) return `${hours} hours`;
  return `${hours}h ${minutes}m`;
}

export function ShiftTable({ shifts }: { shifts: Shift[] }) {
  if (shifts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No shifts in this section yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shift Name</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {shifts.map((shift) => (
          <TableRow key={shift.id}>
            <TableCell className="font-medium">{shift.shift_name}</TableCell>
            <TableCell>{shift.start_time}</TableCell>
            <TableCell>{shift.end_time}</TableCell>
            <TableCell>
              {formatDuration(shift.start_time, shift.end_time)}
            </TableCell>
            <TableCell>
              <ShiftRowActions shift={shift} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
