"use client";

import { useState, useMemo } from "react";
import { ApplicationStatus } from "@prisma/client";
import { SerializedApplicationSummary } from "@/types";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { STATUS_LABELS } from "@/lib/utils";

const ALL_STATUSES: ApplicationStatus[] = ["DRAFT", "SENT", "INTERVIEW", "OFFER", "REJECTED"];

interface Props {
  applications: SerializedApplicationSummary[];
}

export function ApplicationsClient({ applications }: Props) {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {(["ALL", ...ALL_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeStatus === s
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s === "ALL" ? "All" : STATUS_LABELS[s]}{" "}
              <span className={activeStatus === s ? "opacity-75" : "text-gray-400"}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company or role…"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:w-56"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">No applications match your filter.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
