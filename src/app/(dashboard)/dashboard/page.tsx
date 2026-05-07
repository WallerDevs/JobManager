import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { ApplicationStatus } from "@prisma/client";
import { StatCards } from "@/components/dashboard/StatCards";
import { AnimatedGrid, AnimatedItem } from "@/components/ui/AnimatedGrid";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

function getGreeting(name: string) {
  const hour = new Date().getHours();
  const period = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = name.split(" ")[0];
  return `${period}, ${firstName}`;
}

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
  const greeting = getGreeting(session!.user.name ?? "there");

  return (
    <DashboardShell title="Dashboard">
      <div className="flex flex-col gap-6">

        {/* Welcome banner */}
        <div className="animate-slide-up">
          <h2 className="text-xl font-bold text-gray-100">
            {greeting}
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {total === 0
              ? "Start tracking your applications below."
              : `${total} application${total !== 1 ? "s" : ""} in your pipeline.`}
          </p>
        </div>

        {/* Animated stat cards with number counters */}
        <StatCards counts={countsByStatus} statuses={statuses} />

        {/* Recent applications */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-100">Recent applications</h3>
              <p className="text-xs text-gray-600">{total} total</p>
            </div>
            <Link href="/applications">
              <Button variant="ghost" size="sm" className="text-gray-500">View all</Button>
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/[0.07] bg-gray-900/50 p-10 flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 ring-1 ring-brand-500/20">
                <svg className="h-7 w-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-100">No applications yet</p>
                <p className="mt-1 text-xs text-gray-500">Add your first one to get started.</p>
              </div>
              <Link href="/applications/new">
                <Button size="sm">New application</Button>
              </Link>
            </div>
          ) : (
            <AnimatedGrid className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <AnimatedItem key={app.id}>
                  <ApplicationCard application={{
                    ...app,
                    appliedAt: app.appliedAt ? app.appliedAt.toISOString() : null,
                    createdAt: app.createdAt.toISOString(),
                  }} />
                </AnimatedItem>
              ))}
            </AnimatedGrid>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
