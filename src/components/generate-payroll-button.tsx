"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGeneratePayroll } from "@/hooks/use-generate-payroll";

export function GeneratePayrollButton({ month }: { month: string }) {
  const router = useRouter();
  const generatePayroll = useGeneratePayroll();

  function handleGenerate() {
    generatePayroll.mutate(
      { month },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <Button onClick={handleGenerate} disabled={generatePayroll.isPending}>
      {generatePayroll.isPending ? "Generating..." : "Generate Payroll"}
    </Button>
  );
}
