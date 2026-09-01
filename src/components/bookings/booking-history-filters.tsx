"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STATUS_OPTIONS = [
  { value: "__all__", label: "All statuses" },
  { value: "seated", label: "Seated" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No-Show" },
];

const TYPE_OPTIONS = [
  { value: "__all__", label: "All types" },
  { value: "false", label: "Regular" },
  { value: "true", label: "Event" },
];

export function BookingHistoryFilters({
  outletId,
  status,
  isEvent,
  dateFrom,
  dateTo,
}: {
  outletId: string;
  status?: string;
  isEvent?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "__all__") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/dashboard/bookings/history?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label className="text-xs">Status</Label>
        <Select
          value={status ?? "__all__"}
          onValueChange={(value) => updateParam("status", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Type</Label>
        <Select
          value={isEvent ?? "__all__"}
          onValueChange={(value) => updateParam("is_event", value)}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">From</Label>
        <Input
          type="date"
          className="w-40"
          value={dateFrom ?? ""}
          onChange={(e) => updateParam("date_from", e.target.value || null)}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">To</Label>
        <Input
          type="date"
          className="w-40"
          value={dateTo ?? ""}
          onChange={(e) => updateParam("date_to", e.target.value || null)}
        />
      </div>
    </div>
  );
}
