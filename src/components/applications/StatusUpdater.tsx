"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApplicationStatus } from "@prisma/client";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { STATUS_LABELS } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";

const STATUS_OPTIONS = (Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((s) => ({
  value: s,
  label: STATUS_LABELS[s],
}));

interface StatusUpdaterProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

export function StatusUpdater({ applicationId, currentStatus }: StatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const changed = status !== currentStatus;

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="flex items-end gap-3 p-5">
        <Select
          id="status"
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
          className="flex-1"
        />
        <Button onClick={handleSave} loading={loading} disabled={!changed}>
          Update status
        </Button>
      </CardContent>
    </Card>
  );
}
