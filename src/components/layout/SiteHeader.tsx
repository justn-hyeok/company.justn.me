import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Wordmark } from "@/components/brand/Wordmark";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { LocaleSwitch } from "./LocaleSwitch";
import { NavLinks } from "./NavLinks";

interface SiteHeaderProps {
  locale: Locale;
  dict: Dictionary;
  /** Landing page shows section anchors; legal pages only the wordmark. */
  nav?: boolean;
}

export function SiteHeader({ locale, dict, nav = true }: SiteHeaderProps) {
  const base = `/${locale}`;
  const items = [
    { id: "products", href: `${base}#products`, label: dict.nav.products },
    { id: "approach", href: `${base}#approach`, label: dict.nav.approach },
    { id: "milestones", href: `${base}#milestones`, label: dict.nav.milestones },
    { id: "founder", href: `${base}#founder`, label: dict.nav.founder },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent"
      >
        {dict.nav.skip}
      </a>
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href={base} className="flex items-center" aria-label="justn">
          <Wordmark size={22} />
        </Link>

        {nav && <NavLinks items={items} />}

        <div className="flex items-center gap-1">
          <LocaleSwitch locale={locale} label={dict.nav.langSwitch} ariaLabel={dict.nav.langSwitchAria} />
          <a href={`${base}#contact`} className="btn btn-primary !h-10 px-4 text-[14px]">
            <span className="md:hidden">{dict.nav.ctaShort}</span>
            <span className="hidden md:inline">{dict.nav.cta}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
