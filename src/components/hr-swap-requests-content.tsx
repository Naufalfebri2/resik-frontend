import { getShiftSwapRequests } from "@/lib/shift-swap-requests";
import { SwapRequestTable } from "@/components/swap-request-table";

export async function HrSwapRequestsContent() {
  const swapRequests = await getShiftSwapRequests();
  const pendingRequests = swapRequests.filter(
    (request) => request.status === "pending",
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Showing pending shift swap requests across all outlets.
      </p>
      <SwapRequestTable swapRequests={pendingRequests} />
    </div>
  );
}
