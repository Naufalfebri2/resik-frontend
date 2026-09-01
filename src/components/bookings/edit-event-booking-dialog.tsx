"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateEventBooking } from "@/hooks/use-update-event-booking";
import { AvailabilityPicker } from "@/components/bookings/availability-picker";
import { combineDateAndTime } from "@/lib/booking-format";
import type { TableBooking } from "@/types/booking";

function toDateInputValue(isoString: string): string {
  const d = new Date(isoString);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function toTimeInputValue(isoString: string): string {
  const d = new Date(isoString);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(11, 16);
}

export function EditEventBookingDialog({
  booking,
  outletId,
  open,
  onOpenChange,
}: {
  booking: TableBooking;
  outletId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const updateEventBooking = useUpdateEventBooking();

  const [customerName, setCustomerName] = useState(booking.customer_name);
  const [phone, setPhone] = useState(booking.phone);
  const [guestCount, setGuestCount] = useState(String(booking.guest_count));
  const [date, setDate] = useState(toDateInputValue(booking.booking_datetime));
  const [time, setTime] = useState(toTimeInputValue(booking.booking_datetime));
  const [durationMinutes, setDurationMinutes] = useState(
    String(booking.duration_minutes),
  );
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>(
    booking.table_assignments
      ?.map((assignment) => assignment.table_id)
      .filter(Boolean) ?? [],
  );

  const isValid =
    customerName.trim() !== "" &&
    phone.trim() !== "" &&
    Number(guestCount) >= 1 &&
    date !== "" &&
    time !== "" &&
    selectedTableIds.length >= 1;

  const datetime = date && time ? combineDateAndTime(date, time) : "";

  function handleSubmit() {
    if (!isValid) return;

    updateEventBooking.mutate(
      {
        outletId,
        bookingId: booking.id,
        data: {
          table_ids: selectedTableIds,
          customer_name: customerName,
          phone,
          guest_count: Number(guestCount),
          booking_datetime: datetime,
          duration_minutes: Number(durationMinutes),
          notes: notes.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Event booking updated successfully");
          onOpenChange(false);
          router.refresh();
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Event Booking</DialogTitle>
          <DialogDescription>
            Update the event reservation details for {booking.customer_name}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="edit_event_customer_name">Customer Name</Label>
            <Input
              id="edit_event_customer_name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_event_phone">Phone</Label>
            <Input
              id="edit_event_phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_event_guest_count">Guests</Label>
            <Input
              id="edit_event_guest_count"
              type="number"
              min={1}
              step={1}
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_event_date">Date</Label>
            <Input
              id="edit_event_date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_event_time">Time</Label>
            <Input
              id="edit_event_time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="edit_event_duration">Duration (minutes)</Label>
            <Input
              id="edit_event_duration"
              type="number"
              min={15}
              step={15}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="edit_event_notes">Notes (optional)</Label>
            <Textarea
              id="edit_event_notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <AvailabilityPicker
          outletId={outletId}
          datetime={datetime}
          durationMinutes={Number(durationMinutes) || 120}
          excludeBookingId={booking.id}
          selectionMode="multiple"
          selected={selectedTableIds}
          onSelectedChange={setSelectedTableIds}
        />

        {selectedTableIds.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {selectedTableIds.length} table
            {selectedTableIds.length > 1 ? "s" : ""} selected
          </p>
        )}

        {updateEventBooking.isError && (
          <p className="text-sm text-destructive">
            {updateEventBooking.error.message}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || updateEventBooking.isPending}
          >
            {updateEventBooking.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
