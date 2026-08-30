import { getOutlets } from "@/lib/outlets";
import { getBookings } from "@/lib/bookings";
import { OutletSwitcher } from "@/components/outlet-switcher";
import { BookingsViewToggle } from "@/components/bookings/bookings-view-toggle";
import { BookingsList } from "@/components/bookings/bookings-list";
import { BookingsCalendar } from "@/components/bookings/bookings-calendar";
import { CreateBookingDialog } from "@/components/bookings/create-booking-dialog";
import { CreateEventBookingDialog } from "@/components/bookings/create-event-booking-dialog";
import { GracePeriodWatcher } from "@/components/bookings/grace-period-watcher";

interface BookingsPageProps {
  searchParams: Promise<{
    outlet?: string;
    view?: string;
    year?: string;
    month?: string;
  }>;
}

export default async function BookingsPage({
  searchParams,
}: BookingsPageProps) {
  const params = await searchParams;
  const outlets = await getOutlets();
  const selectedOutletId = params.outlet ?? outlets[0]?.id;

  if (!selectedOutletId) {
    return (
      <p className="text-sm text-muted-foreground">
        No outlets found. Please create an outlet first.
      </p>
    );
  }

  const view = params.view === "calendar" ? "calendar" : "list";

  const now = new Date();
  const year = params.year
    ? Number(params.year) || now.getFullYear()
    : now.getFullYear();
  const month = params.month
    ? Number(params.month) || now.getMonth()
    : now.getMonth();

  const bookings = await getBookings(selectedOutletId);

  return (
    <div className="space-y-6">
      <GracePeriodWatcher bookings={bookings} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Manage table reservations and event bookings.
          </p>
        </div>
        <OutletSwitcher outlets={outlets} selectedOutletId={selectedOutletId} />
      </div>

      <div className="flex items-center justify-between">
        <BookingsViewToggle outletId={selectedOutletId} currentView={view} />
        <div className="flex gap-2">
          <CreateBookingDialog outletId={selectedOutletId} />
          <CreateEventBookingDialog outletId={selectedOutletId} />
        </div>
      </div>

      {view === "list" ? (
        <BookingsList bookings={bookings} outletId={selectedOutletId} />
      ) : (
        <BookingsCalendar
          bookings={bookings}
          outletId={selectedOutletId}
          year={year}
          month={month}
        />
      )}
    </div>
  );
}
