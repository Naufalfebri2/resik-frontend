import { getSections } from "@/lib/sections";
import { getShifts } from "@/lib/shifts";
import { SectionTabs } from "@/components/section-tabs";
import { ShiftTable } from "@/components/shift-table";
import { CreateShiftDialog } from "@/components/create-shift-dialog";

export async function HrShiftsContent({
  outletId,
  selectedSectionId,
}: {
  outletId: string;
  selectedSectionId: string | undefined;
}) {
  const sections = await getSections(outletId);
  const activeSectionId = selectedSectionId ?? sections[0]?.id;

  const shifts = activeSectionId ? await getShifts(activeSectionId) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTabs
          sections={sections}
          outletId={outletId}
          selectedSectionId={activeSectionId}
        />
        {activeSectionId && <CreateShiftDialog sectionId={activeSectionId} />}
      </div>
      <ShiftTable shifts={shifts} />
    </div>
  );
}
