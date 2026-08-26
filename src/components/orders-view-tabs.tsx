"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function OrdersViewTabs({
  outletId,
  unacknowledgedCount,
}: {
  outletId: string;
  unacknowledgedCount: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "tables";

  function buildHref(tab: "tables" | "unacknowledged") {
    const params = new URLSearchParams(searchParams);
    params.set("outlet", outletId);

    if (tab === "tables") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }

    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="flex gap-1 border-b">
      <Link
        href={buildHref("tables")}
        className={cn(
          "border-b-2 -mb-px px-4 py-2 text-sm font-medium transition-colors",
          activeTab === "tables"
            ? "border-primary text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        Tables
      </Link>
      <Link
        href={buildHref("unacknowledged")}
        className={cn(
          "flex items-center gap-1.5 border-b-2 -mb-px px-4 py-2 text-sm font-medium transition-colors",
          activeTab === "unacknowledged"
            ? "border-primary text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        Unacknowledged
        {unacknowledgedCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-medium text-destructive-foreground">
            {unacknowledgedCount}
          </span>
        )}
      </Link>
    </div>
  );
}
