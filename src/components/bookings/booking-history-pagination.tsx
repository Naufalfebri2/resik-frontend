"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function BookingHistoryPagination({
  currentPage,
  lastPage,
  total,
}: {
  currentPage: number;
  lastPage: number;
  total: number;
}) {
  const searchParams = useSearchParams();

  function pageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/dashboard/bookings/history?${params.toString()}`;
  }

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {total} booking{total !== 1 ? "s" : ""} total
      </p>
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="outline" disabled={currentPage <= 1}>
          <Link
            href={pageHref(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          >
            <ChevronLeft className="size-4" /> Previous
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {lastPage}
        </p>
        <Button
          asChild
          size="sm"
          variant="outline"
          disabled={currentPage >= lastPage}
        >
          <Link
            href={pageHref(currentPage + 1)}
            aria-disabled={currentPage >= lastPage}
            tabIndex={currentPage >= lastPage ? -1 : undefined}
            className={
              currentPage >= lastPage ? "pointer-events-none opacity-50" : ""
            }
          >
            Next <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
