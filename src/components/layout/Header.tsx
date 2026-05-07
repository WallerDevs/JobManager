"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { data: session } = useSession();
  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-md px-6">
      <h1 className="text-sm font-semibold text-gray-100">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-green-700 text-[11px] font-semibold text-white shadow-glow-sm">
            {initials}
          </div>
          <span className="text-sm text-gray-400">{session?.user?.name}</span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-gray-500 hover:text-gray-300"
        >
          Sign out
        </Button>
      </div>
    </header>
  );
}
