"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { useCreateBooking } from "@/hooks/use-create-booking";
import { AvailabilityPicker } from "@/components/bookings/availability-picker";

function nowForDatetimeLocal(): string {
  const now = new Date();
  now.setSeconds(0, 0);
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function CreateBookingDialog({ outletId }: { outletId: string }) {
  const router = useRouter();
  const createBooking = useCreateBooking();

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
    selectedTableIds.length === 1;

  function handleSubmit() {
    if (!isValid) return;

    createBooking.mutate(
      {
        outletId,
        data: {
          table_id: selectedTableIds[0],
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
          toast.success("Booking created successfully");
          setOpen(false);
          router.refresh();
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" /> New Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Booking</DialogTitle>
          <DialogDescription>
            Create a table reservation for a customer.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input
              id="customer_name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Andi Wijaya"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest_count">Guests</Label>
            <Input
              id="guest_count"
              type="number"
              min={1}
              step={1}
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="datetime">Date & Time</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={15}
              step={15}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Window seat if possible"
            />
          </div>
        </div>

        <AvailabilityPicker
          outletId={outletId}
          datetime={new Date(datetime).toISOString()}
          durationMinutes={Number(durationMinutes) || 120}
          selectionMode="single"
          selected={selectedTableIds}
          onSelectedChange={setSelectedTableIds}
        />

        {createBooking.isError && (
          <p className="text-sm text-destructive">
            {createBooking.error.message}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || createBooking.isPending}
          >
            {createBooking.isPending ? "Creating..." : "Create Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
