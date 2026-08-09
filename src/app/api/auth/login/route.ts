import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { LoginPayload, LoginResponse } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const body: LoginPayload = await request.json();

    const data = await apiClient<LoginResponse>("/login", {
      method: "POST",
      body,
      skipAuth: true,
    });

    const response = NextResponse.json({ user: data.user });

    response.cookies.set("bmp_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message, errors: error.errors },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
