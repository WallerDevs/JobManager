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
  return { period, firstName, full: `${period}, ${firstName}` };
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
      <div className="flex flex-col gap-6">

        {/* Hero welcome banner */}
        <div className="animate-slide-up">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/[0.14] bg-gradient-to-br from-emerald-950/60 via-[#071a0e]/80 to-[#050d07]">
            {/* Radial glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-500/[0.12] blur-[80px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-64 rounded-full bg-teal-500/[0.06] blur-[60px]" />
            {/* Top shimmer line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

            <div className="relative flex flex-col gap-5 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500/70">{dateStr}</p>
                <h2 className="mt-2 text-4xl font-black tracking-tight text-white">{greeting.full}</h2>
                <p className="mt-2 text-sm text-gray-400">
                  {total === 0
                    ? "Start tracking your job applications below."
                    : `You have ${total} application${total !== 1 ? "s" : ""} in your pipeline.`}
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
              <img src="/logo.png" width={56} height={56} alt="JobManager" className="rounded-2xl opacity-80" />
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
