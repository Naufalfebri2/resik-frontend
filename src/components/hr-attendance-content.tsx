import { getSections } from "@/lib/sections";
import { getEmployees } from "@/lib/employees";
import { SectionTabs } from "@/components/section-tabs";
import { SectionActions } from "@/components/section-actions";
import { EmployeeSwitcher } from "@/components/employee-switcher";
import { EmployeeAttendancePanel } from "@/components/employee-attendance-panel";

export async function HrAttendanceContent({
  outletId,
  selectedSectionId,
  selectedEmployeeId,
}: {
  outletId: string;
  selectedSectionId: string | undefined;
  selectedEmployeeId: string | undefined;
}) {
  const sections = await getSections(outletId);
  const activeSectionId = selectedSectionId ?? sections[0]?.id;

  const employees = activeSectionId ? await getEmployees(activeSectionId) : [];

  const activeEmployee =
    employees.find((e) => e.id === selectedEmployeeId) ?? employees[0];

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
        <EmployeeSwitcher
          employees={employees}
          selectedEmployeeId={activeEmployee?.id}
        />
      </div>

      {activeEmployee ? (
        <EmployeeAttendancePanel employee={activeEmployee} />
      ) : (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No employee selected.
        </p>
      )}
    </div>
  );
}
