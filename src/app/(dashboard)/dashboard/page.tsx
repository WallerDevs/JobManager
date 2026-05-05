import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { ApplicationStatus } from "@prisma/client";
import { STATUS_LABELS } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const STATUS_GRADIENTS: Record<ApplicationStatus, string> = {
  DRAFT: "from-gray-400 to-gray-500",
  SENT: "from-blue-400 to-blue-600",
  INTERVIEW: "from-amber-400 to-orange-500",
  REJECTED: "from-red-400 to-rose-600",
  OFFER: "from-emerald-400 to-green-600",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [applications, statusCounts] = await Promise.all([
    prisma.application.findMany({
      where: { userId },
      select: { id: true, companyName: true, jobTitle: true, status: true, appliedAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    }),
  ]);

  const countsByStatus = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count._all])
  ) as Partial<Record<ApplicationStatus, number>>;

  const total = statusCounts.reduce((sum, s) => sum + s._count._all, 0);
  const statuses: ApplicationStatus[] = ["DRAFT", "SENT", "INTERVIEW", "OFFER", "REJECTED"];

  return (
    <DashboardShell title="Dashboard">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {statuses.map((status) => (
            <div
              key={status}
              className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-card"
            >
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${STATUS_GRADIENTS[status]}`} />
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {STATUS_LABELS[status]}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {countsByStatus[status] ?? 0}
              </p>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Recent applications</h2>
              <p className="text-xs text-gray-400">{total} total</p>
            </div>
            <Link href="/applications">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">No applications yet</p>
              <p className="mt-1 text-xs text-gray-400">Add your first one to get started</p>
              <Link href="/applications/new" className="mt-4 inline-block">
                <Button size="sm">New application</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={{
                  ...app,
                  appliedAt: app.appliedAt ? app.appliedAt.toISOString() : null,
                  createdAt: app.createdAt.toISOString(),
                }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
