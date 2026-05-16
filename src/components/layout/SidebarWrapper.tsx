"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(
  () => import("@/components/layout/Sidebar").then((m) => ({ default: m.Sidebar })),
  { ssr: false, loading: () => <div className="w-60 flex-shrink-0 bg-[#060e08]" /> }
);

export function SidebarWrapper() {
  return <Sidebar />;
}
