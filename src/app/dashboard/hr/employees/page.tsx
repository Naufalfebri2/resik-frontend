import { getOutlets } from "@/lib/outlets";
import { HrHeader } from "@/components/hr-header";
import { HrEmployeesContent } from "@/components/hr-employees-content";

interface HrEmployeesPageProps {
  searchParams: Promise<{ outlet?: string; section?: string }>;
}

export default async function HrEmployeesPage({
  searchParams,
}: HrEmployeesPageProps) {
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

  return (
    <div className="space-y-6">
      <HrHeader outlets={outlets} selectedOutletId={selectedOutletId} />
      <HrEmployeesContent
        outletId={selectedOutletId}
        selectedSectionId={params.section}
      />
    </div>
  );
}
