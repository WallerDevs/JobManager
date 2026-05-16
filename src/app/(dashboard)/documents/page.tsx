import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DocumentsClient } from "@/components/documents/DocumentsClient";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);

  const documents = await prisma.document.findMany({
    where: { userId: session!.user.id },
    select: { id: true, type: true, title: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const serialized = documents.map((d) => ({
    ...d,
    updatedAt: d.updatedAt.toISOString(),
  }));

  return (
    <DashboardShell title="Documents">
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Link href="/documents/new">
            <Button>New document</Button>
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/[0.08] ring-1 ring-emerald-500/20">
              <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="font-display text-lg font-semibold italic text-gray-200">No documents yet</p>
              <p className="mt-1 font-mono text-[11px] text-gray-600">
                Create a CV or cover letter to get started.
              </p>
            </div>
            <Link href="/documents/new">
              <Button size="sm">New document</Button>
            </Link>
          </div>
        ) : (
          <DocumentsClient documents={serialized} />
        )}
      </div>
    </DashboardShell>
  );
}
