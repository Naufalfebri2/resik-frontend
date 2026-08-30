"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { TableBooking } from "@/types/booking";

const SEEN_KEY_PREFIX = "booking-no-show-seen:";

export function GracePeriodWatcher({ bookings }: { bookings: TableBooking[] }) {
  useEffect(() => {
    for (const booking of bookings) {
      if (booking.no_show_reason !== "grace_period") continue;

      const seenKey = `${SEEN_KEY_PREFIX}${booking.id}`;
      if (sessionStorage.getItem(seenKey)) continue;

      sessionStorage.setItem(seenKey, "1");
      toast.warning(
        `${booking.customer_name}'s booking was automatically marked as No-Show (past grace period).`,
      );
    }
  }, [bookings]);

  return null;
}
