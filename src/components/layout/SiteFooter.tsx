import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { Wordmark } from "@/components/brand/Wordmark";
import { LocaleSwitch } from "./LocaleSwitch";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  return (
    <footer className="border-t border-border">
      <div className="container grid-12 gap-y-8 py-10">
        <div className="col-span-12 md:col-span-5 flex flex-col gap-3">
          <Wordmark size={20} />
          <p className="text-[14px] text-text-2">{dict.footer.studio}</p>
          <p className="mono text-[12px] text-text-3">{dict.footer.rights}</p>
        </div>

        <nav aria-label="legal" className="col-span-6 md:col-span-3 md:col-start-7 flex flex-col gap-2 text-[14px]">
          <Link href={`${base}/terms`} className="text-text-2 hover:text-text transition-colors">
            {dict.footer.terms}
          </Link>
          <Link href={`${base}/privacy`} className="text-text-2 hover:text-text transition-colors">
            {dict.footer.privacy}
          </Link>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-text-2 hover:text-text transition-colors">
            GitHub
          </a>
          <a href={`mailto:${site.email}`} className="mono text-[13px] text-text-2 hover:text-text transition-colors">
            {site.email}
          </a>
        </nav>

        <div className="col-span-6 md:col-span-3 flex flex-col items-start gap-2">
          <span className="index">{dict.footer.language}</span>
          <LocaleSwitch locale={locale} label={dict.nav.langSwitch} ariaLabel={dict.nav.langSwitchAria} className="-ml-3" />
        </div>
      </div>
    </footer>
  );
}
