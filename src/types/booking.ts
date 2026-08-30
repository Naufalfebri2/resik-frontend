import type { Table } from "@/types/orders";

export type BookingStatus =
  | "pending"
  | "awaiting_deposit"
  | "confirmed"
  | "seated"
  | "cancelled"
  | "no_show";

export type NoShowReason = "manual" | "grace_period";

export interface BookingTableAssignment {
  id: string;
  booking_id: string;
  table_id: string;
  created_at: string;
  updated_at: string;
  table?: Table;
}

export interface TableBooking {
  id: string;
  outlet_id: string;
  table_id: string | null;
  customer_name: string;
  phone: string;
  guest_count: number;
  booking_datetime: string;
  duration_minutes: number;
  status: BookingStatus;
  no_show_reason: NoShowReason | null;
  is_event: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  table?: Table;
  table_assignments?: BookingTableAssignment[];
}

export interface CreateBookingPayload {
  table_id: string;
  customer_name: string;
  phone: string;
  guest_count: number;
  booking_datetime: string;
  duration_minutes?: number;
  notes?: string;
}

export interface CreateEventBookingPayload {
  table_ids: string[];
  customer_name: string;
  phone: string;
  guest_count: number;
  booking_datetime: string;
  duration_minutes?: number;
  notes?: string;
}

// ---- Availability ----

export interface TableAvailability {
  id: string;
  table_number: string;
  is_available: boolean;
}

export interface AvailabilityQuery {
  datetime: string;
  duration_minutes?: number;
  exclude_booking_id?: string;
}
