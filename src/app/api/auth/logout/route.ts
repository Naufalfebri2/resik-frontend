import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";

export async function POST(_request: NextRequest) {
  try {
    await apiClient("/logout", { method: "POST" });
  } catch (error) {
    if (!(error instanceof ApiError && error.status === 401)) {
      console.error("Logout error:", error);
    }
  }

  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("bmp_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
