import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiClient } from "@/lib/api-client";
import type { Ingredient } from "@/types/inventory";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string; ingredientId: string }> },
) {
  try {
    const { sectionId, ingredientId } = await params;
    const body = await request.json();

    const data = await apiClient<{ message: string; ingredient: Ingredient }>(
      `/sections/${sectionId}/ingredients/${ingredientId}`,
      { method: "PUT", body },
    );

    return NextResponse.json(data);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string; ingredientId: string }> },
) {
  try {
    const { sectionId, ingredientId } = await params;

    const data = await apiClient<{ message: string }>(
      `/sections/${sectionId}/ingredients/${ingredientId}`,
      { method: "DELETE" },
    );

    return NextResponse.json(data);
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
