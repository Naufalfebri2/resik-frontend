import { PayrollContent } from "@/components/payroll-content";

interface PayrollPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function PayrollPage({ searchParams }: PayrollPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payroll</h1>
        <p className="text-sm text-muted-foreground">
          Generate and manage monthly payroll for all employees.
        </p>
      </div>

      <PayrollContent selectedMonth={params.month} />
    </div>
  );
}
