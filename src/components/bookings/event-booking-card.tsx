"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Phone, Users, Clock, StickyNote, Table2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdvanceBooking } from "@/hooks/use-advance-booking";
import { useCancelBooking } from "@/hooks/use-cancel-booking";
import { useMarkNoShow } from "@/hooks/use-mark-no-show";
import {
  getAdvanceLabel,
  canCancelOrNoShow,
  STATUS_LABEL,
  STATUS_BADGE_CLASSNAME,
} from "@/lib/booking-status";
import type { TableBooking } from "@/types/booking";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

  const advanceLabel = getAdvanceLabel(booking.status, true);
  const canCancel = canCancelOrNoShow(booking.status);
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
          <Badge className={STATUS_BADGE_CLASSNAME[booking.status]}>
            {STATUS_LABEL[booking.status]}
          </Badge>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="size-3.5" />
            {formatDateTime(booking.booking_datetime)} (
            {booking.duration_minutes} min)
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
  );
}
