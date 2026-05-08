import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ShellContent } from "@/components/layout/ShellContent";

interface DashboardShellProps {
  title: string;
  children: React.ReactNode;
}

export function DashboardShell({ title, children }: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#050d07]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} />
        <ShellContent>{children}</ShellContent>
      </div>
    </div>
  );
}
