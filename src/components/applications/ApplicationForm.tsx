"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CreateApplicationInput } from "@/types";

interface ApplicationFormProps {
  initialValues?: Partial<CreateApplicationInput>;
  applicationId?: string;
}

export function ApplicationForm({ initialValues, applicationId }: ApplicationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [values, setValues] = useState<CreateApplicationInput>({
    companyName: initialValues?.companyName ?? "",
    jobTitle: initialValues?.jobTitle ?? "",
    description: initialValues?.description ?? "",
    jobUrl: initialValues?.jobUrl ?? "",
    location: initialValues?.location ?? "",
    salary: initialValues?.salary ?? "",
  });

  function handleChange(field: keyof CreateApplicationInput) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = applicationId ? `/api/applications/${applicationId}` : "/api/applications";
      const method = applicationId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      const data = await res.json();
      router.push(`/applications/${data.id}`);
      router.refresh();
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
        <Input
          id="companyName"
          label="Company name *"
          required
          value={values.companyName}
          onChange={handleChange("companyName")}
          placeholder="Acme Corp"
        />
        <Input
          id="jobTitle"
          label="Job title *"
          required
          value={values.jobTitle}
          onChange={handleChange("jobTitle")}
          placeholder="Software Engineer"
        />
        <Input
          id="location"
          label="Location"
          value={values.location}
          onChange={handleChange("location")}
          placeholder="Stockholm, Sweden"
        />
        <Input
          id="salary"
          label="Salary"
          value={values.salary}
          onChange={handleChange("salary")}
          placeholder="60 000 SEK/month"
        />
        <Input
          id="jobUrl"
          label="Job URL"
          type="url"
          value={values.jobUrl}
          onChange={handleChange("jobUrl")}
          placeholder="https://..."
          className="sm:col-span-2"
        />
      </div>

      <Textarea
        id="description"
        label="Job description / notes"
        value={values.description}
        onChange={handleChange("description")}
        placeholder="Paste the job description or add your notes here..."
        className="min-h-[160px]"
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {applicationId ? "Save changes" : "Create application"}
        </Button>
      </div>
    </form>
  );
}
