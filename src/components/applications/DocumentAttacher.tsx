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
    <div className="rounded-xl border border-gray-100 bg-white shadow-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-700">Documents</h3>
        {available.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Attach
            </button>

            {open && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-56 rounded-xl border border-gray-100 bg-white shadow-lg py-1">
                  {available.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => attach(doc.id)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                        doc.type === "CV"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {doc.type === "CV" ? "CV" : "CL"}
                      </span>
                      <span className="truncate text-sm text-gray-700">{doc.title}</span>
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
          <p className="text-sm text-gray-400 py-2">
            {allDocs.length === 0
              ? "No documents yet — create one in the Documents section."
              : "No documents attached. Click Attach to link one."}
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {attachedDocs.map((ad) => (
              <li key={ad.id} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-gray-50 group transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`flex-shrink-0 inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                    ad.document.type === "CV"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {ad.document.type === "CV" ? "CV" : "CL"}
                  </span>
                  <a
                    href={`/documents/${ad.document.id}`}
                    className="truncate text-sm text-gray-700 hover:text-brand-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {ad.document.title}
                  </a>
                </div>
                <button
                  onClick={() => detach(ad.documentId)}
                  disabled={busy}
                  className="hidden group-hover:flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
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
