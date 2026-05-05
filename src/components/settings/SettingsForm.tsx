"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Props {
  initialName: string;
  initialEmail: string;
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
    <div className="mx-auto max-w-xl flex flex-col gap-6">
      {/* Profile */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-card">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Profile</h2>
        </div>
        <form onSubmit={saveProfile} className="flex flex-col gap-4 p-5">
          {profileError && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{profileError}</div>
          )}
          {profileSuccess && (
            <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">Profile updated.</div>
          )}
          <Input
            id="name"
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={profileLoading}>Save changes</Button>
          </div>
        </form>
      </section>

      {/* Password */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-card">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Change password</h2>
        </div>
        <form onSubmit={changePassword} className="flex flex-col gap-4 p-5">
          {passwordError && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">Password changed.</div>
          )}
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
          <div className="flex justify-end">
            <Button type="submit" loading={passwordLoading}>Change password</Button>
          </div>
        </form>
      </section>

      {/* Danger zone */}
      <section className="rounded-xl border border-red-100 bg-white shadow-card">
        <div className="px-5 py-4 border-b border-red-100">
          <h2 className="text-sm font-medium text-red-700">Danger zone</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-500 mb-4">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          {!deleteConfirm ? (
            <Button variant="secondary" onClick={() => setDeleteConfirm(true)}>
              Delete account
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-red-600">Are you sure?</span>
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <button
                onClick={deleteAccount}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? "Deleting…" : "Yes, delete everything"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
