"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateSection } from "@/hooks/use-create-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export function CreateSectionDialog({ outletId }: { outletId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const createSection = useCreateSection();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    createSection.mutate(
      { outletId, name },
      {
        onSuccess: (data) => {
          setOpen(false);
          setName("");
          router.push(`?outlet=${outletId}&section=${data.section.id}`);
          toast.success("Section created successfully");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="size-4" />
          New Section
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Section</DialogTitle>
            <DialogDescription>
              Sections group ingredients by area, e.g. Kitchen, Bar.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-2">
            <Label htmlFor="section_name">Name</Label>
            <Input
              id="section_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kitchen"
              required
            />
            {createSection.isError && (
              <p className="text-sm text-destructive">
                {createSection.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createSection.isPending}>
              {createSection.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
