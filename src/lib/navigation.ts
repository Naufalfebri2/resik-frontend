import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  CalendarClock,
  Wallet,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Inventory", url: "/dashboard/inventory", icon: Package },
  { title: "HR", url: "/dashboard/hr", icon: Users },
  { title: "Orders (POS)", url: "/dashboard/orders", icon: ShoppingCart },
  { title: "Bookings", url: "/dashboard/bookings", icon: CalendarClock },
  { title: "Finance", url: "/dashboard/finance", icon: Wallet },
];
