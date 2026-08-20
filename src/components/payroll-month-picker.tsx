"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MonthPicker } from "@/components/month-picker";

export function PayrollMonthPicker({ month }: { month: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(newMonth: string) {
    const params = new URLSearchParams(searchParams);
    params.set("month", newMonth);
    router.push(`${pathname}?${params.toString()}`);
  }

  return <MonthPicker value={month} onChange={handleChange} />;
}
