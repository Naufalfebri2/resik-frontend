"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueries } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMoveEmployee } from "@/hooks/use-move-employee";
import type { Employee } from "@/types/hr";
import type { Outlet, Section } from "@/types/inventory";
import { useState } from "react";

async function fetchOutlets(): Promise<Outlet[]> {
  const response = await fetch("/api/outlets");
  if (!response.ok) throw new Error("Failed to load outlets");
  return response.json();
}

async function fetchSections(outletId: string): Promise<Section[]> {
  const response = await fetch(`/api/outlets/${outletId}/sections`);
  if (!response.ok) throw new Error("Failed to load sections");
  return response.json();
}

export function MoveEmployeeDialog({
  employee,
  open,
  onOpenChange,
}: {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const moveEmployee = useMoveEmployee();
  const [targetSectionId, setTargetSectionId] = useState<string>("");

  const { data: outlets = [] } = useQuery({
    queryKey: ["outlets"],
    queryFn: fetchOutlets,
    enabled: open,
  });

  const sectionQueries = useQueries({
    queries: outlets.map((outlet) => ({
      queryKey: ["sections", outlet.id],
      queryFn: () => fetchSections(outlet.id),
      enabled: open,
    })),
  });

  const outletsById = new Map(outlets.map((o) => [o.id, o.name]));

  const sectionOptions = sectionQueries
    .flatMap((query) => query.data ?? [])
    .filter((section) => section.id !== employee.section_id);

  const handleSubmit = () => {
    if (!targetSectionId) return;

    moveEmployee.mutate(
      {
        sectionId: employee.section_id,
        employeeId: employee.id,
        target_section_id: targetSectionId,
      },
      {
        onSuccess: () => {
          toast.success("Employee moved successfully");
          onOpenChange(false);
          setTargetSectionId("");
          router.refresh();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move to Section</DialogTitle>
          <DialogDescription>
            Move {employee.name} to a different section. The target section must
            be empty or already use the role &quot;{employee.role}
            &quot;.
          </DialogDescription>
        </DialogHeader>

        <Select value={targetSectionId} onValueChange={setTargetSectionId}>
          <SelectTrigger>
            <SelectValue placeholder="Select target section" />
          </SelectTrigger>
          <SelectContent>
            {sectionOptions.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                {section.name} — {outletsById.get(section.outlet_id)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {moveEmployee.isError && (
          <p className="text-sm text-destructive">
            {moveEmployee.error.message}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!targetSectionId || moveEmployee.isPending}
          >
            {moveEmployee.isPending ? "Moving..." : "Move Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
