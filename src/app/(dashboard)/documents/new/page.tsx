import { DashboardShell } from "@/components/layout/DashboardShell";
import { DocumentForm } from "@/components/documents/DocumentForm";
import { Card, CardContent } from "@/components/ui/Card";

export default function NewDocumentPage() {
  return (
    <DashboardShell title="New document">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardContent className="p-6">
            <DocumentForm />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
