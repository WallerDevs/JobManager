import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent } from "@/components/ui/Card";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { ApplicationStatus } from "@prisma/client";
import { STATUS_LABELS } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [applications, statusCounts] = await Promise.all([
    prisma.application.findMany({
      where: { userId },
      select: { id: true, companyName: true, jobTitle: true, status: true, appliedAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
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
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {statuses.map((status) => (
            <Card key={status}>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {STATUS_LABELS[status]}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {countsByStatus[status] ?? 0}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent applications</h2>
            <Link href="/applications">
              <Button variant="ghost" size="sm">View all ({total})</Button>
            </Link>
          </div>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-sm text-gray-500">No applications yet.</p>
                <Link href="/applications/new">
                  <Button size="sm">Add your first application</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
