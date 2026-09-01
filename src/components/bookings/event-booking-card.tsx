"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Phone,
  Users,
  Clock,
  StickyNote,
  Table2,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdvanceBooking } from "@/hooks/use-advance-booking";
import { useCancelBooking } from "@/hooks/use-cancel-booking";
import { useMarkNoShow } from "@/hooks/use-mark-no-show";
import {
  getAdvanceLabel,
  canCancelOrNoShow,
  canEditBooking,
  canDeleteBooking,
  STATUS_LABEL,
  STATUS_BADGE_CLASSNAME,
} from "@/lib/booking-status";
import { formatBookingTimeRange } from "@/lib/booking-format";
import { EditEventBookingDialog } from "@/components/bookings/edit-event-booking-dialog";
import { DeleteBookingDialog } from "@/components/bookings/delete-booking-dialog";
import type { TableBooking } from "@/types/booking";

export function EventBookingCard({
  booking,
  outletId,
}: {
  booking: TableBooking;
  outletId: string;
}) {
  const router = useRouter();
  const advanceBooking = useAdvanceBooking();
  const cancelBooking = useCancelBooking();
  const markNoShow = useMarkNoShow();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const advanceLabel = getAdvanceLabel(booking.status, true);
  const canCancel = canCancelOrNoShow(booking.status);
  const canEdit = canEditBooking(booking.status);
  const canDelete = canDeleteBooking(booking.status);
  const isBusy =
    advanceBooking.isPending || cancelBooking.isPending || markNoShow.isPending;

  const tableNumbers =
    booking.table_assignments
      ?.map((assignment) => assignment.table?.table_number)
      .filter((value): value is string => Boolean(value)) ?? [];

  function handleAdvance() {
    advanceBooking.mutate(
      { outletId, bookingId: booking.id },
      {
        onSuccess: () => {
          toast.success("Booking status updated");
          router.refresh();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  function handleCancel() {
    cancelBooking.mutate(
      { outletId, bookingId: booking.id },
      {
        onSuccess: () => {
          toast.success("Booking cancelled");
          router.refresh();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  function handleNoShow() {
    markNoShow.mutate(
      { outletId, bookingId: booking.id },
      {
        onSuccess: () => {
          toast.success("Booking marked as no-show");
          router.refresh();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <>
      <Card className="border-primary/30">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{booking.customer_name}</p>
                <Badge variant="outline" className="text-xs">
                  Event
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Table2 className="size-3.5" />
                {tableNumbers.length > 0 ? tableNumbers.join(", ") : "-"}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge className={STATUS_BADGE_CLASSNAME[booking.status]}>
                {STATUS_LABEL[booking.status]}
              </Badge>
              {canEdit && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="size-3.5" />
                </Button>
              )}
              {canDelete && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-destructive hover:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5" />
              {formatBookingTimeRange(
                booking.booking_datetime,
                booking.duration_minutes,
              )}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-3.5" />
              {booking.phone}
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-3.5" />
              {booking.guest_count} guests
            </div>
            {booking.notes && (
              <div className="flex items-center gap-2">
                <StickyNote className="size-3.5" />
                {booking.notes}
              </div>
            )}
          </div>

          {(advanceLabel || canCancel) && (
            <div className="flex gap-2 pt-1">
              {advanceLabel && (
                <Button size="sm" disabled={isBusy} onClick={handleAdvance}>
                  {advanceLabel}
                </Button>
              )}
              {canCancel && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBusy}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBusy}
                    onClick={handleNoShow}
                  >
                    No-Show
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {canEdit && (
        <EditEventBookingDialog
          booking={booking}
          outletId={outletId}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}

      <DeleteBookingDialog
        bookingId={booking.id}
        customerName={booking.customer_name}
        outletId={outletId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
