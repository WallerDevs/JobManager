"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentType } from "@prisma/client";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CreateDocumentInput } from "@/types";

const TYPE_OPTIONS = [
  { value: "CV", label: "CV" },
  { value: "COVER_LETTER", label: "Cover Letter" },
];

interface DocumentFormProps {
  initialValues?: Partial<CreateDocumentInput>;
  documentId?: string;
}

export function DocumentForm({ initialValues, documentId }: DocumentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [values, setValues] = useState<CreateDocumentInput>({
    type: initialValues?.type ?? "CV",
    title: initialValues?.title ?? "",
    content: initialValues?.content ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = documentId ? `/api/documents/${documentId}` : "/api/documents";
      const method = documentId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      router.push("/documents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          id="type"
          label="Document type"
          value={values.type}
          options={TYPE_OPTIONS}
          onChange={(e) => setValues((prev) => ({ ...prev, type: e.target.value as DocumentType }))}
        />
        <Input
          id="title"
          label="Title *"
          required
          value={values.title}
          onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="e.g. Software Engineer CV"
        />
      </div>

      <Textarea
        id="content"
        label="Content"
        value={values.content}
        onChange={(e) => setValues((prev) => ({ ...prev, content: e.target.value }))}
        placeholder="Paste or write your document content here..."
        className="min-h-[400px]"
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {documentId ? "Save changes" : "Create document"}
        </Button>
      </div>
    </form>
  );
}
