interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.05] bg-[#030a06]/90 px-6 backdrop-blur-md">
      <div className="h-3.5 w-[2px] rounded-full bg-emerald-500/70" />
      <h1 className="font-display text-[15px] italic font-medium tracking-tight text-gray-100">{title}</h1>
    </header>
  );
}
