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

const STATUS_TOP: Record<ApplicationStatus, string> = {
  DRAFT:     "bg-gray-500",
  SENT:      "bg-blue-500",
  INTERVIEW: "bg-amber-500",
  OFFER:     "bg-emerald-500",
  REJECTED:  "bg-red-500",
};

const STATUS_SPOTLIGHT: Record<ApplicationStatus, string> = {
  DRAFT:     "rgba(156,163,175,0.07)",
  SENT:      "rgba(96,165,250,0.07)",
  INTERVIEW: "rgba(251,191,36,0.07)",
  OFFER:     "rgba(52,211,153,0.08)",
  REJECTED:  "rgba(248,113,113,0.07)",
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
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm cursor-pointer transition-colors duration-200 hover:border-white/[0.12] hover:bg-white/[0.05]"
      >
        {/* Status top bar */}
        <div className={`absolute inset-x-0 top-0 h-[2px] ${STATUS_TOP[application.status]}`} />

        {/* Mouse-tracking spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: spotlight.visible ? 1 : 0,
            background: `radial-gradient(240px circle at ${spotlight.x}px ${spotlight.y}px, ${STATUS_SPOTLIGHT[application.status]}, transparent 70%)`,
          }}
        />

        <div className="relative px-4 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-100 transition-colors duration-150 group-hover:text-emerald-300">
                {application.companyName}
              </p>
              <p className="mt-0.5 truncate text-xs text-gray-500">{application.jobTitle}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <StatusBadge status={application.status} />
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`hidden h-6 w-6 items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer group-hover:flex ${
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

          <div className="mt-3 flex items-center gap-2">
            <p className="text-[11px] text-gray-600">
              {application.appliedAt
                ? `Applied ${formatDate(application.appliedAt)}`
                : `Created ${formatDate(application.createdAt)}`}
            </p>
            {confirmDelete && (
              <motion.span
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-auto text-[10px] font-medium text-red-400"
              >
                Click again to confirm
              </motion.span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
