"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdatePayrollStatus } from "@/hooks/use-update-payroll-status";
import type { PayrollPeriod, PayrollStatus } from "@/types/payroll";

const STATUS_ORDER: PayrollStatus[] = ["draft", "final", "paid"];

const STATUS_ACTION_LABEL: Record<PayrollStatus, string> = {
  draft: "Mark as Draft",
  final: "Mark as Final",
  paid: "Mark as Paid",
};

export function PayrollRowActions({ period }: { period: PayrollPeriod }) {
  const router = useRouter();
  const updateStatus = useUpdatePayrollStatus();

  const currentIndex = STATUS_ORDER.indexOf(period.status);
  const nextStatuses = STATUS_ORDER.slice(currentIndex + 1);

  if (nextStatuses.length === 0) {
    return null;
  }

  function handleUpdate(status: PayrollStatus) {
    updateStatus.mutate(
      { payrollPeriodId: period.id, status },
      {
        onSuccess: () => {
          toast.success(`Payroll marked as ${status}`);
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {nextStatuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleUpdate(status)}
            disabled={updateStatus.isPending}
          >
            {STATUS_ACTION_LABEL[status]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
