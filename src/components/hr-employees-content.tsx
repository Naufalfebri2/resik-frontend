import { getSections } from "@/lib/sections";
import { getEmployees } from "@/lib/employees";
import { getCustomFieldDefinitions } from "@/lib/custom-field-definitions";
import { SectionTabs } from "@/components/section-tabs";
import { EmployeeTable } from "@/components/employee-table";
import { CreateEmployeeDialog } from "@/components/create-employee-dialog";

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
        <SectionTabs
          sections={sections}
          outletId={outletId}
          selectedSectionId={activeSectionId}
        />
        {activeSectionId && (
          <CreateEmployeeDialog
            sectionId={activeSectionId}
            customFieldDefinitions={customFieldDefinitions}
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
