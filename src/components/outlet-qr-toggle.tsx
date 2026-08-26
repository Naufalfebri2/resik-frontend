"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUpdateOutlet } from "@/hooks/use-update-outlet";

export function OutletQrToggle({
  outletId,
  enabled,
}: {
  outletId: string;
  enabled: boolean;
}) {
  const router = useRouter();
  const updateOutlet = useUpdateOutlet();
  const [checked, setChecked] = useState(enabled);

  function handleToggle(value: boolean) {
    setChecked(value);

    updateOutlet.mutate(
      { outletId, data: { qr_ordering_enabled: value } },
      {
        onSuccess: () => {
          toast.success(value ? "QR ordering enabled" : "QR ordering disabled");
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.message);
          setChecked(!value);
        },
      },
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-md border p-3">
      <Switch
        id="qr_ordering_enabled"
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={updateOutlet.isPending}
      />
      <Label htmlFor="qr_ordering_enabled" className="cursor-pointer">
        Enable QR ordering for this outlet
      </Label>
    </div>
  );
}
