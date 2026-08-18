import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SwapRequestRowActions } from "@/components/swap-request-row-actions";
import type { ShiftSwapRequest } from "@/types/hr";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function SwapRequestTable({
  swapRequests,
}: {
  swapRequests: ShiftSwapRequest[];
}) {
  if (swapRequests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No pending swap requests.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Requester</TableHead>
          <TableHead>Requester Schedule</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>Target Schedule</TableHead>
          <TableHead className="w-48" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {swapRequests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">
              {request.requester_schedule?.employee?.name ?? "—"}
            </TableCell>
            <TableCell>
              {request.requester_schedule
                ? `${formatDate(request.requester_schedule.date)} — ${
                    request.requester_schedule.shift?.shift_name ??
                    "Unknown shift"
                  }`
                : "—"}
            </TableCell>
            <TableCell className="font-medium">
              {request.target_schedule?.employee?.name ?? "—"}
            </TableCell>
            <TableCell>
              {request.target_schedule
                ? `${formatDate(request.target_schedule.date)} — ${
                    request.target_schedule.shift?.shift_name ?? "Unknown shift"
                  }`
                : "—"}
            </TableCell>
            <TableCell>
              <SwapRequestRowActions swapRequest={request} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
