import Link from "next/link";
import { ApplicationSummary } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { formatDate } from "@/lib/utils";

interface ApplicationCardProps {
  application: ApplicationSummary;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link href={`/applications/${application.id}`}>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">{application.companyName}</p>
              <p className="mt-0.5 truncate text-sm text-gray-500">{application.jobTitle}</p>
            </div>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-3 text-xs text-gray-400">
            {application.appliedAt
              ? `Applied ${formatDate(application.appliedAt)}`
              : `Created ${formatDate(application.createdAt)}`}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
