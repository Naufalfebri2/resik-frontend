"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingsList } from "@/components/bookings/bookings-list";
import type { TableBooking } from "@/types/booking";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function BookingsCalendar({
  bookings,
  outletId,
  year,
  month,
}: {
  bookings: TableBooking[];
  outletId: string;
  year: number;
  month: number; // 0-indexed: 0 = January
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const bookingsByDay = new Map<string, TableBooking[]>();
  for (const booking of bookings) {
    const key = dateKey(new Date(booking.booking_datetime));
    const existing = bookingsByDay.get(key) ?? [];
    existing.push(booking);
    bookingsByDay.set(key, existing);
  }

  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date();
  function isToday(date: Date) {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const selectedDayBookings = selectedDate
    ? (bookingsByDay.get(dateKey(selectedDate)) ?? [])
    : [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium">
          {MONTH_NAMES[month]} {year}
        </p>
        <div className="flex gap-1">
          <Button asChild size="icon" variant="outline">
            <Link
              href={`/dashboard/bookings?outlet=${outletId}&view=calendar&year=${prevYear}&month=${prevMonth}`}
            >
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
          <Button asChild size="icon" variant="outline">
            <Link
              href={`/dashboard/bookings?outlet=${outletId}&view=calendar&year=${nextYear}&month=${nextMonth}`}
            >
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, index) => {
          if (!date) {
            return <div key={index} className="aspect-square" />;
          }

          const count = bookingsByDay.get(dateKey(date))?.length ?? 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => count > 0 && setSelectedDate(date)}
              disabled={count === 0}
              className={`aspect-square rounded-md border p-1 text-left text-sm transition-colors ${
                isToday(date) ? "border-primary" : "border-border"
              } ${
                count > 0
                  ? "cursor-pointer hover:bg-accent"
                  : "cursor-default text-muted-foreground"
              }`}
            >
              <div>{date.getDate()}</div>
              {count > 0 && (
                <div className="mt-1 inline-block rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  {count}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Dialog
        open={selectedDate !== null}
        onOpenChange={(open) => !open && setSelectedDate(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDate?.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </DialogTitle>
          </DialogHeader>
          <BookingsList
            bookings={selectedDayBookings}
            outletId={outletId}
            layout="stack"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
