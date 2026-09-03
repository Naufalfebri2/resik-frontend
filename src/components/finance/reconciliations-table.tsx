"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useApproveReconciliation } from "@/hooks/use-approve-reconciliation";
import { useRejectReconciliation } from "@/hooks/use-reject-reconciliation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CashReconciliation } from "@/types/inventory";

function formatCurrency(amount: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount));
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function statusVariant(status: CashReconciliation["status"]) {
  if (status === "completed") return "default";
  if (status === "pending_approval") return "secondary";
  return "destructive";
}

function statusLabel(status: CashReconciliation["status"]) {
  if (status === "completed") return "Completed";
  if (status === "pending_approval") return "Pending Approval";
  return "Rejected";
}

interface ReconciliationsTableProps {
  reconciliations: CashReconciliation[];
  cashAccountId: string;
  currentUserId: string;
  canApprove: boolean;
}

export function ReconciliationsTable({
  reconciliations,
  cashAccountId,
  currentUserId,
  canApprove,
}: ReconciliationsTableProps) {
  const router = useRouter();
  const approveReconciliation = useApproveReconciliation();
  const rejectReconciliation = useRejectReconciliation();

  function handleApprove(reconciliationId: string) {
    approveReconciliation.mutate(
      { cashAccountId, reconciliationId },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Reconciliation approved");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  function handleReject(reconciliationId: string) {
    rejectReconciliation.mutate(
      { cashAccountId, reconciliationId },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Reconciliation rejected");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  if (reconciliations.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No reconciliations yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">System</TableHead>
          <TableHead className="text-right">Physical</TableHead>
          <TableHead className="text-right">Difference</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reconciled By</TableHead>
          {canApprove && <TableHead className="w-48" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {reconciliations.map((r) => {
          const isPending = r.status === "pending_approval";
          const isOwnSubmission = r.reconciled_by.id === currentUserId;
          const isMutating =
            (approveReconciliation.isPending &&
              approveReconciliation.variables?.reconciliationId === r.id) ||
            (rejectReconciliation.isPending &&
              rejectReconciliation.variables?.reconciliationId === r.id);

          return (
            <TableRow key={r.id}>
              <TableCell>{formatDate(r.date)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(r.system_balance)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(r.physical_balance)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(r.difference)}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(r.status)}>
                  {statusLabel(r.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {r.reconciled_by.email}
              </TableCell>
              {canApprove && (
                <TableCell>
                  {isPending && (
                    <div className="flex gap-2">
                      <span
                        title={
                          isOwnSubmission
                            ? "You cannot approve your own submission"
                            : undefined
                        }
                      >
                        <Button
                          size="sm"
                          disabled={isOwnSubmission || isMutating}
                          onClick={() => handleApprove(r.id)}
                        >
                          Approve
                        </Button>
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isMutating}
                        onClick={() => handleReject(r.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
