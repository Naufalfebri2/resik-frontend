"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Section } from "@/types/inventory";

export function SectionTabs({
  sections,
  outletId,
  selectedSectionId,
}: {
  sections: Section[];
  outletId: string;
  selectedSectionId: string | undefined;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildHref(sectionId: string) {
    const params = new URLSearchParams(searchParams);
    params.set("outlet", outletId);
    params.set("section", sectionId);
    return `${pathname}?${params.toString()}`;
  }

  if (sections.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No sections found for this outlet.
      </p>
    );
  }

  return (
    <div className="flex gap-1 border-b">
      {sections.map((section) => {
        const isActive = section.id === selectedSectionId;
        return (
          <Link
            key={section.id}
            href={buildHref(section.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {section.name}
          </Link>
        );
      })}
    </div>
  );
}
