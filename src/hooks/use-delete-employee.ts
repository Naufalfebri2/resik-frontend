"use client";

import { useMutation } from "@tanstack/react-query";

interface DeleteEmployeePayload {
  sectionId: string;
  employeeId: string;
}

interface DeleteEmployeeErrorResponse {
  message: string;
}

async function deleteEmployeeRequest(
  payload: DeleteEmployeePayload,
): Promise<{ message: string }> {
  const { sectionId, employeeId } = payload;

  const response = await fetch(
    `/api/sections/${sectionId}/employees/${employeeId}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = data as DeleteEmployeeErrorResponse;
    throw new Error(error.message || "Failed to delete employee");
  }

  return data;
}

export function useDeleteEmployee() {
  return useMutation({
    mutationFn: deleteEmployeeRequest,
  });
}
