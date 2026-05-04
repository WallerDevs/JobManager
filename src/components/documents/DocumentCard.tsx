import Link from "next/link";
import { DocumentSummary } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface DocumentCardProps {
  document: DocumentSummary;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Link href={`/documents/${document.id}`}>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="truncate font-medium text-gray-900">{document.title}</p>
            <Badge variant={document.type === "CV" ? "info" : "default"}>
              {document.type === "CV" ? "CV" : "Cover Letter"}
            </Badge>
          </div>
          <p className="mt-2 text-xs text-gray-400">Updated {formatDate(document.updatedAt)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
