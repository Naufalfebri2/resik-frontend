import { getOutlets } from "@/lib/outlets";
import { getCashAccounts } from "@/lib/cash-accounts";
import { OutletSwitcher } from "@/components/outlet-switcher";
import { CashAccountsTable } from "@/components/finance/cash-accounts-table";
import { CreateCashAccountDialog } from "@/components/finance/create-cash-account-dialog";

interface CashAccountsPageProps {
  searchParams: Promise<{ outlet?: string }>;
}

export default async function CashAccountsPage({
  searchParams,
}: CashAccountsPageProps) {
  const params = await searchParams;
  const outlets = await getOutlets();
  const selectedOutletId = params.outlet ?? outlets[0]?.id;

  if (!selectedOutletId) {
    return (
      <p className="text-sm text-muted-foreground">
        No outlets found. Please create an outlet first.
      </p>
    );
  }

  const cashAccounts = await getCashAccounts(selectedOutletId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Cash Accounts
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your outlet&apos;s cash and bank accounts.
          </p>
        </div>
        <OutletSwitcher outlets={outlets} selectedOutletId={selectedOutletId} />
      </div>

      <div className="flex justify-end">
        <CreateCashAccountDialog outletId={selectedOutletId} />
      </div>

      <CashAccountsTable
        cashAccounts={cashAccounts}
        outletId={selectedOutletId}
      />
    </div>
  );
}
