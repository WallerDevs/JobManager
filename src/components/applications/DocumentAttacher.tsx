"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentType } from "@prisma/client";

interface AttachedDoc {
  id: string;
  documentId: string;
  document: { id: string; title: string; type: DocumentType };
}

interface AvailableDoc {
  id: string;
  title: string;
  type: DocumentType;
}

interface Props {
  applicationId: string;
  attachedDocs: AttachedDoc[];
  allDocs: AvailableDoc[];
}

const DOC_TYPE_STYLES = {
  CV: "bg-blue-500/10 text-blue-400",
  COVER_LETTER: "bg-violet-500/10 text-violet-400",
};

export function DocumentAttacher({ applicationId, attachedDocs, allDocs }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  const attachedIds = new Set(attachedDocs.map((d) => d.documentId));
  const available = allDocs.filter((d) => !attachedIds.has(d.id));

  async function attach(documentId: string) {
    setBusy(true);
    setOpen(false);
    await fetch(`/api/applications/${applicationId}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId }),
    });
    router.refresh();
    setBusy(false);
  }

  async function detach(documentId: string) {
    setBusy(true);
    await fetch(`/api/applications/${applicationId}/documents`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025] shadow-[0_1px_2px_rgba(0,0,0,0.4),0_6px_24px_rgba(0,0,0,0.25)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <h3 className="font-mono text-[10px] font-medium uppercase tracking-wider text-gray-500">Documents</h3>
        {available.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Attach
            </button>

            {open && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-60 rounded-xl border border-white/[0.08] bg-[#0a140d] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md py-1">
                  {available.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => attach(doc.id)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${DOC_TYPE_STYLES[doc.type]}`}>
                        {doc.type === "CV" ? "CV" : "CL"}
                      </span>
                      <span className="truncate text-sm text-gray-300">{doc.title}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-3">
        {attachedDocs.length === 0 ? (
          <p className="py-2 text-sm text-gray-600">
            {allDocs.length === 0
              ? "No documents yet — create one in the Documents section."
              : "No documents attached. Click Attach to link one."}
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {attachedDocs.map((ad) => (
              <li key={ad.id} className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`shrink-0 inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${DOC_TYPE_STYLES[ad.document.type]}`}>
                    {ad.document.type === "CV" ? "CV" : "CL"}
                  </span>
                  <a
                    href={`/documents/${ad.document.id}`}
                    className="truncate text-sm text-gray-300 hover:text-emerald-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {ad.document.title}
                  </a>
                </div>
                <button
                  onClick={() => detach(ad.documentId)}
                  disabled={busy}
                  className="hidden group-hover:flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-600 hover:bg-red-950/40 hover:text-red-400 transition-colors cursor-pointer"
                  aria-label="Detach document"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
