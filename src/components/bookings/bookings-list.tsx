import { BookingCard } from "@/components/bookings/booking-card";
import { EventBookingCard } from "@/components/bookings/event-booking-card";
import type { TableBooking } from "@/types/booking";

export function BookingsList({
  bookings,
  outletId,
  layout = "grid",
}: {
  bookings: TableBooking[];
  outletId: string;
  layout?: "grid" | "stack";
}) {
  if (bookings.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No bookings found for this outlet.
      </p>
    );
  }

  return (
    <div
      className={
        layout === "grid"
          ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          : "space-y-3"
      }
    >
      {bookings.map((booking) =>
        booking.is_event ? (
          <EventBookingCard
            key={booking.id}
            booking={booking}
            outletId={outletId}
          />
        ) : (
          <BookingCard key={booking.id} booking={booking} outletId={outletId} />
        ),
      )}
    </div>
  );
}
