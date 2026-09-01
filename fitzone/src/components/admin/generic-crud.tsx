"use client";

import * as React from "react";
import { Plus, Search, Pencil, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Textarea, Label, Select, FieldError } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "./image-upload";

export type CrudField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "array" | "image" | "checkbox" | "stars";
  options?: { value: string; label: string }[];
  placeholder?: string;
};

type CrudRecord = { id: string } & Record<string, any>;

export function GenericCrud({
  title,
  items,
  fields,
  saveFn,
  deleteFn,
}: {
  title: string;
  items: CrudRecord[];
  fields: CrudField[];
  saveFn: (input: any, id?: string) => Promise<{ success?: boolean; error?: string }>;
  deleteFn: (id: string) => Promise<{ success?: boolean; error?: string }>;
}) {
  const [search, setSearch] = React.useState("");
  const [editing, setEditing] = React.useState<CrudRecord | "new" | null>(null);
  const [toDelete, setToDelete] = React.useState<CrudRecord | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [values, setValues] = React.useState<Record<string, any>>({});
  const [arrays, setArrays] = React.useState<Record<string, string[]>>({});
  const [isPending, startTransition] = React.useTransition();

  const filtered = items.filter((i) => String(i[fields[0]?.name] ?? "").toLowerCase().includes(search.toLowerCase()));

  function openNew() {
    const v: Record<string, any> = {};
    const a: Record<string, string[]> = {};
    fields.forEach((f) => {
      if (f.type === "array") a[f.name] = [];
      else if (f.type === "checkbox") v[f.name] = false;
      else if (f.type === "stars") v[f.name] = 5;
      else if (f.type === "number") v[f.name] = 0;
      else v[f.name] = "";
    });
    setValues(v);
    setArrays(a);
    setErrors({});
    setEditing("new");
  }

  function openEdit(item: CrudRecord) {
    const v: Record<string, any> = {};
    const a: Record<string, string[]> = {};
    fields.forEach((f) => {
      if (f.type === "array") a[f.name] = item[f.name] ?? [];
      else v[f.name] = item[f.name] !== undefined && item[f.name] !== null ? item[f.name] : (f.type === "checkbox" ? false : "");
    });
    setValues(v);
    setArrays(a);
    setErrors({});
    setEditing(item);
  }

  function set(name: string, val: any) {
    setValues((p) => ({ ...p, [name]: val }));
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    const input = { ...values };
    fields.forEach((f) => {
      if (f.type === "array") input[f.name] = arrays[f.name] ?? [];
    });
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.type === "text" || f.type === "textarea") {
        if (f.label.includes("*") && !String(input[f.name] ?? "").trim()) errs[f.name] = "Required";
      }
      if (f.type === "image" && (f.label.includes("*") || f.name.includes("Image")) && !String(input[f.name] ?? "").trim()) {
        errs[f.name] = "Required";
      }
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    startTransition(async () => {
      const res = await saveFn(input, editing === "new" ? undefined : (editing as CrudRecord).id);
      if (res?.success) {
        toast.success(editing === "new" ? `${title} created successfully.` : `${title} updated successfully.`);
        setEditing(null);
      } else {
        toast.error(res?.error ?? `Unable to save ${title.toLowerCase()}.`);
      }
    });
  }

  function onDelete() {
    if (!toDelete) return;
    startTransition(async () => {
      const res = await deleteFn(toDelete.id);
      setToDelete(null);
      if (res?.success) toast.success(`${title} deleted.`);
      else toast.error(res?.error ?? "Delete failed");
    });
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input className="pl-9" placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={openNew} className="rounded-full">
          <Plus className="h-4 w-4" /> Add {title.replace(/s$/, "")}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} found`} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3 font-semibold">{item.name ?? item.memberName ?? item.title}</td>
                  <td className="px-4 py-3 text-muted">{item._extra ?? ""}</td>
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

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === "new" ? `Add ${title.replace(/s$/, "")}` : `Edit ${title.replace(/s$/, "")}`}>
        <form onSubmit={onSave} className="space-y-4">
          {fields.map((f) => {
            if (f.type === "array") {
              return (
                <div key={f.name}>
                  <Label>{f.label} (one per line)</Label>
                  <Textarea value={(arrays[f.name] ?? []).join("\n")} onChange={(e) => setArrays((p) => ({ ...p, [f.name]: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) }))} placeholder={f.placeholder} />
                </div>
              );
            }
            if (f.type === "select") {
              return (
                <div key={f.name}>
                  <Label>{f.label}</Label>
                  <Select value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)}>
                    <option value="">{f.placeholder ?? "Select..."}</option>
                    {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </div>
              );
            }
            if (f.type === "stars") {
              return (
                <div key={f.name}>
                  <Label>{f.label}</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => set(f.name, n)} aria-label={`${n} stars`}>
                        <Star className={`h-6 w-6 ${(values[f.name] ?? 0) >= n ? "fill-accent text-accent" : "text-zinc-600"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              );
            }
            if (f.type === "checkbox") {
              return (
                <label key={f.name} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!values[f.name]} onChange={(e) => set(f.name, e.target.checked)} className="h-4 w-4 rounded border-border bg-white/5 accent-[var(--accent)]" />
                  {f.label}
                </label>
              );
            }
            if (f.type === "image") {
              return (
                <div key={f.name}>
                  <Label>{f.label}</Label>
                  <ImageUpload value={values[f.name] ?? ""} onChange={(url) => set(f.name, url)} />
                  {errors[f.name] && <FieldError message={errors[f.name]} />}
                </div>
              );
            }
            return (
              <div key={f.name}>
                <Label>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea {...{}} value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} />
                ) : (
                  <Input type={f.type === "number" ? "number" : "text"} step={f.type === "number" ? "0.01" : undefined} value={values[f.name] ?? ""} onChange={(e) => set(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)} placeholder={f.placeholder} />
                )}
                {errors[f.name] && <FieldError message={errors[f.name]} />}
              </div>
            );
          })}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={onDelete} title={`Delete this ${title.replace(/s$/, "").toLowerCase()}?`} confirmLabel="Delete" loading={isPending} />
    </div>
  );
}
