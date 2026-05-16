"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Props {
  initialName: string;
  initialEmail: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function SectionCard({
  title,
  danger,
  className,
  children,
}: {
  title: string;
  danger?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      variants={item}
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden rounded-xl border bg-white/[0.025] shadow-[0_1px_2px_rgba(0,0,0,0.4),0_6px_24px_rgba(0,0,0,0.25)]",
        danger ? "border-red-500/20" : "border-white/[0.07]",
        className
      )}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
          danger ? "via-red-500/30" : "via-white/[0.07]"
        }`}
      />
      <div className={`shrink-0 border-b px-4 py-3 ${danger ? "border-red-500/15" : "border-white/[0.06]"}`}>
        <h2
          className={`font-mono text-[10px] font-medium uppercase tracking-wider ${
            danger ? "text-red-400/80" : "text-gray-500"
          }`}
        >
          {title}
        </h2>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </motion.section>
  );
}

function Notice({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border px-4 py-3 text-sm ${
        kind === "error"
          ? "border-red-500/20 bg-red-950/30 text-red-400"
          : "border-emerald-500/20 bg-emerald-950/30 text-emerald-400"
      }`}
    >
      {children}
    </motion.div>
  );
}

export function SettingsForm({ initialName, initialEmail }: Props) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(false);

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();
    setProfileLoading(false);

    if (!res.ok) {
      setProfileError(data.error ?? "Something went wrong");
    } else {
      setProfileSuccess(true);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    setPasswordLoading(false);

    if (!res.ok) {
      setPasswordError(data.error ?? "Something went wrong");
    } else {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    }
  }

  async function deleteAccount() {
    setDeleteLoading(true);
    await fetch("/api/user", { method: "DELETE" });
    signOut({ callbackUrl: "/" });
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
      }}
      className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-4"
    >
      {/* Profile */}
      <SectionCard title="Profile">
        <form onSubmit={saveProfile} className="flex h-full flex-col gap-3 p-4">
          {profileError && <Notice kind="error">{profileError}</Notice>}
          {profileSuccess && <Notice kind="success">Profile updated.</Notice>}
          <div className="grid gap-3 sm:grid-cols-2">
            <Input id="name" label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
            <Input id="email" label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mt-auto flex justify-end pt-1">
            <Button type="submit" loading={profileLoading}>Save changes</Button>
          </div>
        </form>
      </SectionCard>

      {/* Password */}
      <SectionCard title="Change password">
        <form onSubmit={changePassword} className="flex h-full flex-col gap-3 p-4">
          {passwordError && <Notice kind="error">{passwordError}</Notice>}
          {passwordSuccess && <Notice kind="success">Password changed.</Notice>}
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id="currentPassword"
              label="Current password"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              id="newPassword"
              label="New password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>
          <div className="mt-auto flex justify-end pt-1">
            <Button type="submit" loading={passwordLoading}>Change password</Button>
          </div>
        </form>
      </SectionCard>

      {/* Danger zone */}
      <SectionCard title="Danger zone" danger className="lg:col-span-2">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-sm text-gray-500 sm:min-w-0 sm:flex-1">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          {!deleteConfirm ? (
            <Button variant="secondary" className="shrink-0" onClick={() => setDeleteConfirm(true)}>
              Delete account
            </Button>
          ) : (
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
              <span className="text-sm text-red-400">Are you sure?</span>
              <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={deleteAccount} loading={deleteLoading}>
                Yes, delete everything
              </Button>
            </div>
          )}
        </div>
      </SectionCard>
    </motion.div>
  );
}
