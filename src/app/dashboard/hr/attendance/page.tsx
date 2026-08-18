import { getOutlets } from "@/lib/outlets";
import { HrHeader } from "@/components/hr-header";
import { HrAttendanceContent } from "@/components/hr-attendance-content";

interface HrAttendancePageProps {
  searchParams: Promise<{
    outlet?: string;
    section?: string;
    employee?: string;
  }>;
}

export default async function HrAttendancePage({
  searchParams,
}: HrAttendancePageProps) {
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
      <HrAttendanceContent
        outletId={selectedOutletId}
        selectedSectionId={params.section}
        selectedEmployeeId={params.employee}
      />
    </div>
  );
}
