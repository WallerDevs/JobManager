import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);

  const documents = await prisma.document.findMany({
    where: { userId: session!.user.id },
    select: { id: true, type: true, title: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <DashboardShell title="Documents">
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Link href="/documents/new">
            <Button>New document</Button>
          </Link>
        </div>

        {documents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-sm text-gray-500">No documents yet. Create a CV or cover letter to get started.</p>
              <Link href="/documents/new">
                <Button>New document</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
