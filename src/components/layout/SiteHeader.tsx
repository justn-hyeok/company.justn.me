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
    <header className="sticky top-0 z-40 border-t border-t-border-strong border-b border-b-border bg-bg">
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent"
      >
        {dict.nav.skip}
      </a>
      <div className="container flex h-18 items-center justify-between gap-3 lg:gap-8">
        <Link href={base} className="flex h-11 shrink-0 items-center" aria-label="Justn">
          <Wordmark size={22} />
        </Link>

        {nav && <NavLinks items={items} />}

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0 lg:gap-4 lg:border-l lg:border-border lg:pl-6">
          <LocaleSwitch locale={locale} label={dict.nav.langSwitch} ariaLabel={dict.nav.langSwitchAria} className="!h-11 !gap-1 !px-2" />
          <a href={`${base}#contact`} className="btn btn-primary !h-11 !px-4 !text-[14px]">
            <span className="lg:hidden">{dict.nav.ctaShort}</span>
            <span className="hidden lg:inline">{dict.nav.cta}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
