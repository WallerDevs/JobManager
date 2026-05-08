interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b border-white/[0.05] bg-[#050d07]/70 px-6 backdrop-blur-sm">
      <h1 className="text-sm font-semibold text-gray-100">{title}</h1>
    </header>
  );
}
