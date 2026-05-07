"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed");

      await signIn("credentials", { email, password, redirect: false });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-950 px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-fade-in">
        <div className="mb-8 text-center">
          <img src="/logo.png" width={48} height={48} alt="JobManager" className="mx-auto mb-5 rounded-2xl shadow-lg shadow-lime-500/20" />
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1.5 text-sm text-gray-400">Start managing your job search today</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-2xl">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="name"
              name="name"
              label="Full name"
              required
              placeholder="Jane Smith"
              autoComplete="name"
              className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/15"
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/15"
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              required
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              minLength={8}
              className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/15"
            />
            <Button type="submit" loading={loading} className="w-full mt-1" size="lg">
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
