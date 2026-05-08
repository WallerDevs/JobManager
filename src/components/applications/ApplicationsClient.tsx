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
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative flex-1 max-w-xs">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-700/80 bg-gray-800/80 pl-9 pr-3.5 py-2 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 transition-all duration-150"
          />
        </div>

        <Link href="/applications/new">
          <Button>New application</Button>
        </Link>
      </div>

      {/* Animated filter tabs */}
      <div className="flex items-center gap-0.5 rounded-xl border border-white/[0.06] bg-gray-900/60 p-1 w-fit flex-wrap">
        {(["ALL", ...ALL_STATUSES] as const).map((status) => {
          const isActive = activeStatus === status;
          const count = counts[status];
          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-gray-700/80 shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className={`relative z-10 transition-colors ${isActive ? "text-gray-100" : "text-gray-600 hover:text-gray-400"}`}>
                {status === "ALL" ? "All" : STATUS_LABELS[status]}
              </span>
              <span className={`relative z-10 rounded-full px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
                isActive ? "bg-white/15 text-gray-200" : "bg-gray-800 text-gray-600"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results with AnimatePresence transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeStatus}-${search}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-white/[0.07] bg-gray-900 p-12 flex flex-col items-center gap-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 ring-1 ring-brand-500/20"
              >
                <img src="/logo.png" width={56} height={56} alt="JobManager" className="rounded-2xl opacity-80" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-gray-100">
                  {applications.length === 0 ? "No applications yet" : "No results"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
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
