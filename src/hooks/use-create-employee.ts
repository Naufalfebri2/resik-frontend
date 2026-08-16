"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CustomFieldValue, Employee, EmployeeRole } from "@/types/hr";

interface CreateEmployeePayload {
  sectionId: string;
  name: string;
  phone: string;
  role: EmployeeRole;
  start_date: string;
  base_salary: number;
  custom_fields: Record<string, CustomFieldValue>;
}

interface CreateEmployeeErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function createEmployeeRequest(
  payload: CreateEmployeePayload,
): Promise<{ message: string; employee: Employee }> {
  const { sectionId, ...body } = payload;

  const response = await fetch(`/api/sections/${sectionId}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as CreateEmployeeErrorResponse;
    throw new Error(error.message || "Failed to create employee");
  }

  return data;
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployeeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
