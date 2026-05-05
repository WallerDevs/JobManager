import { DashboardShell } from "@/components/layout/DashboardShell";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { Card, CardContent } from "@/components/ui/Card";

export default function NewApplicationPage() {
  return (
    <DashboardShell title="New application">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="p-6">
            <ApplicationForm />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
