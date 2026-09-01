"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Input, Textarea, Label } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { saveSettings } from "@/lib/admin-actions";

export type SettingsFormValues = Record<string, string>;

export function SettingsForm({ settings }: { settings: SettingsFormValues }) {
  const [values, setValues] = useState(settings);
  const [isPending, startTransition] = useTransition();

  function set(key: string, value: string) {
    setValues((p) => ({ ...p, [key]: value }));
  }

  function onSave() {
    startTransition(async () => {
      const res = await saveSettings(values);
      if (res?.success) toast.success("Settings saved successfully.");
      else toast.error(res?.error ?? "Unable to save settings.");
    });
  }

  const groups: { title: string; description: string; fields: { key: string; label: string; type: "text" | "textarea" }[] }[] = [
    {
      title: "General",
      description: "Basic branding and contact information.",
      fields: [
        { key: "gymName", label: "Gym Name", type: "text" },
        { key: "logo", label: "Logo URL", type: "text" },
        { key: "footerContent", label: "Footer Description", type: "textarea" },
      ],
    },
    {
      title: "Contact",
      description: "How members can reach you.",
      fields: [
        { key: "phone", label: "Phone", type: "text" },
        { key: "email", label: "Email", type: "text" },
        { key: "address", label: "Address", type: "text" },
        { key: "hours", label: "Opening Hours", type: "text" },
      ],
    },
    {
      title: "Hero Section",
      description: "Homepage hero headline and description.",
      fields: [
        { key: "heroTitle", label: "Hero Title", type: "text" },
        { key: "heroDescription", label: "Hero Description", type: "textarea" },
      ],
    },
    {
      title: "Social Links",
      description: "Connect with members on social media.",
      fields: [
        { key: "facebook", label: "Facebook", type: "text" },
        { key: "twitter", label: "Twitter", type: "text" },
        { key: "instagram", label: "Instagram", type: "text" },
        { key: "youtube", label: "YouTube", type: "text" },
      ],
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {groups.map((group) => (
        <div key={group.title} className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold">{group.title}</h2>
          <p className="mb-4 text-sm text-muted">{group.description}</p>
          <div className="space-y-4">
            {group.fields.map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea id={field.key} value={values[field.key] ?? ""} onChange={(e) => set(field.key, e.target.value)} />
                ) : (
                  <Input id={field.key} value={values[field.key] ?? ""} onChange={(e) => set(field.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button onClick={onSave} disabled={isPending}>{isPending ? "Saving..." : "Save Settings"}</Button>
    </div>
  );
}
