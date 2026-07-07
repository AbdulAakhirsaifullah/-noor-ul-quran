import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface HomeCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function HomeCard({ href, icon: Icon, title, description }: HomeCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl2 border border-primary-100 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg hover:border-gold/50 dark:border-primary-900 dark:bg-night-card"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-700 group-hover:bg-gold/15 group-hover:text-gold dark:bg-primary-900 dark:text-primary-100">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="text-sm text-ink/60 dark:text-white/60">{description}</p>
    </Link>
  );
}
