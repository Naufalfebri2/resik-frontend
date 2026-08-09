"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { LoginPayload, User } from "@/types/auth";

interface LoginErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

async function loginRequest(payload: LoginPayload): Promise<{ user: User }> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as LoginErrorResponse;
    throw new Error(error.message || "Login gagal");
  }

  return data;
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
  });
}
