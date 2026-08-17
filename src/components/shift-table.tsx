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
              <ShiftRowActions shift={shift} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
