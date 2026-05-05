"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  user: { id: string; name: string };
}

interface CommentSectionProps {
  applicationId: string;
  comments: Comment[];
}

export function CommentSection({ applicationId, comments: initial }: CommentSectionProps) {
  const router = useRouter();
  const [comments, setComments] = useState(initial);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, content: content.trim() }),
    });

    if (res.ok) {
      const comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setContent("");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="mb-4 text-sm font-medium text-gray-700">Timeline & Comments</h3>

        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 mb-4">No comments yet.</p>
        ) : (
          <ul className="flex flex-col gap-3 mb-5">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                  {comment.user.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-gray-900">{comment.user.name}</span>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-600 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            placeholder="Add a comment or note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" loading={loading} disabled={!content.trim()}>
              Add comment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
