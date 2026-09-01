import { getOutlets } from "@/lib/outlets";
import { getBookingHistory } from "@/lib/bookings";
import { OutletSwitcher } from "@/components/outlet-switcher";
import { BookingHistoryFilters } from "@/components/bookings/booking-history-filters";
import { BookingHistoryTable } from "@/components/bookings/booking-history-table";
import { BookingHistoryPagination } from "@/components/bookings/booking-history-pagination";
import type { BookingHistoryStatus } from "@/types/booking";

interface BookingHistoryPageProps {
  searchParams: Promise<{
    outlet?: string;
    status?: string;
    is_event?: string;
    date_from?: string;
    date_to?: string;
    page?: string;
  }>;
}

const VALID_STATUSES: BookingHistoryStatus[] = [
  "seated",
  "cancelled",
  "no_show",
];

export default async function BookingHistoryPage({
  searchParams,
}: BookingHistoryPageProps) {
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

  const status = VALID_STATUSES.includes(params.status as BookingHistoryStatus)
    ? (params.status as BookingHistoryStatus)
    : undefined;

  const isEvent =
    params.is_event === "true"
      ? true
      : params.is_event === "false"
        ? false
        : undefined;

  const page = params.page ? Number(params.page) || 1 : 1;

  const history = await getBookingHistory(selectedOutletId, {
    status,
    is_event: isEvent,
    date_from: params.date_from,
    date_to: params.date_to,
    page,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Booking History
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse past bookings that have reached a final status.
          </p>
        </div>
        <OutletSwitcher outlets={outlets} selectedOutletId={selectedOutletId} />
      </div>

      <BookingHistoryFilters
        outletId={selectedOutletId}
        status={params.status}
        isEvent={params.is_event}
        dateFrom={params.date_from}
        dateTo={params.date_to}
      />

      <BookingHistoryTable bookings={history.data} />

      <BookingHistoryPagination
        currentPage={history.current_page}
        lastPage={history.last_page}
        total={history.total}
      />
    </div>
  );
}
