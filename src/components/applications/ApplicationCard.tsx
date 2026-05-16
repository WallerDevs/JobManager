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
  DRAFT:     "bg-gradient-to-r from-gray-500/60 to-gray-600/40",
  SENT:      "bg-gradient-to-r from-blue-400/80 to-blue-500/50",
  INTERVIEW: "bg-gradient-to-r from-amber-400/80 to-amber-500/50",
  OFFER:     "bg-gradient-to-r from-emerald-400/90 to-emerald-500/60",
  REJECTED:  "bg-gradient-to-r from-red-500/80 to-red-600/50",
};

const STATUS_BORDER: Record<ApplicationStatus, string> = {
  DRAFT:     "border-white/[0.06] hover:border-gray-500/20",
  SENT:      "border-white/[0.06] hover:border-blue-500/20",
  INTERVIEW: "border-white/[0.06] hover:border-amber-500/20",
  OFFER:     "border-white/[0.06] hover:border-emerald-500/25",
  REJECTED:  "border-white/[0.06] hover:border-red-500/20",
};

const STATUS_SPOTLIGHT: Record<ApplicationStatus, string> = {
  DRAFT:     "rgba(156,163,175,0.06)",
  SENT:      "rgba(96,165,250,0.06)",
  INTERVIEW: "rgba(251,191,36,0.06)",
  OFFER:     "rgba(52,211,153,0.07)",
  REJECTED:  "rgba(248,113,113,0.06)",
};

const AVATAR_COLORS: Record<ApplicationStatus, string> = {
  DRAFT:     "bg-gray-800/60 text-gray-400 ring-gray-600/20",
  SENT:      "bg-blue-900/40 text-blue-300 ring-blue-500/20",
  INTERVIEW: "bg-amber-900/40 text-amber-300 ring-amber-500/20",
  OFFER:     "bg-emerald-900/40 text-emerald-300 ring-emerald-500/25",
  REJECTED:  "bg-red-900/40 text-red-300 ring-red-500/20",
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
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className={`group relative overflow-hidden rounded-xl border bg-white/[0.025] cursor-pointer transition-all duration-200 hover:bg-white/[0.04] ${STATUS_BORDER[application.status]}`}
      >
        {/* Status top bar */}
        <div className={`absolute inset-x-0 top-0 h-[2px] ${STATUS_TOP[application.status]}`} />

        {/* Mouse-tracking spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
          style={{
            opacity: spotlight.visible ? 1 : 0,
            background: `radial-gradient(240px circle at ${spotlight.x}px ${spotlight.y}px, ${STATUS_SPOTLIGHT[application.status]}, transparent 70%)`,
          }}
        />

        <div className="relative px-4 pt-5 pb-4">
          {/* Header row */}
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-sm font-semibold italic ring-1 transition-transform duration-200 group-hover:scale-105 ${AVATAR_COLORS[application.status]}`}>
              {application.companyName[0]?.toUpperCase() ?? "?"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight text-gray-100 group-hover:text-white transition-colors duration-150">
                {application.companyName}
              </p>
              <p className="mt-0.5 truncate font-mono text-[11px] text-gray-600">{application.jobTitle}</p>
            </div>

            {/* Badge + delete */}
            <div className="flex shrink-0 items-center gap-1.5">
              <StatusBadge status={application.status} />
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`hidden h-6 w-6 items-center justify-center rounded-md text-xs font-medium transition-colors cursor-pointer group-hover:flex ${
                  confirmDelete
                    ? "bg-red-950/50 text-red-400"
                    : "text-gray-700 hover:bg-red-950/30 hover:text-red-400"
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

          {/* Footer row */}
          <div className="mt-3 flex items-center justify-between">
            <p className="font-mono text-[10px] text-gray-700">
              {application.appliedAt
                ? `Applied ${formatDate(application.appliedAt)}`
                : `Added ${formatDate(application.createdAt)}`}
            </p>
            <div className="flex items-center gap-1.5">
              {confirmDelete && (
                <motion.span
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-[9px] font-medium uppercase tracking-wide text-red-400"
                >
                  Confirm?
                </motion.span>
              )}
              <svg className="h-3.5 w-3.5 text-gray-700 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
