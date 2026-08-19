import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmployeeRowActions } from "@/components/employee-row-actions";
import type {
  CustomFieldDefinition,
  CustomFieldValue,
  Employee,
} from "@/types/hr";

function formatCurrency(value: string | number) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numeric);
}

function formatCustomFieldValue(
  value: CustomFieldValue,
  fieldType: CustomFieldDefinition["field_type"],
) {
  if (value === null || value === undefined || value === "") return "—";

  if (fieldType === "boolean") {
    return value === true || value === "true" ? "Yes" : "No";
  }

  if (fieldType === "date") {
    return new Date(value as string).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return String(value);
}

export function EmployeeTable({
  employees,
  customFieldDefinitions,
}: {
  employees: Employee[];
  customFieldDefinitions: CustomFieldDefinition[];
}) {
  if (employees.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No employees in this section yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Base Salary</TableHead>
          {customFieldDefinitions.map((definition) => (
            <TableHead key={definition.id}>{definition.field_name}</TableHead>
          ))}
          <TableHead>Status</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell className="font-medium">{employee.name}</TableCell>
            <TableCell>{employee.phone}</TableCell>
            <TableCell>{employee.role}</TableCell>
            <TableCell>
              {new Date(employee.start_date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell>{formatCurrency(employee.base_salary)}</TableCell>
            {customFieldDefinitions.map((definition) => (
              <TableCell key={definition.id}>
                {formatCustomFieldValue(
                  employee.custom_fields?.[definition.field_name] ?? null,
                  definition.field_type,
                )}
              </TableCell>
            ))}
            <TableCell>
              {employee.is_active ? (
                <Badge variant="secondary">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </TableCell>
            <TableCell>
              <EmployeeRowActions
                employee={employee}
                customFieldDefinitions={customFieldDefinitions}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
