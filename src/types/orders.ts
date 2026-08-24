import type { Employee } from "@/types/hr";

export type OrderType = "dine_in" | "online_pickup" | "online_delivery";

export type OrderStatus =
  | "open"
  | "paid"
  | "partially_refunded"
  | "refunded"
  | "cancelled";

export type PrepStatus = "pending" | "preparing" | "prepared";
export type RefundStatus = "none" | "refunded";

export type PaymentMethod =
  | "cash"
  | "edc_bca"
  | "edc_bri"
  | "qr_bri"
  | "qr_gopay"
  | "qr_shopeepay"
  | "other";

export interface Table {
  id: string;
  section_id: string;
  table_number: string;
  qr_code: string;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: string;
  outlet_id: string;
  main_ingredient_id: string | null;
  name: string;
  price: string;
  is_active: boolean;
  custom_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_id: string;
  quantity: number;
  unit_price: string;
  split_label: string | null;
  prep_status: PrepStatus;
  refund_status: RefundStatus;
  created_at: string;
  updated_at: string;
  menu?: Menu;
}

export interface Payment {
  id: string;
  order_id: string;
  method: PaymentMethod;
  amount: string;
  cash_received: string | null;
  change_amount: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  outlet_id: string;
  table_id: string | null;
  order_number: string;
  customer_name: string | null;
  order_type: OrderType;
  status: OrderStatus;
  subtotal: string | null;
  tax_amount: string | null;
  service_charge_amount: string | null;
  opened_by: string | null;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  created_at: string;
  updated_at: string;
  table?: Table;
  items?: OrderItem[];
  payments?: Payment[];
}

export interface CreateOrderItemPayload {
  menu_id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  table_id?: string | null;
  customer_name?: string;
  items: CreateOrderItemPayload[];
}

export interface AddOrderItemsPayload {
  items: CreateOrderItemPayload[];
}

export interface AssignSplitLabelPayload {
  split_label: string | null;
}

export interface PayOrderPayload {
  cash_account_id: string;
  payments: {
    method: PaymentMethod;
    amount: number;
    cash_received?: number;
  }[];
}

export interface RefundItemPayload {
  refund_to_cash?: boolean;
  cash_account_id?: string;
}

// ---- Order History (Riwayat Order) ----

/**
 * Status filter accepted by GET /outlets/{outletId}/orders/history.
 * These are frontend-facing labels, distinct from OrderStatus (the raw
 * database column values). The backend maps:
 *   success   -> paid
 *   refund    -> refunded | partially_refunded
 *   cancelled -> cancelled
 */
export type OrderHistoryStatusFilter = "success" | "refund" | "cancelled";

/**
 * Minimal Employee shape nested under opened_by.employee in the history
 * response (only id + name are selected on the backend).
 */
export type OrderHistoryEmployee = Pick<Employee, "id" | "name">;

/**
 * Shape of `opened_by` ONLY on the /orders/history response, where the
 * backend eager-loads the relation (openedBy.employee). On every other
 * order endpoint (index/show/store/etc.), `opened_by` stays a plain
 * UUID string as defined on Order above - do not conflate the two.
 */
export interface OrderHistoryOpenedBy {
  id: string;
  tenant_id: string;
  email: string;
  role: string;
  employee_id: string | null;
  outlet_id: string | null;
  created_at: string;
  updated_at: string;
  employee: OrderHistoryEmployee | null;
}

/**
 * An Order as returned by /orders/history: identical to Order, except
 * opened_by is the expanded User object instead of a raw UUID string.
 */
export interface OrderHistoryItem extends Omit<Order, "opened_by"> {
  opened_by: OrderHistoryOpenedBy | null;
}

export interface OrderHistoryFilters {
  status?: OrderHistoryStatusFilter;
  date_from?: string;
  date_to?: string;
  table_id?: string;
  cashier_id?: string;
  payment_method?: PaymentMethod;
  page?: number;
  per_page?: number;
}

/**
 * Generic shape for Laravel's paginate() response, used by
 * GET /orders/history.
 */
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

// ---- Outlet Staff (for Cashier filter dropdown) ----

export interface OutletStaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
}
