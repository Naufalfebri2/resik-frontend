import { redirect } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import type { User } from "@/types/auth";

export async function getCurrentUser(): Promise<User> {
  try {
    return await apiClient<User>("/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login");
    }
    throw error;
  }
}
