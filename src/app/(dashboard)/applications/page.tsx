import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ApplicationsClient } from "@/components/applications/ApplicationsClient";

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions);

  const raw = await prisma.application.findMany({
    where: { userId: session!.user.id },
    select: { id: true, companyName: true, jobTitle: true, status: true, appliedAt: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const applications = raw.map((a) => ({
    ...a,
    appliedAt: a.appliedAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <DashboardShell title="Applications">
      <ApplicationsClient applications={applications} />
    </DashboardShell>
  );
}
