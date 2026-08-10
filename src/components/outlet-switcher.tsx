"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Outlet } from "@/types/inventory";

export function OutletSwitcher({
  outlets,
  selectedOutletId,
}: {
  outlets: Outlet[];
  selectedOutletId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(outletId: string) {
    const params = new URLSearchParams(searchParams);
    params.set("outlet", outletId);
    params.delete("section");
    router.push(`${pathname}?${params.toString()}`);
  }

  if (outlets.length <= 1) {
    return (
      <div className="text-sm font-medium">
        {outlets[0]?.name ?? "No outlet"}
      </div>
    );
  }

  return (
    <Select value={selectedOutletId} onValueChange={handleChange}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select outlet" />
      </SelectTrigger>
      <SelectContent>
        {outlets.map((outlet) => (
          <SelectItem key={outlet.id} value={outlet.id}>
            {outlet.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
