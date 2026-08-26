export interface Outlet {
  id: string;
  tenant_id: string;
  name: string;
  recording_mode: "simple" | "detail";
  latitude: string | null;
  longitude: string | null;
  qr_ordering_enabled: boolean;
  online_pickup_enabled: boolean;
}

export interface UpdateOutletPayload {
  name?: string;
  recording_mode?: "simple" | "detail";
  latitude?: number | null;
  longitude?: number | null;
  qr_ordering_enabled?: boolean;
  online_pickup_enabled?: boolean;
}

export interface Section {
  id: string;
  outlet_id: string;
  name: string;
  employees_count?: number;
}

export type RiskCategory = "perishable" | "dry_goods";

export interface Ingredient {
  id: string;
  section_id: string;
  name: string;
  unit: string;
  risk_category: RiskCategory;
  alert_threshold: string;
  custom_fields: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  current_stock?: number | null;
}

export interface LowStockIngredient extends Ingredient {
  section: Section;
  daily_stocks: {
    id: string;
    date: string;
    opening_stock: string;
    expected_closing_stock: string;
    actual_closing_stock: string | null;
  }[];
}

export interface DailyStock {
  id: string;
  ingredient_id: string;
  date: string;
  opening_stock: string;
  expected_closing_stock: string;
  actual_closing_stock: string | null;
  variance: string | null;
  stock_in: string;
  adjustment_quantity: string;
  created_at: string;
  updated_at: string;
  stock_outflows?: StockOutflow[];
}

export type StockOutflowCategory = "production" | "waste" | "supplier_return";

export interface StockOutflow {
  id: string;
  daily_stock_id: string;
  category: StockOutflowCategory;
  quantity: string;
  created_at: string;
  updated_at: string;
}

export interface IngredientDetail extends Ingredient {
  section: Section & { outlet: Outlet };
  daily_stocks: DailyStock[];
}

export interface StockAdjustment {
  id: string;
  ingredient_id: string;
  date: string;
  adjustment_quantity: string;
  reason: string;
  adjusted_by: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  tenant_id: string;
  name: string;
  contact: string;
  created_at: string;
  updated_at: string;
}

export type PurchaseOrderStatus = "draft" | "ordered" | "received";

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  ingredient_id: string;
  quantity: string;
  unit_price: string;
  ingredient: Ingredient;
}

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  outlet_id: string;
  date: string;
  status: PurchaseOrderStatus;
  received_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  supplier: Supplier;
  items: PurchaseOrderItem[];
}

export interface CashAccount {
  id: string;
  outlet_id: string;
  name: string;
  type: "cash" | "bank";
  balance: number;
  created_at: string;
  updated_at: string;
}
