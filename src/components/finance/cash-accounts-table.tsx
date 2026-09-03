import { CashAccountRowActions } from "@/components/finance/cash-account-row-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CashAccount } from "@/types/inventory";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function CashAccountsTable({
  cashAccounts,
  outletId,
}: {
  cashAccounts: CashAccount[];
  outletId: string;
}) {
  if (cashAccounts.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No cash accounts yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Balance</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {cashAccounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell className="font-medium">{account.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {account.type}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(account.balance)}
            </TableCell>
            <TableCell>
              <CashAccountRowActions
                cashAccount={account}
                outletId={outletId}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
