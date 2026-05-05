import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ApplicationsClient } from "@/components/applications/ApplicationsClient";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions);

  const applications = await prisma.application.findMany({
    where: { userId: session!.user.id },
    select: { id: true, companyName: true, jobTitle: true, status: true, appliedAt: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const serialized = applications.map((app) => ({
    ...app,
    appliedAt: app.appliedAt ? app.appliedAt.toISOString() : null,
    createdAt: app.createdAt.toISOString(),
  }));

  return (
    <DashboardShell title="Applications">
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <Link href="/applications/new">
            <Button>New application</Button>
          </Link>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-sm text-gray-500">No applications yet. Add your first one to get started.</p>
              <Link href="/applications/new">
                <Button>New application</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <ApplicationsClient applications={serialized} />
        )}
      </div>
    </DashboardShell>
  );
}
