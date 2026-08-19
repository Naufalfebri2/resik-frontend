import { getSections } from "@/lib/sections";
import { getShifts } from "@/lib/shifts";
import { SectionTabs } from "@/components/section-tabs";
import { SectionActions } from "@/components/section-actions";
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
        <div className="flex items-center gap-3">
          <SectionTabs
            sections={sections}
            outletId={outletId}
            selectedSectionId={activeSectionId}
          />
          <SectionActions
            section={sections.find((s) => s.id === activeSectionId)}
            outletId={outletId}
          />
        </div>
        {activeSectionId && <CreateShiftDialog sectionId={activeSectionId} />}
      </div>
      <ShiftTable shifts={shifts} />
    </div>
  );
}
