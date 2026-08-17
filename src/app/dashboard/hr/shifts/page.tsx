import { getOutlets } from "@/lib/outlets";
import { HrHeader } from "@/components/hr-header";
import { HrShiftsContent } from "@/components/hr-shifts-content";

interface HrShiftsPageProps {
  searchParams: Promise<{ outlet?: string; section?: string }>;
}

export default async function HrShiftsPage({
  searchParams,
}: HrShiftsPageProps) {
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
      <HrShiftsContent
        outletId={selectedOutletId}
        selectedSectionId={params.section}
      />
    </div>
  );
}
