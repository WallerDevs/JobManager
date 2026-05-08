import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ShellContent } from "@/components/layout/ShellContent";

interface DashboardShellProps {
  title: string;
  children: React.ReactNode;
}

export function DashboardShell({ title, children }: DashboardShellProps) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-[#050d07]">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-25%] left-[20%] h-[700px] w-[700px] rounded-full bg-emerald-500/[0.05] blur-[160px]" />
        <div className="absolute bottom-[-15%] right-[0%] h-[600px] w-[600px] rounded-full bg-teal-400/[0.04] blur-[140px]" />
        <div className="absolute top-[45%] left-[-10%] h-[450px] w-[450px] rounded-full bg-green-600/[0.035] blur-[120px]" />
      </div>
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Header title={title} />
        <ShellContent>{children}</ShellContent>
      </div>
    </div>
  );
}
