import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PayrollRowActions } from "@/components/payroll-row-actions";
import type { PayrollPeriod, PayrollStatus } from "@/types/payroll";

function formatCurrency(value: string | number) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numeric);
}

function statusBadgeVariant(status: PayrollStatus) {
  if (status === "paid") return "secondary";
  if (status === "final") return "default";
  return "outline";
}

function statusLabel(status: PayrollStatus) {
  if (status === "paid") return "Paid";
  if (status === "final") return "Final";
  return "Draft";
}

export function PayrollTable({ periods }: { periods: PayrollPeriod[] }) {
  if (periods.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No payroll generated for this month yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Base Salary</TableHead>
          <TableHead>Late Deduction</TableHead>
          <TableHead>Absence Deduction</TableHead>
          <TableHead>Net Salary</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {periods.map((period) => (
          <TableRow key={period.id}>
            <TableCell className="font-medium">
              {period.employee?.name ?? "—"}
            </TableCell>
            <TableCell>{formatCurrency(period.base_salary)}</TableCell>
            <TableCell>{formatCurrency(period.total_late_deduction)}</TableCell>
            <TableCell>
              {formatCurrency(period.total_absence_deduction)}
            </TableCell>
            <TableCell className="font-medium">
              {formatCurrency(period.net_salary)}
            </TableCell>
            <TableCell>
              <Badge variant={statusBadgeVariant(period.status)}>
                {statusLabel(period.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <PayrollRowActions period={period} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
