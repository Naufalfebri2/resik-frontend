import { getPayrollPeriods } from "@/lib/payroll";
import { PayrollMonthPicker } from "@/components/payroll-month-picker";
import { GeneratePayrollButton } from "@/components/generate-payroll-button";
import { PayrollTable } from "@/components/payroll-table";

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function PayrollContent({
  selectedMonth,
}: {
  selectedMonth: string | undefined;
}) {
  const month = selectedMonth ?? getCurrentMonth();
  const periods = await getPayrollPeriods(month);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PayrollMonthPicker month={month} />
        <GeneratePayrollButton month={month} />
      </div>
      <PayrollTable periods={periods} />
    </div>
  );
}
