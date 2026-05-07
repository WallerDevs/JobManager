"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ApplicationStatus } from "@prisma/client";
import { SerializedApplicationSummary } from "@/types";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const STATUS_BAR: Record<ApplicationStatus, string> = {
  DRAFT:     "bg-gray-500",
  SENT:      "bg-blue-500",
  INTERVIEW: "bg-amber-500",
  OFFER:     "bg-emerald-500",
  REJECTED:  "bg-red-500",
};

interface ApplicationCardProps {
  application: SerializedApplicationSummary;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  }

  function handleMouseLeave() {
    setSpotlight((s) => ({ ...s, visible: false }));
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    setDeleting(true);
    const res = await fetch(`/api/applications/${application.id}`, { method: "DELETE" });
    if (res.ok) {
      toast(`Removed ${application.companyName}`);
      router.refresh();
    } else {
      toast("Failed to delete application", "error");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <Link href={`/applications/${application.id}`}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-gray-900 pl-4 pr-3.5 py-4 shadow-card cursor-pointer"
        style={{
          boxShadow: spotlight.visible
            ? `0 0 0 1px rgba(255,255,255,0.09), 0 4px 20px rgba(0,0,0,0.4)`
            : undefined,
        }}
      >
        {/* Status color bar */}
        <div className={`absolute inset-y-0 left-0 w-[3px] rounded-l-xl ${STATUS_BAR[application.status]}`} />

        {/* Mouse-tracking spotlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-xl"
          style={{
            opacity: spotlight.visible ? 1 : 0,
            background: `radial-gradient(220px circle at ${spotlight.x}px ${spotlight.y}px, rgba(99,102,241,0.09), transparent 70%)`,
          }}
        />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-100 transition-colors group-hover:text-brand-400">
              {application.companyName}
            </p>
            <p className="mt-0.5 truncate text-sm text-gray-500">{application.jobTitle}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <StatusBadge status={application.status} />
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`hidden group-hover:flex h-6 w-6 items-center justify-center rounded-md transition-colors text-xs font-medium cursor-pointer ${
                confirmDelete
                  ? "bg-red-950/60 text-red-400"
                  : "text-gray-600 hover:bg-red-950/40 hover:text-red-400"
              }`}
              aria-label={confirmDelete ? "Confirm delete" : "Delete application"}
            >
              {confirmDelete ? (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="relative mt-3 flex items-center gap-2">
          <p className="text-xs text-gray-600">
            {application.appliedAt
              ? `Applied ${formatDate(application.appliedAt)}`
              : `Created ${formatDate(application.createdAt)}`}
          </p>
          {confirmDelete && (
            <motion.span
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-auto text-[10px] text-red-400 font-medium"
            >
              Click again to confirm
            </motion.span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
