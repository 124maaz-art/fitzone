"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Plus, Search, Pencil, Trash2, CalendarRange } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Textarea, Label, FieldError } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { SmartImage } from "@/components/ui/smart-image";
import { ImageUpload } from "./image-upload";
import { upsertTrainer, deleteTrainer, saveTrainerAvailability } from "@/lib/admin-actions";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type Trainer = {
  id: string;
  name: string;
  image?: string | null;
  active: boolean;
  specializations: string[];
  availabilities: { day: number; available: boolean; startTime?: string | null; endTime?: string | null }[];
};

export function TrainerManager({ trainers }: { trainers: Trainer[] }) {
  const [search, setSearch] = React.useState("");
  const [editing, setEditing] = React.useState<Trainer | "new" | null>(null);
  const [availTrainer, setAvailTrainer] = React.useState<Trainer | null>(null);
  const [toDelete, setToDelete] = React.useState<Trainer | null>(null);
  const [imageUrl, setImageUrl] = React.useState("");
  const [specs, setSpecs] = React.useState<string[]>([]);
  const [certs, setCerts] = React.useState<string[]>([]);
  const [avail, setAvail] = React.useState<{ day: number; start: string; end: string; available: boolean }[]>(
    DAYS.map((_, day) => ({ day, start: "07:00", end: "22:00", available: true }))
  );
  const [isPending, startTransition] = React.useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", bio: "", experience: 0, availability: "", active: true },
  });

  const filtered = trainers.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  function openNew() {
    setSpecs([]);
    setCerts([]);
    setImageUrl("");
    reset({ name: "", bio: "", experience: 0, availability: "", active: true });
    setEditing("new");
  }

  function openEdit(t: Trainer) {
    setSpecs(t.specializations ?? []);
    setImageUrl(t.image ?? "");
    const full = (trainers as any[]).find((x) => x.id === t.id);
    setCerts(full?.certifications ?? []);
    reset({ name: t.name, bio: full?.bio ?? "", experience: Number(full?.experience ?? 0) || 0, availability: full?.availability ?? "", active: full?.active ?? t.active });
    setEditing(t);
  }

  function openAvail(t: Trainer) {
    const map = Object.fromEntries((t.availabilities ?? []).map((a) => [a.day, a]));
    setAvail(
      DAYS.map((_, day) => ({
        day,
        start: map[day]?.startTime ?? "07:00",
        end: map[day]?.endTime ?? "22:00",
        available: map[day] ? map[day].available : true,
      }))
    );
    setAvailTrainer(t);
  }

  function onSave(data: any) {
    startTransition(async () => {
      const payload = {
        ...data,
        experience: Number(data.experience) || 0,
        image: imageUrl,
        specializations: specs,
        certifications: certs,
        active: !!data.active,
      };
      const res = await upsertTrainer(payload, editing === "new" ? undefined : (editing as Trainer).id);
      if (res?.success) {
        toast.success(editing === "new" ? "Trainer created successfully." : "Trainer updated successfully.");
        setEditing(null);
      } else toast.error(res?.error ?? "Unable to save trainer.");
    });
  }

  function onSaveAvailability() {
    if (!availTrainer) return;
    startTransition(async () => {
      const slots = avail.map((a) => ({ day: a.day, available: a.available, startTime: a.start, endTime: a.end }));
      const res = await saveTrainerAvailability(availTrainer.id, slots);
      if (res?.success) {
        toast.success("Availability updated.");
        setAvailTrainer(null);
      } else toast.error(res?.error ?? "Unable to save availability.");
    });
  }

  function onDelete() {
    if (!toDelete) return;
    startTransition(async () => {
      const res = await deleteTrainer(toDelete.id);
      setToDelete(null);
      if (res?.success) toast.success("Trainer deleted.");
      else toast.error(res?.error ?? "Delete failed");
    });
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input className="pl-9" placeholder="Search trainers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={openNew} className="rounded-full">
          <Plus className="h-4 w-4" /> Add Trainer
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No trainers found" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Trainer</th>
                <th className="px-4 py-3">Specializations</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <SmartImage src={t.image} alt={t.name} width={40} height={40} className="h-full w-full object-cover" />
                      </div>
                      <span className="font-semibold">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{t.specializations?.slice(0, 2).join(", ")}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${t.active ? "bg-green-500/15 text-green-400" : "bg-zinc-500/15 text-zinc-400"}`}>{t.active ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openAvail(t)} aria-label="Availability"><CalendarRange className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-400" onClick={() => setToDelete(t)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === "new" ? "Add Trainer" : "Edit Trainer"}>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <Label htmlFor="tr-name" required>Name</Label>
            <Input id="tr-name" {...register("name", { required: "Name is required" })} />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <Label>Photo</Label>
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>
          <div>
            <Label htmlFor="tr-bio">Bio</Label>
            <Textarea id="tr-bio" {...register("bio")} />
          </div>
          <div>
            <Label htmlFor="tr-exp">Experience (years)</Label>
            <Input id="tr-exp" type="number" {...register("experience")} />
          </div>
          <div>
            <Label>Specializations (one per line)</Label>
            <Textarea value={specs.join("\n")} onChange={(e) => setSpecs(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} placeholder="Strength Coach&#10;HIIT" />
          </div>
          <div>
            <Label>Certifications (one per line)</Label>
            <Textarea value={certs.join("\n")} onChange={(e) => setCerts(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} placeholder="ACE Certified&#10;NASM" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("active")} className="h-4 w-4 rounded border-border bg-white/5 accent-[var(--accent)]" />
            Active
          </label>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!availTrainer} onClose={() => setAvailTrainer(null)} title={`Availability - ${availTrainer?.name}`}>
        <div className="space-y-3">
          {avail.map((slot, i) => (
            <div key={slot.day} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-white/5 p-3">
              <label className="flex w-full items-center gap-2 text-sm font-semibold sm:w-28">
                <input type="checkbox" checked={slot.available} onChange={(e) => setAvail((p) => p.map((a, idx) => idx === i ? { ...a, available: e.target.checked } : a))} className="h-4 w-4 accent-[var(--accent)]" />
                {DAYS[slot.day]}
              </label>
              <div className="flex items-center gap-2">
                <Input type="time" value={slot.start} disabled={!slot.available} onChange={(e) => setAvail((p) => p.map((a, idx) => idx === i ? { ...a, start: e.target.value } : a))} className="w-32" />
                <span className="text-muted">to</span>
                <Input type="time" value={slot.end} disabled={!slot.available} onChange={(e) => setAvail((p) => p.map((a, idx) => idx === i ? { ...a, end: e.target.value } : a))} className="w-32" />
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setAvailTrainer(null)}>Cancel</Button>
            <Button onClick={onSaveAvailability} disabled={isPending}>{isPending ? "Saving..." : "Save Availability"}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={onDelete} title="Delete this trainer?" confirmLabel="Delete" loading={isPending} />
    </div>
  );
}
