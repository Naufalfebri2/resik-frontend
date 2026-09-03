import { getOutlets } from "@/lib/outlets";
import { getCashAccounts } from "@/lib/cash-accounts";
import { getCashTransactions } from "@/lib/cash-transactions";
import { getCurrentUser } from "@/lib/get-current-user";
import { OutletSwitcher } from "@/components/outlet-switcher";
import { CashAccountSwitcher } from "@/components/finance/cash-account-switcher";
import { CashTransactionsTable } from "@/components/finance/cash-transactions-table";
import { CreateCashTransactionDialog } from "@/components/finance/create-cash-transaction-dialog";

interface TransactionsPageProps {
  searchParams: Promise<{ outlet?: string; account?: string }>;
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
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

  const canManageTransactions = user.role === "owner" || user.role === "admin";

  const transactions = selectedCashAccountId
    ? await getCashTransactions(selectedCashAccountId)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-muted-foreground">
            View and record manual cash transactions.
          </p>
        </div>
        <OutletSwitcher outlets={outlets} selectedOutletId={selectedOutletId} />
      </div>

      <div className="flex items-center justify-between">
        <CashAccountSwitcher
          cashAccounts={cashAccounts}
          selectedCashAccountId={selectedCashAccountId ?? ""}
        />
        {canManageTransactions && selectedCashAccountId && (
          <CreateCashTransactionDialog cashAccountId={selectedCashAccountId} />
        )}
      </div>

      {!selectedCashAccountId ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No cash accounts for this outlet yet.
        </p>
      ) : (
        <CashTransactionsTable transactions={transactions} />
      )}
    </div>
  );
}
