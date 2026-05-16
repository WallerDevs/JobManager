"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030a06] px-4">
      {/* Ambient brand glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-15%] right-[8%] h-[560px] w-[560px] rounded-full bg-emerald-500/[0.06] blur-[150px]" />
        <div className="absolute bottom-[-15%] left-[-5%] h-[480px] w-[480px] rounded-full bg-teal-400/[0.04] blur-[140px]" />
      </div>
      {/* Dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
        className="relative w-full max-w-sm"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
          }}
          className="mb-9 text-center"
        >
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-emerald-500/20">
            <img src="/logo.png" width={36} height={36} alt="JobManager" className="rounded-xl" />
          </div>
          <h1 className="font-display text-3xl font-semibold italic tracking-tight text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-500">Start managing your job search today</p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
          }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_40px_rgba(0,0,0,0.35)]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="name"
              name="name"
              label="Full name"
              required
              placeholder="Jane Smith"
              autoComplete="name"
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              required
              placeholder="you@example.com"
              autoComplete="email"
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
            />
            <Button type="submit" loading={loading} className="mt-1 w-full" size="lg">
              Create account
            </Button>
          </form>
        </motion.div>

        <motion.p
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5, ease } },
          }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-emerald-400 transition-colors hover:text-emerald-300">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
