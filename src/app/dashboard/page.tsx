import { getCurrentUser } from "@/lib/get-current-user";
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
            <span className="text-muted-foreground">Outlet-scoped:</span> Yes
          </p>
        )}
      </CardContent>
    </Card>
  );
}
