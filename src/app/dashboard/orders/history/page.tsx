import { getOutlets } from "@/lib/outlets";
import { getSections } from "@/lib/sections";
import { getTables } from "@/lib/tables";
import { getOrderHistory } from "@/lib/orders";
import { getOutletStaff } from "@/lib/staff";
import { OutletSwitcher } from "@/components/outlet-switcher";
import { OrderHistoryStatusTabs } from "@/components/order-history-status-tabs";
import { OrderHistoryFilters } from "@/components/order-history-filters";
import { OrderHistoryTable } from "@/components/order-history-table";
import { OrderHistoryPagination } from "@/components/order-history-pagination";
import type {
  OrderHistoryStatusFilter,
  PaymentMethod,
  Table,
} from "@/types/orders";

interface OrderHistoryPageProps {
  searchParams: Promise<{
    outlet?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    table_id?: string;
    cashier_id?: string;
    payment_method?: string;
    page?: string;
  }>;
}

const VALID_STATUSES: OrderHistoryStatusFilter[] = [
  "success",
  "refund",
  "cancelled",
];

const VALID_PAYMENT_METHODS: PaymentMethod[] = [
  "cash",
  "edc_bca",
  "edc_bri",
  "qr_bri",
  "qr_gopay",
  "qr_shopeepay",
  "other",
];

export default async function OrderHistoryPage({
  searchParams,
}: OrderHistoryPageProps) {
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

  // Guard against garbage query params instead of letting an invalid
  // value reach the backend and blow up with a raw 422.
  const status = VALID_STATUSES.includes(
    params.status as OrderHistoryStatusFilter,
  )
    ? (params.status as OrderHistoryStatusFilter)
    : undefined;

  const paymentMethod = VALID_PAYMENT_METHODS.includes(
    params.payment_method as PaymentMethod,
  )
    ? (params.payment_method as PaymentMethod)
    : undefined;

  const page = params.page ? Number(params.page) || 1 : 1;

  const sections = await getSections(selectedOutletId);

  // There is no "all tables in outlet" endpoint - tables only exist
  // scoped to a section - so we fetch per section and flatten.
  const [tablesPerSection, staff, history] = await Promise.all([
    Promise.all(sections.map((section) => getTables(section.id))),
    getOutletStaff(selectedOutletId),
    getOrderHistory(selectedOutletId, {
      status,
      date_from: params.date_from,
      date_to: params.date_to,
      table_id: params.table_id,
      cashier_id: params.cashier_id,
      payment_method: paymentMethod,
      page,
    }),
  ]);

  const tables: Table[] = tablesPerSection.flat();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order History
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse past orders by status, date, table, cashier, or payment
            method.
          </p>
        </div>
        <OutletSwitcher outlets={outlets} selectedOutletId={selectedOutletId} />
      </div>

      <OrderHistoryStatusTabs
        outletId={selectedOutletId}
        selectedStatus={status}
      />

      <OrderHistoryFilters
        outletId={selectedOutletId}
        tables={tables}
        staff={staff}
      />

      <OrderHistoryTable outletId={selectedOutletId} orders={history.data} />

      <OrderHistoryPagination
        outletId={selectedOutletId}
        currentPage={history.current_page}
        lastPage={history.last_page}
        total={history.total}
        searchParams={{
          status: params.status,
          date_from: params.date_from,
          date_to: params.date_to,
          table_id: params.table_id,
          cashier_id: params.cashier_id,
          payment_method: params.payment_method,
        }}
      />
    </div>
  );
}
