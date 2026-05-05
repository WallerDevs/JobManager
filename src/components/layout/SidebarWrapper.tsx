"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(
  () => import("@/components/layout/Sidebar").then((m) => ({ default: m.Sidebar })),
  { ssr: false, loading: () => <div className="w-56 flex-shrink-0 bg-gray-950" /> }
);

export function SidebarWrapper() {
  return <Sidebar />;
}
