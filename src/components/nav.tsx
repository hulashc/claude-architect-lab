import Link from "next/link";

const LINKS = [
  { href: "/certification", label: "Certification" },
  { href: "/domains", label: "Learn" },
  { href: "/architecture-lab", label: "Architecture Lab" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Claude Architect Lab
        </Link>
        <nav className="flex items-center gap-5 text-sm text-zinc-600 dark:text-zinc-400">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
