"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { SerializedDocumentSummary } from "@/types";
import { formatDate } from "@/lib/utils";

const TYPE_TOP = {
  CV:           "bg-blue-500",
  COVER_LETTER: "bg-violet-500",
};

const TYPE_ICON = {
  CV: (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  COVER_LETTER: (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

const TYPE_LABEL = {
  CV:           "CV / Resume",
  COVER_LETTER: "Cover Letter",
};

const TYPE_ICON_BG = {
  CV:           "bg-blue-500/12 text-blue-400",
  COVER_LETTER: "bg-violet-500/12 text-violet-400",
};

const TYPE_SPOTLIGHT = {
  CV:           "rgba(96,165,250,0.07)",
  COVER_LETTER: "rgba(167,139,250,0.07)",
};

const TYPE_HOVER_TEXT = {
  CV:           "group-hover:text-blue-300",
  COVER_LETTER: "group-hover:text-violet-300",
};

interface DocumentCardProps {
  document: SerializedDocumentSummary;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const router = useRouter();
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
    if (!confirm(`Delete "${document.title}"?`)) return;
    setDeleting(true);
    await fetch(`/api/documents/${document.id}`, { method: "DELETE" });
    router.refresh();
  }

  const type = document.type as "CV" | "COVER_LETTER";

  return (
    <Link href={`/documents/${document.id}`}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.025] cursor-pointer transition-colors duration-200 hover:border-white/[0.11] hover:bg-white/[0.04]"
      >
        {/* Type top bar */}
        <div className={`absolute inset-x-0 top-0 h-[2px] ${TYPE_TOP[type]}`} />

        {/* Mouse-tracking spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
          style={{
            opacity: spotlight.visible ? 1 : 0,
            background: `radial-gradient(240px circle at ${spotlight.x}px ${spotlight.y}px, ${TYPE_SPOTLIGHT[type]}, transparent 70%)`,
          }}
        />

        <div className="relative px-4 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${TYPE_ICON_BG[type]}`}>
                {TYPE_ICON[type]}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold text-gray-100 transition-colors duration-150 ${TYPE_HOVER_TEXT[type]}`}>
                  {document.title}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-gray-600">{TYPE_LABEL[type]}</p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="hidden h-6 w-6 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-red-950/40 hover:text-red-400 cursor-pointer group-hover:flex"
              aria-label="Delete document"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <p className="mt-3 font-mono text-[10px] text-gray-700">Updated {formatDate(document.updatedAt)}</p>
        </div>
      </motion.div>
    </Link>
  );
}
