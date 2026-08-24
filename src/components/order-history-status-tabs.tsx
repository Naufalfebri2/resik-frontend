"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { OrderHistoryStatusFilter } from "@/types/orders";

const TABS: { label: string; value: OrderHistoryStatusFilter | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Success", value: "success" },
  { label: "Refund", value: "refund" },
  { label: "Cancelled", value: "cancelled" },
];

export function OrderHistoryStatusTabs({
  outletId,
  selectedStatus,
}: {
  outletId: string;
  selectedStatus: OrderHistoryStatusFilter | undefined;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildHref(value: OrderHistoryStatusFilter | "all") {
    const params = new URLSearchParams(searchParams);
    params.set("outlet", outletId);

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    // Switching status should always reset back to page 1.
    params.delete("page");

    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="flex gap-1 border-b">
      {TABS.map((tab) => {
        const isActive =
          tab.value === "all" ? !selectedStatus : tab.value === selectedStatus;

        return (
          <Link
            key={tab.value}
            href={buildHref(tab.value)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
