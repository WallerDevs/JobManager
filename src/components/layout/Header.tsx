"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm px-6">
      <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-xs font-semibold text-white">
            {session?.user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-gray-600">{session?.user?.name}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-gray-400 hover:text-gray-600"
        >
          Sign out
        </Button>
      </div>
    </header>
  );
}
