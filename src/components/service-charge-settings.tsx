"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateTenantSettings } from "@/hooks/use-update-tenant-settings";

export function ServiceChargeSettings({
  currentPercentage,
}: {
  currentPercentage: number;
}) {
  const router = useRouter();
  const updateSettings = useUpdateTenantSettings();
  const [value, setValue] = useState(String(currentPercentage));

  function handleSubmit() {
    updateSettings.mutate(
      { settings: { service_charge_percentage: Number(value) } },
      {
        onSuccess: () => {
          toast.success("Service charge updated");
          router.refresh();
        },
      },
    );
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 max-w-sm">
      <div>
        <h2 className="text-sm font-medium">Service Charge</h2>
        <p className="text-xs text-muted-foreground">
          Applied automatically to every order payment, alongside 11% VAT
          (fixed, not editable here).
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_charge">Percentage (%)</Label>
        <Input
          id="service_charge"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      {updateSettings.isError && (
        <p className="text-sm text-destructive">
          {updateSettings.error.message}
        </p>
      )}

      <Button onClick={handleSubmit} disabled={updateSettings.isPending}>
        {updateSettings.isPending ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
