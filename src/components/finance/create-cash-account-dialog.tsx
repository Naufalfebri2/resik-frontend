"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateFinanceCashAccount } from "@/hooks/use-create-finance-cash-account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreateCashAccountDialogProps {
  outletId: string;
}

export function CreateCashAccountDialog({
  outletId,
}: CreateCashAccountDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"cash" | "bank">("cash");

  const createCashAccount = useCreateFinanceCashAccount();

  function resetForm() {
    setName("");
    setType("cash");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    createCashAccount.mutate(
      { outletId, name, type },
      {
        onSuccess: () => {
          setOpen(false);
          resetForm();
          router.refresh();
          toast.success("Cash account added successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Cash Account</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Cash Account</DialogTitle>
            <DialogDescription>
              Add a new cash or bank account for this outlet.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kas Tunai"
                maxLength={50}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as "cash" | "bank")}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {createCashAccount.isError && (
              <p className="text-sm text-destructive">
                {createCashAccount.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createCashAccount.isPending}>
              {createCashAccount.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
