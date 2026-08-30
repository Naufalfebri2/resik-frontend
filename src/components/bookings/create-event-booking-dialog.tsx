"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateEventBooking } from "@/hooks/use-create-event-booking";
import { AvailabilityPicker } from "@/components/bookings/availability-picker";

function nowForDatetimeLocal(): string {
  const now = new Date();
  now.setSeconds(0, 0);
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function CreateEventBookingDialog({ outletId }: { outletId: string }) {
  const router = useRouter();
  const createEventBooking = useCreateEventBooking();

  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [datetime, setDatetime] = useState(nowForDatetimeLocal());
  const [durationMinutes, setDurationMinutes] = useState("120");
  const [notes, setNotes] = useState("");
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);

  function resetForm() {
    setCustomerName("");
    setPhone("");
    setGuestCount("1");
    setDatetime(nowForDatetimeLocal());
    setDurationMinutes("120");
    setNotes("");
    setSelectedTableIds([]);
  }

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) resetForm();
    setOpen(newOpen);
  }

  const isValid =
    customerName.trim() !== "" &&
    phone.trim() !== "" &&
    Number(guestCount) >= 1 &&
    selectedTableIds.length >= 1;

  function handleSubmit() {
    if (!isValid) return;

    createEventBooking.mutate(
      {
        outletId,
        data: {
          table_ids: selectedTableIds,
          customer_name: customerName,
          phone,
          guest_count: Number(guestCount),
          booking_datetime: new Date(datetime).toISOString(),
          duration_minutes: Number(durationMinutes),
          notes: notes.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Event booking created successfully");
          setOpen(false);
          router.refresh();
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <CalendarPlus className="size-4" /> New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Event Booking</DialogTitle>
          <DialogDescription>
            Reserve multiple tables at once for a large group or special event.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="event_customer_name">Customer Name</Label>
            <Input
              id="event_customer_name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Andi Wijaya"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_phone">Phone</Label>
            <Input
              id="event_phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_guest_count">Guests</Label>
            <Input
              id="event_guest_count"
              type="number"
              min={1}
              step={1}
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_datetime">Date & Time</Label>
            <Input
              id="event_datetime"
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_duration">Duration (minutes)</Label>
            <Input
              id="event_duration"
              type="number"
              min={15}
              step={15}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="event_notes">Notes (optional)</Label>
            <Textarea
              id="event_notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ramadhan iftar gathering"
            />
          </div>
        </div>

        <AvailabilityPicker
          outletId={outletId}
          datetime={new Date(datetime).toISOString()}
          durationMinutes={Number(durationMinutes) || 120}
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

        {createEventBooking.isError && (
          <p className="text-sm text-destructive">
            {createEventBooking.error.message}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || createEventBooking.isPending}
          >
            {createEventBooking.isPending
              ? "Creating..."
              : "Create Event Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
