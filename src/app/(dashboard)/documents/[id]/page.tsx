import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DocumentForm } from "@/components/documents/DocumentForm";
import { Card, CardContent } from "@/components/ui/Card";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DocumentDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const document = await prisma.document.findFirst({
    where: { id, userId: session!.user.id },
  });

  if (!document) notFound();

  return (
    <DashboardShell title={document.title}>
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardContent className="p-6">
            <DocumentForm
              documentId={document.id}
              initialValues={{
                type: document.type,
                title: document.title,
                content: document.content,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
