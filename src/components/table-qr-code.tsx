"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegenerateQr } from "@/hooks/use-regenerate-qr";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TableQrCode({
  sectionId,
  tableId,
  tableNumber,
  qrCode,
}: {
  sectionId: string;
  tableId: string;
  tableNumber: string;
  qrCode: string;
}) {
  const router = useRouter();
  const regenerateQr = useRegenerateQr();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [orderUrl, setOrderUrl] = useState<string | null>(null);

  useEffect(() => {
    // window.location.origin is only available client-side; this effect
    // runs once after mount to populate the customer-facing order URL.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderUrl(`${window.location.origin}/order/${qrCode}`);
  }, [qrCode]);

  function handleDownload() {
    const canvas = wrapperRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-table-${tableNumber}.png`;
    link.click();
  }

  function handleRegenerate() {
    regenerateQr.mutate(
      { sectionId, tableId },
      {
        onSuccess: () => {
          toast.success("QR code regenerated");
          router.refresh();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  if (!orderUrl) {
    return <div className="size-24 animate-pulse rounded-md bg-muted" />;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={wrapperRef}>
        <QRCodeCanvas value={orderUrl} size={96} />
      </div>
      <p
        className="max-w-32 truncate text-xs text-muted-foreground"
        title={orderUrl}
      >
        {orderUrl}
      </p>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          disabled={regenerateQr.isPending}
        >
          <RefreshCw className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
