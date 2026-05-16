"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ApplicationStatus } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const PIPELINE: ApplicationStatus[] = ["DRAFT", "SENT", "INTERVIEW", "OFFER"];

const STEP_META: Record<ApplicationStatus, { label: string; icon: React.ReactNode }> = {
  DRAFT: {
    label: "Draft",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  SENT: {
    label: "Applied",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
  INTERVIEW: {
    label: "Interview",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  OFFER: {
    label: "Offer",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  REJECTED: {
    label: "Rejected",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

const CHECK_ICON = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

interface StatusUpdaterProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

export function StatusUpdater({ applicationId, currentStatus }: StatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [updating, setUpdating] = useState<ApplicationStatus | null>(null);

  async function updateStatus(next: ApplicationStatus) {
    if (next === status || updating) return;
    setUpdating(next);
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setStatus(next);
    setUpdating(null);
    router.refresh();
  }

  const pipelineIndex = PIPELINE.indexOf(status);
  const isRejected = status === "REJECTED";

  return (
    <Card>
      <CardContent className="p-5">
        <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-wider text-gray-500">
          Pipeline
        </p>

        {/* Step pipeline */}
        <div className="flex items-start">
          {PIPELINE.map((step, i) => {
            const isActive = !isRejected && step === status;
            const isComplete = !isRejected && i < pipelineIndex;
            const isFuture = isRejected || i > pipelineIndex;
            const isLoading = updating === step;
            const connectorFilled = !isRejected && i < pipelineIndex;

            return (
              <div key={step} className="relative flex flex-1 flex-col items-center">
                {/* Connector — spans exactly from this circle's center to the next */}
                {i < PIPELINE.length - 1 && (
                  <div className="absolute top-5 left-[calc(50%+24px)] h-0.5 w-[calc(100%-48px)] -translate-y-1/2 overflow-hidden rounded-full bg-gray-800">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gray-600"
                      initial={{ width: "0%" }}
                      animate={{ width: connectorFilled ? "100%" : "0%" }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                    />
                  </div>
                )}

                {/* Step + label */}
                <motion.button
                  onClick={() => updateStatus(step)}
                  disabled={!!updating}
                  whileHover={!updating ? { scale: 1.05 } : {}}
                  whileTap={!updating ? { scale: 0.96 } : {}}
                  className="group relative z-10 flex flex-col items-center gap-2 cursor-pointer disabled:cursor-wait"
                >
                  {/* Circle */}
                  <div className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                    isLoading && "animate-pulse",
                    isActive && "text-white scale-105",
                    isComplete && "bg-gray-700/80 text-gray-400 group-hover:bg-gray-700",
                    isFuture && "border-2 border-gray-700/80 text-gray-700 group-hover:border-gray-600 group-hover:text-gray-500",
                  )}>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700"
                        layoutId="pipelineActive"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">
                      {isComplete ? CHECK_ICON : STEP_META[step].icon}
                    </span>
                  </div>

                  {/* Label */}
                  <span className={cn(
                    "text-xs font-medium transition-colors text-center whitespace-nowrap",
                    isActive && "text-emerald-400",
                    isComplete && "text-gray-500 group-hover:text-gray-400",
                    isFuture && "text-gray-700 group-hover:text-gray-600",
                  )}>
                    {STEP_META[step].label}
                  </span>
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Rejected state — AnimatePresence for smooth toggle */}
        <div className="mt-5">
          <AnimatePresence mode="wait">
            {isRejected ? (
              <motion.div
                key="rejected-banner"
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -4 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between rounded-lg border border-red-900/40 bg-red-950/25 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-red-400">Application marked as rejected</span>
                  </div>
                  <button
                    onClick={() => updateStatus("SENT")}
                    disabled={!!updating}
                    className="text-xs text-gray-600 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    Reactivate
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="reject-btn"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => updateStatus("REJECTED")}
                disabled={!!updating}
                className="flex items-center gap-2 rounded-lg border border-gray-800 px-3 py-1.5 text-xs text-gray-600 transition-all duration-150 hover:border-red-900/50 hover:bg-red-950/20 hover:text-red-400 cursor-pointer"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Mark as rejected
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
