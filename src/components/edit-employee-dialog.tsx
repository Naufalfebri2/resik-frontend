"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateEmployee } from "@/hooks/use-update-employee";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomFieldInput } from "@/components/custom-field-input";
import { ROLE_SUGGESTIONS } from "@/lib/role-suggestions";
import type {
  CustomFieldDefinition,
  CustomFieldValue,
  Employee,
} from "@/types/hr";

function capitalizeFirstLetter(value: string) {
  if (value.length === 0) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function EditEmployeeDialog({
  employee,
  customFieldDefinitions,
  open,
  onOpenChange,
}: {
  employee: Employee;
  customFieldDefinitions: CustomFieldDefinition[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(employee.name);
  const [phone, setPhone] = useState(employee.phone);
  const [role, setRole] = useState(employee.role);
  const [baseSalary, setBaseSalary] = useState(String(employee.base_salary));
  const [isActive, setIsActive] = useState(employee.is_active);
  const [customFields, setCustomFields] = useState<
    Record<string, CustomFieldValue>
  >(employee.custom_fields ?? {});

  const updateEmployee = useUpdateEmployee();

  function handleCustomFieldChange(fieldName: string, value: CustomFieldValue) {
    setCustomFields((prev) => ({ ...prev, [fieldName]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateEmployee.mutate(
      {
        sectionId: employee.section_id,
        employeeId: employee.id,
        name,
        phone,
        role,
        base_salary: Number(baseSalary),
        is_active: isActive,
        custom_fields: customFields,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          router.refresh();
          toast.success("Employee updated successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_name">Name</Label>
              <Input
                id="edit_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_phone">Phone</Label>
              <Input
                id="edit_phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_role">Role / Position</Label>
              <Input
                id="edit_role"
                list="edit-role-suggestions"
                value={role}
                onChange={(e) => setRole(capitalizeFirstLetter(e.target.value))}
                placeholder="e.g. Barista, Head Bartender, Sous Chef"
                required
              />
              <datalist id="edit-role-suggestions">
                {ROLE_SUGGESTIONS.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_base_salary">Base Salary</Label>
              <Input
                id="edit_base_salary"
                type="number"
                step="1"
                min="0"
                value={baseSalary}
                onChange={(e) => setBaseSalary(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_is_active">Status</Label>
              <Select
                value={isActive ? "true" : "false"}
                onValueChange={(value) => setIsActive(value === "true")}
              >
                <SelectTrigger id="edit_is_active">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
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

            {updateEmployee.isError && (
              <p className="text-sm text-destructive">
                {updateEmployee.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={updateEmployee.isPending}>
              {updateEmployee.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
