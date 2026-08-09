"use client";

import { useLogout } from "@/hooks/use-logout";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <Button
      variant="outline"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
    >
      {logout.isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
