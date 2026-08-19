import { getSections } from "@/lib/sections";
import { getEmployees } from "@/lib/employees";
import { getCustomFieldDefinitions } from "@/lib/custom-field-definitions";
import { SectionTabs } from "@/components/section-tabs";
import { EmployeeTable } from "@/components/employee-table";
import { CreateEmployeeDialog } from "@/components/create-employee-dialog";
import { CreateSectionDialog } from "@/components/create-section-dialog";
import { SectionActions } from "@/components/section-actions";

export async function HrEmployeesContent({
  outletId,
  selectedSectionId,
}: {
  outletId: string;
  selectedSectionId: string | undefined;
}) {
  const sections = await getSections(outletId);
  const activeSectionId = selectedSectionId ?? sections[0]?.id;

  const [employees, customFieldDefinitions] = await Promise.all([
    activeSectionId ? getEmployees(activeSectionId) : Promise.resolve([]),
    getCustomFieldDefinitions("employees"),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SectionTabs
            sections={sections}
            outletId={outletId}
            selectedSectionId={activeSectionId}
            showEmployeeCount
          />
          <SectionActions
            section={sections.find((s) => s.id === activeSectionId)}
            outletId={outletId}
          />
          <CreateSectionDialog outletId={outletId} />
        </div>
        {activeSectionId && (
          <CreateEmployeeDialog
            sectionId={activeSectionId}
            customFieldDefinitions={customFieldDefinitions}
            existingRole={employees[0]?.role}
          />
        )}
      </div>
      <EmployeeTable
        employees={employees}
        customFieldDefinitions={customFieldDefinitions}
      />
    </div>
  );
}
