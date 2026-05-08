"use client";

import { AnimatedGrid, AnimatedItem } from "@/components/ui/AnimatedGrid";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { SerializedDocumentSummary } from "@/types";

interface DocumentsClientProps {
  documents: SerializedDocumentSummary[];
}

export function DocumentsClient({ documents }: DocumentsClientProps) {
  return (
    <AnimatedGrid className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <AnimatedItem key={doc.id}>
          <DocumentCard document={doc} />
        </AnimatedItem>
      ))}
    </AnimatedGrid>
  );
}
