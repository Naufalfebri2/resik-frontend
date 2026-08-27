"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUpdateOutlet } from "@/hooks/use-update-outlet";

export function OutletPickupSettings({
  outletId,
  enabled,
}: {
  outletId: string;
  enabled: boolean;
}) {
  const router = useRouter();
  const updateOutlet = useUpdateOutlet();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState(enabled);
  const [pickupUrl, setPickupUrl] = useState<string | null>(null);

  useEffect(() => {
    // window.location.origin is only available client-side; this effect
    // runs once after mount to populate the customer-facing pickup URL.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPickupUrl(`${window.location.origin}/pickup/${outletId}`);
  }, [outletId]);

  function handleToggle(value: boolean) {
    setChecked(value);

    updateOutlet.mutate(
      { outletId, data: { online_pickup_enabled: value } },
      {
        onSuccess: () => {
          toast.success(
            value ? "Online pickup enabled" : "Online pickup disabled",
          );
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.message);
          setChecked(!value);
        },
      },
    );
  }

  function handleDownload() {
    const canvas = wrapperRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-pickup-${outletId}.png`;
    link.click();
  }

  return (
    <div className="max-w-sm space-y-4 rounded-lg border p-4">
      <div>
        <h2 className="text-sm font-medium">Online Pickup</h2>
        <p className="text-xs text-muted-foreground">
          Let customers place pickup orders themselves via a shared link or QR
          code, without a table.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="online_pickup_enabled"
          checked={checked}
          onCheckedChange={handleToggle}
          disabled={updateOutlet.isPending}
        />
        <Label htmlFor="online_pickup_enabled" className="cursor-pointer">
          Enable online pickup for this outlet
        </Label>
      </div>

      {pickupUrl ? (
        <div className="flex flex-col items-center gap-2 border-t pt-4">
          <div ref={wrapperRef}>
            <QRCodeCanvas value={pickupUrl} size={128} />
          </div>
          <p
            className="max-w-full truncate text-xs text-muted-foreground"
            title={pickupUrl}
          >
            {pickupUrl}
          </p>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="size-3.5" /> Download QR
          </Button>
        </div>
      ) : (
        <div className="h-32 animate-pulse rounded-md bg-muted" />
      )}
    </div>
  );
}
