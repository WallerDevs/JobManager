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
  return { period, firstName, full: `${period}, ${firstName}.` };
}

function getDateString() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
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
  const dateStr = getDateString();

  return (
    <DashboardShell title="Dashboard">
      <div className="flex flex-col gap-7">

        {/* Typographic hero */}
        <div className="animate-slide-up">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between pb-6 border-b border-white/[0.05]">
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-500/60">
                {dateStr}
              </p>
              <h2 className="mt-3 font-display text-5xl font-semibold italic leading-tight tracking-tight text-white sm:text-[3.25rem]">
                {greeting.full}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {total === 0
                  ? "Start tracking your job applications below."
                  : `${total} application${total !== 1 ? "s" : ""} in your pipeline.`}
              </p>
            </div>
            <Link href="/applications/new" className="shrink-0">
              <Button>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New application
              </Button>
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <StatCards counts={countsByStatus} statuses={statuses} />

        {/* Recent applications */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-semibold italic tracking-tight text-gray-100">Recent applications</h3>
              <p className="mt-0.5 font-mono text-[10px] text-gray-700">{total} total</p>
            </div>
            <Link href="/applications">
              <Button variant="ghost" size="sm" className="text-gray-500 text-xs">View all →</Button>
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/[0.06] bg-white/[0.015] p-10 flex flex-col items-center gap-4 text-center">
              <img src="/logo.png" width={48} height={48} alt="JobManager" className="rounded-xl opacity-60" />
              <div>
                <p className="font-display text-lg italic font-semibold text-gray-200">No applications yet</p>
                <p className="mt-1 font-mono text-[11px] text-gray-600">Add your first one to get started.</p>
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
