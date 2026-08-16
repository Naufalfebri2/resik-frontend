import { redirect } from "next/navigation";

interface HrPageProps {
  searchParams: Promise<{ outlet?: string; section?: string }>;
}

export default async function HrPage({ searchParams }: HrPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.outlet) query.set("outlet", params.outlet);
  if (params.section) query.set("section", params.section);

  const queryString = query.toString();
  redirect(`/dashboard/hr/employees${queryString ? `?${queryString}` : ""}`);
}
