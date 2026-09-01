import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, STATUS_BADGE_CLASSNAME } from "@/lib/booking-status";
import { formatBookingTimeRange } from "@/lib/booking-format";
import type { TableBooking } from "@/types/booking";

export function BookingHistoryTable({
  bookings,
}: {
  bookings: TableBooking[];
}) {
  if (bookings.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No booking history found for the selected filters.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const tableLabel = booking.is_event
              ? (booking.table_assignments
                  ?.map((a) => a.table?.table_number)
                  .filter(Boolean)
                  .join(", ") ?? "-")
              : (booking.table?.table_number ?? "-");

            return (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.customer_name}
                </TableCell>
                <TableCell>{tableLabel}</TableCell>
                <TableCell>
                  {formatBookingTimeRange(
                    booking.booking_datetime,
                    booking.duration_minutes,
                  )}
                </TableCell>
                <TableCell>{booking.guest_count}</TableCell>
                <TableCell>
                  {booking.is_event ? (
                    <Badge variant="outline" className="text-xs">
                      Event
                    </Badge>
                  ) : (
                    "Regular"
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_BADGE_CLASSNAME[booking.status]}>
                    {STATUS_LABEL[booking.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
