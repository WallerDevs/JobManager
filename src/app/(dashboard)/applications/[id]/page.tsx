import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { CommentSection } from "@/components/applications/CommentSection";
import { StatusUpdater } from "@/components/applications/StatusUpdater";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const application = await prisma.application.findFirst({
    where: { id, userId: session!.user.id },
    include: {
      comments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!application) notFound();

  return (
    <DashboardShell title={`${application.companyName} — ${application.jobTitle}`}>
      <div className="mx-auto max-w-3xl flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{application.jobTitle}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{application.companyName}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={application.status} />
            <Link href={`/applications/${application.id}/edit`}>
              <Button variant="secondary" size="sm">Edit</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {application.location && (
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="mt-0.5 text-sm text-gray-900">{application.location}</p>
              </div>
            )}
            {application.salary && (
              <div>
                <p className="text-xs text-gray-400">Salary</p>
                <p className="mt-0.5 text-sm text-gray-900">{application.salary}</p>
              </div>
            )}
            {application.appliedAt && (
              <div>
                <p className="text-xs text-gray-400">Applied</p>
                <p className="mt-0.5 text-sm text-gray-900">{formatDate(application.appliedAt)}</p>
              </div>
            )}
            {application.jobUrl && (
              <div className="col-span-2 sm:col-span-3">
                <p className="text-xs text-gray-400">Job URL</p>
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block truncate text-sm text-brand-600 hover:underline"
                >
                  {application.jobUrl}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <StatusUpdater applicationId={application.id} currentStatus={application.status} />

        {application.description && (
          <Card>
            <CardContent className="p-5">
              <h3 className="mb-2 text-sm font-medium text-gray-700">Description / Notes</h3>
              <p className="whitespace-pre-wrap text-sm text-gray-600">{application.description}</p>
            </CardContent>
          </Card>
        )}

        <CommentSection applicationId={application.id} comments={application.comments} />
      </div>
    </DashboardShell>
  );
}
