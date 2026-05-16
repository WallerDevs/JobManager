import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { StatusUpdater } from "@/components/applications/StatusUpdater";
import { DocumentAttacher } from "@/components/applications/DocumentAttacher";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const [application, allDocs] = await Promise.all([
    prisma.application.findFirst({
      where: { id, userId: session!.user.id },
      include: {
        documents: {
          include: { document: true },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.document.findMany({
      where: { userId: session!.user.id },
      select: { id: true, title: true, type: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  if (!application) notFound();

  return (
    <DashboardShell title={`${application.companyName} — ${application.jobTitle}`}>
      <div className="mx-auto max-w-3xl flex flex-col gap-5">

        {/* Back link */}
        <Link
          href="/applications"
          className="group inline-flex w-fit items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-gray-600 transition-colors hover:text-gray-400"
        >
          <svg className="h-3 w-3 transition-transform duration-150 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All applications
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.05] pb-5">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-500/60">
              {application.companyName}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold italic tracking-tight text-white">
              {application.jobTitle}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <StatusBadge status={application.status} />
            <Link href={`/applications/${application.id}/edit`}>
              <Button variant="secondary" size="sm">Edit</Button>
            </Link>
          </div>
        </div>

        {/* Info grid */}
        {(application.location || application.salary || application.appliedAt || application.jobUrl) && (
          <Card>
            <CardContent className="p-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
              {application.location && (
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-gray-500">Location</p>
                  <p className="mt-1.5 text-sm text-gray-200">{application.location}</p>
                </div>
              )}
              {application.salary && (
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-gray-500">Salary</p>
                  <p className="mt-1.5 text-sm text-gray-200">{application.salary}</p>
                </div>
              )}
              {application.appliedAt && (
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-gray-500">Applied</p>
                  <p className="mt-1.5 text-sm text-gray-200">{formatDate(application.appliedAt)}</p>
                </div>
              )}
              {application.jobUrl && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-gray-500">Job URL</p>
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 block truncate text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {application.jobUrl}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Status pipeline */}
        <StatusUpdater applicationId={application.id} currentStatus={application.status} />

        {/* Description */}
        {application.description && (
          <Card>
            <CardContent className="p-5">
              <h3 className="mb-3 font-mono text-[10px] font-medium uppercase tracking-wider text-gray-500">
                Notes
              </h3>
              <p className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
                {application.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Documents */}
        <DocumentAttacher
          applicationId={application.id}
          attachedDocs={application.documents}
          allDocs={allDocs}
        />
      </div>
    </DashboardShell>
  );
}
