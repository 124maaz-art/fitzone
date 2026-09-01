import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Wrench,
  Package,
  Dumbbell,
  Users,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatCard, Card } from "@/components/admin/admin-components";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function AdminDashboardPage() {
  let totalBookings = 0;
  let pendingBookings = 0;
  let confirmedBookings = 0;
  let upcomingSessions = 0;
  let totalServices = 0;
  let totalPackages = 0;
  let totalEquipment = 0;
  let totalTrainers = 0;
  let recentBookings: Awaited<ReturnType<typeof prisma.booking.findMany>> = [];
  let statusMap: Record<string, number> = {};
  let recentInquiries: Awaited<ReturnType<typeof prisma.inquiry.findMany>> = [];

  try {
    const [tb, pb, cb, us, tsv, tpk, teq, ttr, rb, sc, ri] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CONFIRMED" } }),
      prisma.booking.count({ where: { status: "CONFIRMED", date: { gte: new Date() } } }),
      prisma.service.count({ where: { active: true } }),
      prisma.membershipPackage.count({ where: { active: true } }),
      prisma.equipment.count({ where: { active: true } }),
      prisma.trainer.count({ where: { active: true } }),
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { service: true, package: true, trainer: true },
      }),
      prisma.booking.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    totalBookings = tb;
    pendingBookings = pb;
    confirmedBookings = cb;
    upcomingSessions = us;
    totalServices = tsv;
    totalPackages = tpk;
    totalEquipment = teq;
    totalTrainers = ttr;
    recentBookings = rb;
    statusMap = Object.fromEntries(sc.map((s) => [s.status, s._count._all]));
    recentInquiries = ri;
  } catch (e) {
    /* no DB available - show empty dashboard */
    console.error("Dashboard load error:", e);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Bookings" value={totalBookings} icon={CalendarCheck} />
        <StatCard label="Pending" value={pendingBookings} icon={Clock} accent />
        <StatCard label="Confirmed" value={confirmedBookings} icon={CheckCircle2} />
        <StatCard label="Upcoming Sessions" value={upcomingSessions} icon={Clock} />
        <StatCard label="Services" value={totalServices} icon={Wrench} />
        <StatCard label="Packages" value={totalPackages} icon={Package} />
        <StatCard label="Equipment" value={totalEquipment} icon={Dumbbell} />
        <StatCard label="Trainers" value={totalTrainers} icon={Users} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Bookings</h2>
            <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="pb-3 pr-3">Reference</th>
                  <th className="pb-3 pr-3">Customer</th>
                  <th className="pb-3 pr-3">Date</th>
                  <th className="pb-3 pr-3">Time</th>
                  <th className="pb-3 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr><td colSpan={5} className="py-6 text-center text-muted">No bookings yet.</td></tr>
                ) : (
                  recentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-3 font-semibold text-accent">{b.reference}</td>
                      <td className="py-3 pr-3">{b.fullName}</td>
                      <td className="py-3 pr-3">{formatDate(b.date)}</td>
                      <td className="py-3 pr-3">{b.time}</td>
                      <td className="py-3 pr-3"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-bold">Booking Status</h2>
            <div className="space-y-3">
              {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "REJECTED"].map((s) => {
                const count = statusMap[s] ?? 0;
                const max = Math.max(1, ...Object.values(statusMap));
                return (
                  <div key={s}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-muted">{s}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${(count / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-bold">Recent Inquiries</h2>
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-muted">No inquiries yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentInquiries.map((i) => (
                  <li key={i.id} className="flex items-start gap-3 text-sm">
                    <Inbox className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                    <div>
                      <p className="font-semibold">{i.name} <span className="font-normal text-muted">· {formatDateTime(i.createdAt)}</span></p>
                      <p className="line-clamp-1 text-muted">{i.subject}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
