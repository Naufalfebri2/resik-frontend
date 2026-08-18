"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from "@/types/hr";

export function EmployeeSwitcher({
  employees,
  selectedEmployeeId,
}: {
  employees: Employee[];
  selectedEmployeeId: string | undefined;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(employeeId: string) {
    const params = new URLSearchParams(searchParams);
    params.set("employee", employeeId);
    router.push(`${pathname}?${params.toString()}`);
  }

  if (employees.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No employees in this section.
      </p>
    );
  }

  return (
    <Select value={selectedEmployeeId} onValueChange={handleChange}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select employee" />
      </SelectTrigger>
      <SelectContent>
        {employees.map((employee) => (
          <SelectItem key={employee.id} value={employee.id}>
            {employee.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
