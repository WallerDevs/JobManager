import Link from "next/link";
import { ApplicationSummary } from "@/types";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { formatDate } from "@/lib/utils";

interface ApplicationCardProps {
  application: ApplicationSummary;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link href={`/applications/${application.id}`}>
      <div className="group rounded-xl border border-gray-100 bg-white p-3 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
              {application.companyName}
            </p>
            <p className="mt-0.5 truncate text-sm text-gray-400">{application.jobTitle}</p>
          </div>
          <StatusBadge status={application.status} />
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
