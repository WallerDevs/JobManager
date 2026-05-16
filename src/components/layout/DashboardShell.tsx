import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ShellContent } from "@/components/layout/ShellContent";

interface DashboardShellProps {
  title: string;
  children: React.ReactNode;
}

export function DashboardShell({ title, children }: DashboardShellProps) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-[#030a06]">
      {/* Subtle ambient glows — single, restrained */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[15%] h-[600px] w-[600px] rounded-full bg-emerald-500/[0.04] blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-teal-400/[0.03] blur-[140px]" />
      </div>
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Header title={title} />
        <ShellContent>{children}</ShellContent>
      </div>
    </div>
  );
}
