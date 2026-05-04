import { ApplicationStatus } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const variantMap: Record<ApplicationStatus, "default" | "info" | "warning" | "danger" | "success"> = {
  DRAFT: "default",
  SENT: "info",
  INTERVIEW: "warning",
  REJECTED: "danger",
  OFFER: "success",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={variantMap[status]}>{STATUS_LABELS[status]}</Badge>;
}
