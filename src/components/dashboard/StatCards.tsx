"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ApplicationStatus } from "@prisma/client";
import { STATUS_LABELS } from "@/lib/utils";

const STATUS_LINE: Record<ApplicationStatus, string> = {
  DRAFT:     "from-gray-500/60 to-gray-600/60",
  SENT:      "from-blue-400/80 to-blue-500/60",
  INTERVIEW: "from-amber-400/80 to-amber-500/60",
  REJECTED:  "from-red-500/80 to-red-600/60",
  OFFER:     "from-emerald-400/90 to-emerald-500/70",
};

const STATUS_NUMBER: Record<ApplicationStatus, string> = {
  DRAFT:     "text-gray-300",
  SENT:      "text-blue-200",
  INTERVIEW: "text-amber-200",
  REJECTED:  "text-red-200",
  OFFER:     "text-emerald-200",
};

const STATUS_LABEL_COLOR: Record<ApplicationStatus, string> = {
  DRAFT:     "text-gray-600",
  SENT:      "text-blue-500/80",
  INTERVIEW: "text-amber-500/80",
  REJECTED:  "text-red-500/80",
  OFFER:     "text-emerald-500/80",
};

const STATUS_BORDER: Record<ApplicationStatus, string> = {
  DRAFT:     "border-white/[0.06] hover:border-gray-500/20",
  SENT:      "border-white/[0.06] hover:border-blue-500/20",
  INTERVIEW: "border-white/[0.06] hover:border-amber-500/20",
  REJECTED:  "border-white/[0.06] hover:border-red-500/20",
  OFFER:     "border-white/[0.06] hover:border-emerald-500/25",
};

const STATUS_FILL: Record<ApplicationStatus, string> = {
  DRAFT:     "from-gray-500/[0.05] to-transparent",
  SENT:      "from-blue-500/[0.05] to-transparent",
  INTERVIEW: "from-amber-500/[0.05] to-transparent",
  REJECTED:  "from-red-500/[0.05] to-transparent",
  OFFER:     "from-emerald-500/[0.06] to-transparent",
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
  const total = Object.values(counts).reduce((sum, v) => sum + (v ?? 0), 0);

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {statuses.map((status) => {
        const count = counts[status] ?? 0;
        const fillPct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <motion.div
            key={status}
            variants={cardVariants}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <Link href={`/applications?status=${status}`}>
              <div className={`group relative overflow-hidden rounded-xl border bg-white/[0.025] cursor-pointer transition-all duration-300 ${STATUS_BORDER[status]}`}>
                {/* Top gradient line */}
                <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${STATUS_LINE[status]}`} />
                {/* Hover fill */}
                <div className={`absolute inset-0 bg-gradient-to-b ${STATUS_FILL[status]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                <div className="relative p-5 pb-4">
                  {/* Big editorial number */}
                  <p className={`font-display text-5xl font-semibold italic leading-none tabular-nums ${STATUS_NUMBER[status]}`}>
                    <AnimatedCount value={count} />
                  </p>

                  {/* Status label in mono */}
                  <p className={`mt-3 font-mono text-[9px] font-medium uppercase tracking-[0.16em] ${STATUS_LABEL_COLOR[status]}`}>
                    {STATUS_LABELS[status]}
                  </p>

                  {/* Slim progress bar */}
                  <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${STATUS_LINE[status]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${fillPct}%` }}
                      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[9px] text-gray-700 tabular-nums">{fillPct}%</p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
