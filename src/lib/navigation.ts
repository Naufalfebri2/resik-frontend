import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Table2,
  Bike,
  CalendarClock,
  Wallet,
  Truck,
  ClipboardList,
  Banknote,
  Settings,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Inventory", url: "/dashboard/inventory", icon: Package },
  { title: "Suppliers", url: "/dashboard/suppliers", icon: Truck },
  {
    title: "Purchase Orders",
    url: "/dashboard/purchase-orders",
    icon: ClipboardList,
  },
  { title: "HR", url: "/dashboard/hr", icon: Users },
  { title: "Payroll", url: "/dashboard/payroll", icon: Banknote },
  { title: "Orders (POS)", url: "/dashboard/orders", icon: ShoppingCart },
  { title: "Tables", url: "/dashboard/tables", icon: Table2 },
  { title: "Delivery", url: "/dashboard/delivery", icon: Bike },
  { title: "Bookings", url: "/dashboard/bookings", icon: CalendarClock },
  { title: "Finance", url: "/dashboard/finance", icon: Wallet },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];
