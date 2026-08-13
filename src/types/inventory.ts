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

export interface Section {
  id: string;
  outlet_id: string;
  name: string;
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
