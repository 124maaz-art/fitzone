"use client";

import { useState, useTransition } from "react";
import { Search, Eye, Mail, MailOpen, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { toggleInquiryRead, deleteInquiry } from "@/lib/admin-actions";
import { formatDateTime } from "@/lib/utils";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: boolean;
  createdAt: string;
};

export function InquiriesManager({ inquiries }: { inquiries: Inquiry[] }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [toDelete, setToDelete] = useState<Inquiry | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = inquiries.filter((i) =>
    `${i.name} ${i.email} ${i.subject}`.toLowerCase().includes(search.toLowerCase())
  );

  function toggle(i: Inquiry) {
    startTransition(async () => {
      const res = await toggleInquiryRead(i.id, !i.status);
      if (res?.success) {
        toast.success(i.status ? "Marked as unread." : "Marked as read.");
      } else {
        toast.error(res?.error ?? "Unable to update inquiry.");
      }
    });
  }

  function onDelete() {
    if (!toDelete) return;
    startTransition(async () => {
      const res = await deleteInquiry(toDelete.id);
      setToDelete(null);
      if (res?.success) toast.success("Inquiry deleted.");
      else toast.error(res?.error ?? "Unable to delete inquiry.");
    });
  }

  return (
    <div>
      <div className="mb-5">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input className="pl-9" placeholder="Search inquiries..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No inquiries found" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inquiry) => (
                <tr key={inquiry.id} className={`border-b border-border/50 last:border-0 ${!inquiry.status ? "bg-accent/5" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{inquiry.name}</div>
                    <div className="text-xs text-muted">{inquiry.email}</div>
                  </td>
                  <td className="px-4 py-3">{inquiry.subject}</td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(inquiry.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${inquiry.status ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>
                      {inquiry.status ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelected(inquiry)} aria-label="View"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => toggle(inquiry)} aria-label="Toggle read">{inquiry.status ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}</Button>
                      <Button variant="ghost" size="icon" className="text-red-400" onClick={() => setToDelete(inquiry)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <Modal open onClose={() => setSelected(null)} title="Inquiry">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted">From</span><span className="font-semibold">{selected.name} ({selected.email})</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted">Phone</span><span>{selected.phone ?? "-"}</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted">Subject</span><span>{selected.subject}</span>
            </div>
            <div className="border-b border-border/50 pb-2"><span className="text-muted">Message</span><p className="mt-1 leading-relaxed text-foreground">{selected.message}</p></div>
          </div>
        </Modal>
      )}

      <ConfirmDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={onDelete} title="Delete this inquiry?" confirmLabel="Delete" loading={isPending} />
    </div>
  );
}
