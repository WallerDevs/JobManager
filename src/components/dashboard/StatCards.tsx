"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ApplicationStatus } from "@prisma/client";
import { STATUS_LABELS } from "@/lib/utils";

const STATUS_TOP: Record<ApplicationStatus, string> = {
  DRAFT:     "from-gray-400 to-gray-500",
  SENT:      "from-blue-400 to-blue-500",
  INTERVIEW: "from-amber-400 to-orange-400",
  REJECTED:  "from-red-400 to-rose-500",
  OFFER:     "from-emerald-400 to-green-500",
};

const STATUS_GLOW: Record<ApplicationStatus, string> = {
  DRAFT:     "group-hover:shadow-[0_0_24px_rgba(156,163,175,0.15)]",
  SENT:      "group-hover:shadow-[0_0_24px_rgba(96,165,250,0.15)]",
  INTERVIEW: "group-hover:shadow-[0_0_24px_rgba(251,191,36,0.15)]",
  REJECTED:  "group-hover:shadow-[0_0_24px_rgba(248,113,113,0.15)]",
  OFFER:     "group-hover:shadow-[0_0_24px_rgba(52,211,153,0.18)]",
};

const STATUS_ICON_BG: Record<ApplicationStatus, string> = {
  DRAFT:     "bg-gray-500/10 text-gray-400",
  SENT:      "bg-blue-500/10 text-blue-400",
  INTERVIEW: "bg-amber-500/10 text-amber-400",
  REJECTED:  "bg-red-500/10 text-red-400",
  OFFER:     "bg-emerald-500/10 text-emerald-400",
};

const STATUS_ICONS: Record<ApplicationStatus, React.ReactNode> = {
  DRAFT: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  SENT: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  INTERVIEW: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  OFFER: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  REJECTED: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

function AnimatedCount({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 55, damping: 14, restDelta: 0.5 });
  const display = useTransform(spring, (v) => Math.round(v).toString());
  useEffect(() => { spring.set(value); }, [spring, value]);
  return <motion.span>{display}</motion.span>;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

interface StatCardsProps {
  counts: Partial<Record<ApplicationStatus, number>>;
  statuses: ApplicationStatus[];
}

export function StatCards({ counts, statuses }: StatCardsProps) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {statuses.map((status) => {
        const count = counts[status] ?? 0;
        return (
          <motion.div key={status} variants={cardVariants}>
            <Link href={`/applications?status=${status}`}>
              <div
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-200 hover:border-white/[0.13] hover:bg-white/[0.05] cursor-pointer ${STATUS_GLOW[status]}`}
              >
                {/* Top gradient line */}
                <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${STATUS_TOP[status]}`} />
                {/* Top-edge internal glow */}
                <div className={`absolute inset-x-0 top-0 h-12 bg-gradient-to-b ${STATUS_TOP[status]} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06] [mask-image:linear-gradient(to_bottom,white,transparent)]`} />

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                      {STATUS_LABELS[status]}
                    </p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-white">
                      <AnimatedCount value={count} />
                    </p>
                  </div>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-110 ${STATUS_ICON_BG[status]}`}>
                    {STATUS_ICONS[status]}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
