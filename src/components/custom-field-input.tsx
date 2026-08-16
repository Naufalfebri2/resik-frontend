"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomFieldDefinition, CustomFieldValue } from "@/types/hr";

export function CustomFieldInput({
  definition,
  value,
  onChange,
}: {
  definition: CustomFieldDefinition;
  value: CustomFieldValue;
  onChange: (value: CustomFieldValue) => void;
}) {
  const fieldId = `custom-field-${definition.field_name}`;
  const label = definition.is_required
    ? definition.field_name
    : `${definition.field_name} (optional)`;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>

      {definition.field_type === "text" && (
        <Input
          id={fieldId}
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={definition.is_required}
        />
      )}

      {definition.field_type === "number" && (
        <Input
          id={fieldId}
          type="number"
          value={value === null || value === undefined ? "" : String(value)}
          onChange={(e) =>
            onChange(e.target.value === "" ? null : Number(e.target.value))
          }
          required={definition.is_required}
        />
      )}

      {definition.field_type === "date" && (
        <Input
          id={fieldId}
          type="date"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={definition.is_required}
        />
      )}

      {definition.field_type === "boolean" && (
        <Select
          value={value === null || value === undefined ? "" : String(value)}
          onValueChange={(val) => onChange(val === "true")}
        >
          <SelectTrigger id={fieldId}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      )}

      {definition.field_type === "select" && (
        <Select
          value={(value as string) ?? ""}
          onValueChange={(val) => onChange(val)}
        >
          <SelectTrigger id={fieldId}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {(definition.select_options ?? []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
