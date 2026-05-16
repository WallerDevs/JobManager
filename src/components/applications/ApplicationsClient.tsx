"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ApplicationStatus } from "@prisma/client";
import { SerializedApplicationSummary } from "@/types";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { Button } from "@/components/ui/Button";
import { AnimatedGrid, AnimatedItem } from "@/components/ui/AnimatedGrid";
import { STATUS_LABELS } from "@/lib/utils";

const ALL_STATUSES: ApplicationStatus[] = ["DRAFT", "SENT", "INTERVIEW", "OFFER", "REJECTED"];

const STATUS_DOT: Record<ApplicationStatus, string> = {
  DRAFT:     "bg-gray-400",
  SENT:      "bg-blue-400",
  INTERVIEW: "bg-amber-400",
  OFFER:     "bg-emerald-400",
  REJECTED:  "bg-red-400",
};

interface ApplicationsClientProps {
  applications: SerializedApplicationSummary[];
}

export function ApplicationsClient({ applications }: ApplicationsClientProps) {
  const [activeStatus, setActiveStatus] = useState<ApplicationStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return applications.filter((app) => {
      const matchesStatus = activeStatus === "ALL" || app.status === activeStatus;
      const matchesSearch =
        !q ||
        app.companyName.toLowerCase().includes(q) ||
        app.jobTitle.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [applications, activeStatus, search]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: applications.length };
    for (const s of ALL_STATUSES) {
      map[s] = applications.filter((a) => a.status === s).length;
    }
    return map;
  }, [applications]);

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/[0.07] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder:text-gray-700 transition-all duration-150 focus:border-emerald-500/40 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-emerald-500/25"
          />
        </div>
        <Link href="/applications/new">
          <Button>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New application
          </Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex w-fit flex-wrap items-center gap-0.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
        {(["ALL", ...ALL_STATUSES] as const).map((status) => {
          const isActive = activeStatus === status;
          const count = counts[status];
          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className="relative flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-white/[0.07]"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              {status !== "ALL" && (
                <span className={`relative z-10 h-1.5 w-1.5 rounded-full ${STATUS_DOT[status as ApplicationStatus]}`} />
              )}
              <span className={`relative z-10 transition-colors ${isActive ? "text-gray-100" : "text-gray-600 hover:text-gray-400"}`}>
                {status === "ALL" ? "All" : STATUS_LABELS[status as ApplicationStatus]}
              </span>
              <span className={`relative z-10 font-mono rounded px-1.5 py-0.5 text-[9px] font-medium tabular-nums transition-colors ${
                isActive ? "bg-white/[0.1] text-gray-300" : "bg-white/[0.03] text-gray-700"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeStatus}-${search}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-14 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
              >
                <img src="/logo.png" width={48} height={48} alt="JobManager" className="rounded-xl opacity-60" />
              </motion.div>
              <div>
                <p className="font-display text-lg italic font-semibold text-gray-200">
                  {applications.length === 0 ? "No applications yet" : "No results"}
                </p>
                <p className="mt-1 font-mono text-[11px] text-gray-600">
                  {applications.length === 0
                    ? "Track every role you apply to in one place."
                    : "Try a different search or filter."}
                </p>
              </div>
              {applications.length === 0 && (
                <Link href="/applications/new">
                  <Button>New application</Button>
                </Link>
              )}
            </div>
          ) : (
            <AnimatedGrid className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((app) => (
                <AnimatedItem key={app.id}>
                  <ApplicationCard application={app} />
                </AnimatedItem>
              ))}
            </AnimatedGrid>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
