"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateEmployee } from "@/hooks/use-create-employee";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomFieldInput } from "@/components/custom-field-input";
import type {
  CustomFieldDefinition,
  CustomFieldValue,
  EmployeeRole,
} from "@/types/hr";

export function CreateEmployeeDialog({
  sectionId,
  customFieldDefinitions,
}: {
  sectionId: string;
  customFieldDefinitions: CustomFieldDefinition[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<EmployeeRole | "">("");
  const [startDate, setStartDate] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [customFields, setCustomFields] = useState<
    Record<string, CustomFieldValue>
  >({});

  const createEmployee = useCreateEmployee();

  function resetForm() {
    setName("");
    setPhone("");
    setRole("");
    setStartDate("");
    setBaseSalary("");
    setCustomFields({});
  }

  function handleCustomFieldChange(fieldName: string, value: CustomFieldValue) {
    setCustomFields((prev) => ({ ...prev, [fieldName]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!role) return;

    createEmployee.mutate(
      {
        sectionId,
        name,
        phone,
        role,
        start_date: startDate,
        base_salary: Number(baseSalary),
        custom_fields: customFields,
      },
      {
        onSuccess: () => {
          setOpen(false);
          resetForm();
          router.refresh();
          toast.success("Employee added successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Employee</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>
              Add a new employee to this section.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 081234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as EmployeeRole)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_salary">Base Salary</Label>
              <Input
                id="base_salary"
                type="number"
                step="1"
                min="0"
                value={baseSalary}
                onChange={(e) => setBaseSalary(e.target.value)}
                placeholder="e.g. 3000000"
                required
              />
            </div>

            {customFieldDefinitions.map((definition) => (
              <CustomFieldInput
                key={definition.id}
                definition={definition}
                value={customFields[definition.field_name] ?? null}
                onChange={(value) =>
                  handleCustomFieldChange(definition.field_name, value)
                }
              />
            ))}

            {createEmployee.isError && (
              <p className="text-sm text-destructive">
                {createEmployee.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createEmployee.isPending || !role}>
              {createEmployee.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
