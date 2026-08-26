"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navItems } from "@/lib/navigation";

const UNACKNOWLEDGED_POLL_INTERVAL_MS = 20000;

async function fetchUnacknowledgedCount(): Promise<number> {
  try {
    const response = await fetch("/api/orders/unacknowledged-count");
    if (!response.ok) return 0;
    const data = await response.json();
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

export function AppSidebar() {
  const pathname = usePathname();
  const [unacknowledgedCount, setUnacknowledgedCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const count = await fetchUnacknowledgedCount();
      if (!cancelled) setUnacknowledgedCount(count);
    }

    poll();
    const interval = setInterval(poll, UNACKNOWLEDGED_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-3">
        <span className="font-semibold text-sm">Resik</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.url);

                const isOrdersItem = item.url === "/dashboard/orders";

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {isOrdersItem && unacknowledgedCount > 0 && (
                      <SidebarMenuBadge>{unacknowledgedCount}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
