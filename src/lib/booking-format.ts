export function formatBookingTimeRange(
  datetime: string,
  durationMinutes: number,
): string {
  const start = new Date(datetime);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  const dateLabel = start.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
  const startTime = start.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateLabel}, ${startTime} - ${endTime}`;
}

export function todayDateString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

export function nowTimeString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(11, 16);
}

export function combineDateAndTime(date: string, time: string): string {
  return new Date(`${date}T${time}`).toISOString();
}
