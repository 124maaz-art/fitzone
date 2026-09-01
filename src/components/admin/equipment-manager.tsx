"use client";

import { useState, useTransition } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Input, Textarea, Label, Select, FieldError } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { SmartImage } from "@/components/ui/smart-image";
import { ImageUpload } from "./image-upload";
import { upsertEquipment, deleteEquipment } from "@/lib/admin-actions";

type Item = {
  id: string;
  name: string;
  image?: string | null;
  category: { name: string };
  active: boolean;
  slug: string;
};

export function EquipmentManager({ items, categories }: { items: Item[]; categories: { id: string; name: string }[] }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Item | null | "new">(null);
  const [toDelete, setToDelete] = useState<Item | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "", slug: "", image: "", categoryId: "", description: "", targetMuscle: "", trainingType: "", active: true,
    },
  });

  function openNew() {
    setFeatures([]);
    setBenefits([]);
    setImageUrl("");
    reset();
    setEditing("new");
  }

  function openEdit(item: Item) {
    const full = (items as any[]).find((x) => x.id === item.id) as any;
    setFeatures(full.features ?? []);
    setBenefits(full.benefits ?? []);
    setImageUrl(full.image ?? "");
    reset({
      name: full.name,
      slug: full.slug,
      image: full.image ?? "",
      categoryId: full.categoryId,
      description: full.description,
      targetMuscle: full.targetMuscle ?? "",
      trainingType: full.trainingType ?? "",
      active: full.active,
    });
    setEditing(item);
  }

  function onSave(data: any) {
    startTransition(async () => {
      const payload = { ...data, features, benefits, image: imageUrl };
      const res = await upsertEquipment(payload, editing === "new" ? undefined : (editing as Item).id);
      if (res?.success) {
        toast.success(editing === "new" ? "Equipment created successfully." : "Equipment updated successfully.");
        setEditing(null);
      } else {
        toast.error(res?.error ?? "Unable to save equipment.");
      }
    });
  }

  function onDelete() {
    if (!toDelete) return;
    startTransition(async () => {
      const res = await deleteEquipment(toDelete.id);
      setToDelete(null);
      if (res?.success) toast.success("Equipment deleted.");
      else toast.error(res?.error ?? "Delete failed");
    });
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input className="pl-9" placeholder="Search equipment..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={openNew} className="rounded-full">
          <Plus className="h-4 w-4" /> Add Equipment
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No equipment found" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg">
                        <SmartImage src={item.image} alt={item.name} width={40} height={40} className="h-full w-full object-cover" />
                      </div>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{item.category.name}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${item.active ? "bg-green-500/15 text-green-400" : "bg-zinc-500/15 text-zinc-400"}`}>
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-400" onClick={() => setToDelete(item)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === "new" ? "Add Equipment" : "Edit Equipment"}>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <Label htmlFor="eq-name" required>Name</Label>
            <Input id="eq-name" {...register("name", { required: "Name is required" })} />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <Label htmlFor="eq-cat" required>Category</Label>
            <Select id="eq-cat" {...register("categoryId", { required: "Category is required" })}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <FieldError message={errors.categoryId?.message} />
          </div>
          <div>
            <Label>Featured Image</Label>
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>
          <div>
            <Label htmlFor="eq-desc" required>Description</Label>
            <Textarea id="eq-desc" {...register("description", { required: "Description is required" })} />
            <FieldError message={errors.description?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="eq-muscle">Target Muscle</Label>
              <Input id="eq-muscle" {...register("targetMuscle")} />
            </div>
            <div>
              <Label htmlFor="eq-type">Training Type</Label>
              <Input id="eq-type" {...register("trainingType")} />
            </div>
          </div>
          <div>
            <Label>Features (one per line)</Label>
            <Textarea value={features.join("\n")} onChange={(e) => setFeatures(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} placeholder="Durable steel frame&#10;Adjustable resistance" />
          </div>
          <div>
            <Label>Benefits (one per line)</Label>
            <Textarea value={benefits.join("\n")} onChange={(e) => setBenefits(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} placeholder="Builds muscle mass&#10;Improves functional strength" />
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

      <ConfirmDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={onDelete} title="Delete this equipment?" confirmLabel="Delete" loading={isPending} />
    </div>
  );
}
