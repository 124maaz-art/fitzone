"use client";

import { useState } from "react";
import { ImagePlus, Link2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/form";
import { SmartImage } from "@/components/ui/smart-image";

export function ImageUpload({
  value,
  onChange,
  label = "Image",
}: {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [mode, setMode] = useState<"upload" | "url">(value ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  async function handleFile(file: File) {
    if (!cloudName || !uploadPreset) {
      setError("Cloudinary is not configured. Use the URL tab instead.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: form }
      );
      const data = await res.json();
      if (data?.secure_url) {
        onChange(data.secure_url);
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-3 text-sm">
        <span className="font-medium">{label}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-full px-3 py-0.5 text-xs font-semibold ${mode === "upload" ? "bg-accent text-white" : "bg-white/5 text-muted"}`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-full px-3 py-0.5 text-xs font-semibold ${mode === "url" ? "bg-accent text-white" : "bg-white/5 text-muted"}`}
          >
            URL
          </button>
        </div>
        {uploading && <Loader2 className="h-4 w-4 animate-spin text-accent" />}
      </div>

      {mode === "upload" ? (
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-white/5 px-4 py-8 text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground">
          <ImagePlus className="h-5 w-5" />
          Click to upload image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>
      ) : (
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="https://res.cloudinary.com/.../image.jpg"
            className="pl-9"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      {value && (
        <div className="mt-3 h-32 w-full overflow-hidden rounded-lg border border-border">
          <SmartImage src={value} alt="Preview" width={300} height={128} className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}
