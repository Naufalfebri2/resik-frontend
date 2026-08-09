import { getCurrentUser } from "@/lib/get-current-user";
import { LogoutButton } from "@/components/logout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="flex items-center justify-between border-b bg-background px-6 py-4">
        <h1 className="text-lg font-semibold">BMP F&B Dashboard</h1>
        <LogoutButton />
      </header>

      <main className="p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>You are signed in as:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Email:</span> {user.email}
            </p>
            <p>
              <span className="text-muted-foreground">Role:</span> {user.role}
            </p>
            {user.outlet_id && (
              <p>
                <span className="text-muted-foreground">Outlet-scoped:</span>{" "}
                Yes
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
