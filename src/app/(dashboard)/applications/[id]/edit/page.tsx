import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { Card, CardContent } from "@/components/ui/Card";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditApplicationPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const application = await prisma.application.findFirst({
    where: { id, userId: session!.user.id },
  });

  if (!application) notFound();

  return (
    <DashboardShell title="Edit application">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="p-6">
            <ApplicationForm
              applicationId={application.id}
              initialValues={{
                companyName: application.companyName,
                jobTitle: application.jobTitle,
                description: application.description ?? "",
                jobUrl: application.jobUrl ?? "",
                location: application.location ?? "",
                salary: application.salary ?? "",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
