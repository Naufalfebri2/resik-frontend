"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TableAvailability } from "@/types/booking";

async function fetchAvailability(
  outletId: string,
  datetime: string,
  durationMinutes: number,
  excludeBookingId?: string,
): Promise<TableAvailability[]> {
  const query = new URLSearchParams({
    datetime,
    duration_minutes: String(durationMinutes),
  });
  if (excludeBookingId) query.set("exclude_booking_id", excludeBookingId);

  const response = await fetch(
    `/api/outlets/${outletId}/bookings/available-tables?${query.toString()}`,
  );
  if (!response.ok) throw new Error("Failed to load table availability");
  return response.json();
}

interface AvailabilityPickerProps {
  outletId: string;
  datetime: string;
  durationMinutes: number;
  excludeBookingId?: string;
  selectionMode: "single" | "multiple";
  selected: string[];
  onSelectedChange: (tableIds: string[]) => void;
}

export function AvailabilityPicker({
  outletId,
  datetime,
  durationMinutes,
  excludeBookingId,
  selectionMode,
  selected,
  onSelectedChange,
}: AvailabilityPickerProps) {
  const { data, isFetching, isError } = useQuery({
    queryKey: [
      "booking-availability",
      outletId,
      datetime,
      durationMinutes,
      excludeBookingId,
    ],
    queryFn: () =>
      fetchAvailability(outletId, datetime, durationMinutes, excludeBookingId),
    enabled: Boolean(datetime),
  });

  function handleToggle(table: TableAvailability) {
    if (!table.is_available) return;

    if (selectionMode === "single") {
      onSelectedChange([table.id]);
      return;
    }

    if (selected.includes(table.id)) {
      onSelectedChange(selected.filter((id) => id !== table.id));
    } else {
      onSelectedChange([...selected, table.id]);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Select Table</p>
        {isFetching && (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isError && (
        <p className="text-sm text-destructive">
          Failed to load table availability.
        </p>
      )}

      {data && data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No tables found for this outlet.
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {data?.map((table) => {
          const isSelected = selected.includes(table.id);
          return (
            <button
              key={table.id}
              type="button"
              disabled={!table.is_available}
              onClick={() => handleToggle(table)}
              className={cn(
                "rounded-md border p-2 text-sm font-medium transition-colors",
                !table.is_available &&
                  "cursor-not-allowed border-dashed bg-muted text-muted-foreground line-through",
                table.is_available && !isSelected && "hover:bg-accent",
                isSelected &&
                  "border-primary bg-primary text-primary-foreground",
              )}
            >
              {table.table_number}
            </button>
          );
        })}
      </div>
    </div>
  );
}
