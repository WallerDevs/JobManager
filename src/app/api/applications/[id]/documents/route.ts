import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const body = z.object({ documentId: z.string().min(1) });

async function getOwnedApplication(id: string, userId: string) {
  return prisma.application.findFirst({ where: { id, userId } });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const app = await getOwnedApplication(id, session.user.id);
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { documentId } = body.parse(await req.json());

  // Verify the document belongs to the same user
  const doc = await prisma.document.findFirst({ where: { id: documentId, userId: session.user.id } });
  if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  const link = await prisma.applicationDocument.upsert({
    where: { applicationId_documentId: { applicationId: id, documentId } },
    create: { applicationId: id, documentId },
    update: {},
    include: { document: true },
  });

  return NextResponse.json(link, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const app = await getOwnedApplication(id, session.user.id);
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { documentId } = body.parse(await req.json());

  await prisma.applicationDocument.deleteMany({
    where: { applicationId: id, documentId },
  });

  return new NextResponse(null, { status: 204 });
}
