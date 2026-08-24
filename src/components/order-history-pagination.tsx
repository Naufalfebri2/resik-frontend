import Link from "next/link";
import { cn } from "@/lib/utils";

export function OrderHistoryPagination({
  outletId,
  currentPage,
  lastPage,
  total,
  searchParams,
}: {
  outletId: string;
  currentPage: number;
  lastPage: number;
  total: number;
  searchParams: Record<string, string | undefined>;
}) {
  function buildHref(page: number) {
    const params = new URLSearchParams();
    params.set("outlet", outletId);

    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "outlet" || key === "page") continue;
      if (value) params.set(key, value);
    }

    params.set("page", String(page));

    return `/dashboard/orders/history?${params.toString()}`;
  }

  if (lastPage <= 1) {
    return (
      <p className="text-sm text-muted-foreground">{total} order(s) total</p>
    );
  }

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < lastPage;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{total} order(s) total</p>
      <div className="flex items-center gap-1">
        <PaginationLink
          href={canGoPrev ? buildHref(currentPage - 1) : undefined}
          disabled={!canGoPrev}
        >
          Previous
        </PaginationLink>
        <span className="px-3 text-sm text-muted-foreground">
          Page {currentPage} of {lastPage}
        </span>
        <PaginationLink
          href={canGoNext ? buildHref(currentPage + 1) : undefined}
          disabled={!canGoNext}
        >
          Next
        </PaginationLink>
      </div>
    </div>
  );
}

function PaginationLink({
  href,
  disabled,
  children,
}: {
  href: string | undefined;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const className = cn(
    "rounded-md border px-3 py-1.5 text-sm transition-colors",
    disabled ? "cursor-not-allowed text-muted-foreground/50" : "hover:bg-muted",
  );

  if (disabled || !href) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
