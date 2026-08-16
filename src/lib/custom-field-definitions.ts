import { apiClient } from "@/lib/api-client";
import type { CustomFieldDefinition } from "@/types/hr";

export async function getCustomFieldDefinitions(
  entityType: "ingredients" | "employees" | "menus",
): Promise<CustomFieldDefinition[]> {
  return apiClient<CustomFieldDefinition[]>(
    `/custom-field-definitions?entity_type=${entityType}`,
  );
}
