"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApplicationSummary } from "@/types";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { formatDate } from "@/lib/utils";

interface ApplicationCardProps {
  application: ApplicationSummary;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Remove application to ${application.companyName}?`)) return;

    setDeleting(true);
    await fetch(`/api/applications/${application.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <Link href={`/applications/${application.id}`}>
      <div className="group relative rounded-xl border border-gray-100 bg-white p-3 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
              {application.companyName}
            </p>
            <p className="mt-0.5 truncate text-sm text-gray-400">{application.jobTitle}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <StatusBadge status={application.status} />
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="hidden group-hover:flex h-6 w-6 items-center justify-center rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
              aria-label="Delete application"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-gray-300" />
          <p className="text-xs text-gray-400">
            {application.appliedAt
              ? `Applied ${formatDate(application.appliedAt)}`
              : `Created ${formatDate(application.createdAt)}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
