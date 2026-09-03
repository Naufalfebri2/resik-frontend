"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CashAccount } from "@/types/inventory";

export function CashAccountSwitcher({
  cashAccounts,
  selectedCashAccountId,
}: {
  cashAccounts: CashAccount[];
  selectedCashAccountId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(cashAccountId: string) {
    const params = new URLSearchParams(searchParams);
    params.set("account", cashAccountId);
    router.push(`${pathname}?${params.toString()}`);
  }

  if (cashAccounts.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No cash accounts</div>
    );
  }

  if (cashAccounts.length === 1) {
    return <div className="text-sm font-medium">{cashAccounts[0].name}</div>;
  }

  return (
    <Select value={selectedCashAccountId} onValueChange={handleChange}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select cash account" />
      </SelectTrigger>
      <SelectContent>
        {cashAccounts.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
