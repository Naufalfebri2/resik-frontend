"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const HR_TABS = [
  { label: "Employees", segment: "employees" },
  { label: "Shifts", segment: "shifts" },
  { label: "Swap Requests", segment: "swap-requests" },
  { label: "Attendance", segment: "attendance" },
];

export function HrSubNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildHref(segment: string) {
    const query = searchParams.toString();
    return `/dashboard/hr/${segment}${query ? `?${query}` : ""}`;
  }

  return (
    <div className="flex gap-2">
      {HR_TABS.map((tab) => {
        const isActive = pathname === `/dashboard/hr/${tab.segment}`;
        return (
          <Link
            key={tab.segment}
            href={buildHref(tab.segment)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
