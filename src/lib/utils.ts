import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatQuantity(value: string | number): string {
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return Math.round(num).toString();
}
