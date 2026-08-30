import Link from "next/link";
import { Button } from "@/components/ui/button";
import { List, CalendarDays } from "lucide-react";

export function BookingsViewToggle({
  outletId,
  currentView,
}: {
  outletId: string;
  currentView: "list" | "calendar";
}) {
  return (
    <div className="flex gap-1 rounded-md border p-1">
      <Button
        asChild
        size="sm"
        variant={currentView === "list" ? "default" : "ghost"}
      >
        <Link href={`/dashboard/bookings?outlet=${outletId}&view=list`}>
          <List className="size-4" /> List
        </Link>
      </Button>
      <Button
        asChild
        size="sm"
        variant={currentView === "calendar" ? "default" : "ghost"}
      >
        <Link href={`/dashboard/bookings?outlet=${outletId}&view=calendar`}>
          <CalendarDays className="size-4" /> Calendar
        </Link>
      </Button>
    </div>
  );
}
