"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSubmitReconciliation } from "@/hooks/use-submit-reconciliation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SubmitReconciliationDialogProps {
  cashAccountId: string;
}

export function SubmitReconciliationDialog({
  cashAccountId,
}: SubmitReconciliationDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [physicalBalance, setPhysicalBalance] = useState("");
  const [notes, setNotes] = useState("");

  const submitReconciliation = useSubmitReconciliation();

  function resetForm() {
    setPhysicalBalance("");
    setNotes("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    submitReconciliation.mutate(
      {
        cashAccountId,
        physical_balance: Number(physicalBalance),
        notes: notes || undefined,
      },
      {
        onSuccess: (data) => {
          setOpen(false);
          resetForm();
          router.refresh();
          if (data.reconciliation.status === "completed") {
            toast.success("Reconciliation completed — no discrepancy found");
          } else {
            toast.success("Reconciliation submitted — pending owner approval");
          }
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Reconcile Today</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Reconcile Cash Balance</DialogTitle>
            <DialogDescription>
              Count the physical cash on hand and enter it below. This will be
              compared against the system-recorded balance for today.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="physical-balance">Physical Balance</Label>
              <Input
                id="physical-balance"
                type="number"
                min="0"
                step="0.01"
                value={physicalBalance}
                onChange={(e) => setPhysicalBalance(e.target.value)}
                placeholder="e.g. 437125"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any remarks about this count"
              />
            </div>

            {submitReconciliation.isError && (
              <p className="text-sm text-destructive">
                {submitReconciliation.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitReconciliation.isPending}>
              {submitReconciliation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
