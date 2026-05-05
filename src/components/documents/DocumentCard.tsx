"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DocumentSummary } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface DocumentCardProps {
  document: DocumentSummary;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const router = useRouter();
<<<<<<< HEAD
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
=======
>>>>>>> Document–application-linking
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
<<<<<<< HEAD

    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    setDeleting(true);
    const res = await fetch(`/api/documents/${document.id}`, { method: "DELETE" });
    if (res.ok) {
      toast(`Removed "${document.title}"`);
      router.refresh();
    } else {
      toast("Failed to delete document", "error");
      setDeleting(false);
      setConfirmDelete(false);
    }
=======
    if (!confirm(`Delete "${document.title}"?`)) return;

    setDeleting(true);
    await fetch(`/api/documents/${document.id}`, { method: "DELETE" });
    router.refresh();
>>>>>>> Document–application-linking
  }

  return (
    <Link href={`/documents/${document.id}`}>
      <div className="group relative rounded-xl border border-gray-100 bg-white p-3 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
            {document.title}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge variant={document.type === "CV" ? "info" : "default"}>
              {document.type === "CV" ? "CV" : "Cover Letter"}
            </Badge>
            <button
              onClick={handleDelete}
              disabled={deleting}
<<<<<<< HEAD
              className={`hidden group-hover:flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
                confirmDelete
                  ? "bg-red-50 text-red-600"
                  : "text-gray-300 hover:bg-red-50 hover:text-red-500"
              }`}
              aria-label={confirmDelete ? "Confirm delete" : "Delete document"}
            >
              {confirmDelete ? (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
=======
              className="hidden group-hover:flex h-6 w-6 items-center justify-center rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
              aria-label="Delete document"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
>>>>>>> Document–application-linking
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-gray-300" />
          <p className="text-xs text-gray-400">Updated {formatDate(document.updatedAt)}</p>
          {confirmDelete && (
            <span className="ml-auto text-[10px] text-red-500 font-medium animate-fade-in">
              Click again to confirm
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
