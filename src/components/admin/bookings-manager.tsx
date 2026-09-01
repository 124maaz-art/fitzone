"use client";

import { useState, useTransition } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { updateBookingStatus, deleteBooking } from "@/lib/admin-actions";
import { formatDate, formatDateTime } from "@/lib/utils";

type Booking = {
  id: string;
  reference: string;
  fullName: string;
  phone: string;
  email: string;
  whatsapp?: string | null;
  service?: { name: string } | null;
  package?: { name: string } | null;
  trainer?: { name: string } | null;
  date: string;
  time: string;
  fitnessGoal?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
};

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "REJECTED"];

export function BookingsManager({ bookings }: { bookings: Booking[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [toDelete, setToDelete] = useState<Booking | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch =
      b.fullName.toLowerCase().includes(q) ||
      b.reference.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q);
    const matchesStatus = status === "all" || b.status === status;
    return matchesSearch && matchesStatus;
  });

  function changeStatus(id: string, newStatus: string) {
    startTransition(async () => {
      const res = await updateBookingStatus(id, newStatus);
      if (res?.success) toast.success("Booking status updated.");
      else toast.error(res?.error ?? "Update failed");
    });
  }

  function onDelete() {
    if (!toDelete) return;
    startTransition(async () => {
      const res = await deleteBooking(toDelete.id);
      setToDelete(null);
      if (res?.success) toast.success("Booking deleted.");
      else toast.error(res?.error ?? "Delete failed");
    });
  }

  return (
    <div>
      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input className="pl-9" placeholder="Search by name, reference, email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No bookings found" description="Try adjusting your search or filter." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Trainer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-accent">{b.reference}</td>
                  <td className="px-4 py-3">{b.fullName}<div className="text-xs text-muted">{formatDateTime(b.createdAt)}</div></td>
                  <td className="px-4 py-3">{b.service?.name ?? b.package?.name ?? "-"}</td>
                  <td className="px-4 py-3">{b.trainer?.name ?? "Any"}</td>
                  <td className="px-4 py-3">{formatDate(b.date)}</td>
                  <td className="px-4 py-3">{b.time}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => changeStatus(b.id, e.target.value)}
                      className="rounded-md border border-border bg-white/5 px-2 py-1 text-xs font-medium"
                      aria-label={`Change status for ${b.reference}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelected(b)} aria-label="View details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-400" onClick={() => setToDelete(b)} aria-label="Delete booking">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <Modal open onClose={() => setSelected(null)} title={`Booking ${selected.reference}`}>
          <div className="space-y-3">
            <DetailRow label="Customer" value={selected.fullName} />
            <DetailRow label="Email" value={selected.email} />
            <DetailRow label="Phone" value={selected.phone} />
            <DetailRow label="WhatsApp" value={selected.whatsapp ?? "-"} />
            <DetailRow label="Service" value={selected.service?.name ?? "-"} />
            <DetailRow label="Package" value={selected.package?.name ?? "-"} />
            <DetailRow label="Trainer" value={selected.trainer?.name ?? "Any"} />
            <DetailRow label="Date" value={formatDate(selected.date)} />
            <DetailRow label="Time" value={selected.time} />
            <DetailRow label="Goal" value={selected.fitnessGoal ?? "-"} />
            <DetailRow label="Notes" value={selected.notes ?? "-"} />
            <div className="border-t border-border pt-3">
              <span className="text-sm text-muted">Status: </span>
              <StatusBadge status={selected.status} />
            </div>
            <div className="mt-2">
              <span className="text-sm text-muted">Update status:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <Button key={s} variant={s === selected.status ? "default" : "outline"} size="sm"
                    disabled={isPending}
                    onClick={() => changeStatus(selected.id, s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={onDelete}
        title="Delete this booking?"
        description={`This will permanently delete booking ${toDelete?.reference}.`}
        confirmLabel="Delete"
        loading={isPending}
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/50 pb-2 text-sm last:border-0">
      <span className="shrink-0 text-muted">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
