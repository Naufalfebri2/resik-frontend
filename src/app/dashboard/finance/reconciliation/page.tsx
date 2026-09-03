import { getOutlets } from "@/lib/outlets";
import { getCashAccounts } from "@/lib/cash-accounts";
import { getCashReconciliations } from "@/lib/cash-reconciliations";
import { getCurrentUser } from "@/lib/get-current-user";
import { OutletSwitcher } from "@/components/outlet-switcher";
import { CashAccountSwitcher } from "@/components/finance/cash-account-switcher";
import { ReconciliationsTable } from "@/components/finance/reconciliations-table";
import { SubmitReconciliationDialog } from "@/components/finance/submit-reconciliation-dialog";

interface ReconciliationPageProps {
  searchParams: Promise<{ outlet?: string; account?: string }>;
}

export default async function ReconciliationPage({
  searchParams,
}: ReconciliationPageProps) {
  const params = await searchParams;
  const [outlets, user] = await Promise.all([getOutlets(), getCurrentUser()]);

  const selectedOutletId = params.outlet ?? outlets[0]?.id;

  if (!selectedOutletId) {
    return (
      <p className="text-sm text-muted-foreground">
        No outlets found. Please create an outlet first.
      </p>
    );
  }

  const cashAccounts = await getCashAccounts(selectedOutletId);
  const selectedCashAccountId = params.account ?? cashAccounts[0]?.id;

  const canSubmit =
    user.role === "owner" || user.role === "admin" || user.role === "manager";
  const canApprove = user.role === "owner";

  const reconciliations = selectedCashAccountId
    ? await getCashReconciliations(selectedCashAccountId)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reconciliation
          </h1>
          <p className="text-sm text-muted-foreground">
            Match physical cash balance against system records.
          </p>
        </div>
        <OutletSwitcher outlets={outlets} selectedOutletId={selectedOutletId} />
      </div>

      <div className="flex items-center justify-between">
        <CashAccountSwitcher
          cashAccounts={cashAccounts}
          selectedCashAccountId={selectedCashAccountId ?? ""}
        />
        {canSubmit && selectedCashAccountId && (
          <SubmitReconciliationDialog cashAccountId={selectedCashAccountId} />
        )}
      </div>

      {!selectedCashAccountId ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No cash accounts for this outlet yet.
        </p>
      ) : (
        <ReconciliationsTable
          reconciliations={reconciliations}
          cashAccountId={selectedCashAccountId}
          currentUserId={user.id}
          canApprove={canApprove}
        />
      )}
    </div>
  );
}
