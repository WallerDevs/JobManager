import Link from "next/link";
import { DocumentSummary } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface DocumentCardProps {
  document: DocumentSummary;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Link href={`/documents/${document.id}`}>
      <div className="group rounded-xl border border-gray-100 bg-white p-3 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
            {document.title}
          </p>
          <Badge variant={document.type === "CV" ? "info" : "default"}>
            {document.type === "CV" ? "CV" : "Cover Letter"}
          </Badge>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-gray-300" />
          <p className="text-xs text-gray-400">Updated {formatDate(document.updatedAt)}</p>
        </div>
      </div>
    </Link>
  );
}
