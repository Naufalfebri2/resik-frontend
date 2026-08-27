export interface PublicMenuItem {
  id: string;
  name: string;
  price: string;
}

export interface PublicMenuResponse {
  table: {
    id: string;
    table_number: string;
  };
  outlet: {
    id: string;
    name: string;
  };
  menus: PublicMenuItem[];
}

export interface PublicOrderCartItem {
  menu_id: string;
  quantity: number;
}

export interface SubmitPublicOrderPayload {
  customer_name?: string;
  items: PublicOrderCartItem[];
}

export interface SubmitPublicOrderResponse {
  message: string;
  order_id: string;
  order: {
    id: string;
    order_number: string;
    items: {
      id: string;
      menu_id: string;
      quantity: number;
      unit_price: string;
      menu?: PublicMenuItem;
    }[];
  };
}

export interface PublicOrderStatusItem {
  id: string;
  menu_id: string;
  quantity: number;
  unit_price: string;
  refund_status: "none" | "refunded";
  menu?: PublicMenuItem;
}

export interface PublicOrderStatusResponse {
  order_number: string;
  table_number: string | null;
  customer_name: string | null;
  status: string;
  items: PublicOrderStatusItem[];
  total: number;
}

// ---- Online Pickup ----

export interface PublicPickupMenuResponse {
  outlet: {
    id: string;
    name: string;
  };
  menus: PublicMenuItem[];
}

export interface SubmitPickupOrderPayload {
  customer_name: string;
  customer_phone: string;
  requested_pickup_time?: string;
  items: PublicOrderCartItem[];
}

export interface SubmitPickupOrderResponse {
  message: string;
  order_id: string;
  order: {
    id: string;
    order_number: string;
    items: {
      id: string;
      menu_id: string;
      quantity: number;
      unit_price: string;
      menu?: PublicMenuItem;
    }[];
  };
}