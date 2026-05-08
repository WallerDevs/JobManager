interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#050d07]/80 px-6 backdrop-blur-md">
      <div className="h-4 w-[2px] rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
      <h1 className="text-sm font-semibold tracking-wide text-gray-100">{title}</h1>
    </header>
  );
}
