"use client";

import { useState } from "react";
import { SerializedApplicationSummary } from "@/types";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const STATUSES = ["ALL", "DRAFT", "SENT", "INTERVIEW", "OFFER", "REJECTED"] as const;
type Filter = typeof STATUSES[number];

const LABELS: Record<Filter, string> = {
  ALL: "All",
  DRAFT: "Draft",
  SENT: "Sent",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

interface ApplicationsClientProps {
  applications: SerializedApplicationSummary[];
}

export function ApplicationsClient({ applications }: ApplicationsClientProps) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");

  const filtered = applications.filter((app) => {
    const matchesStatus = filter === "ALL" || app.status === filter;
    const matchesSearch =
      !search ||
      app.companyName.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
          />
        </div>

        <Link href="/applications/new">
          <Button>New application</Button>
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-1">
        {STATUSES.map((s) => {
          const count = s === "ALL" ? applications.length : applications.filter((a) => a.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              {LABELS[s]}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                filter === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-gray-500">
              {applications.length === 0
                ? "No applications yet. Add your first one to get started."
                : "No applications match your filter."}
            </p>
            {applications.length === 0 && (
              <Link href="/applications/new">
                <Button>New application</Button>
              </Link>
            )}
          </CardContent>
        </Card>
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
