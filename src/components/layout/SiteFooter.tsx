import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { Wordmark } from "@/components/brand/Wordmark";
import { LocaleSwitch } from "./LocaleSwitch";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  const { company } = dict;
  const companyRows: { label: string; value: ReactNode }[] = [
    { label: company.labels.name, value: site.name },
    { label: company.labels.representative, value: locale === "ko" ? site.founder.name : site.founder.latinName },
    { label: company.labels.email, value: <a href={`mailto:${site.email}`} className="break-all underline underline-offset-4 hover:text-text">{site.email}</a> },
    { label: company.labels.location, value: company.location },
    ...(["registrationNumber", "address", "phone"] as const).flatMap((key) => {
      const value = site.legal[key]?.trim();
      return value ? [{ label: company.labels[key], value }] : [];
    }),
  ];
  return (
    <footer className="border-t border-border">
      <div className="container grid-12 gap-y-8 py-10">
        <div className="col-span-12 lg:col-span-4 flex flex-col items-start gap-3">
          <Wordmark size={20} />
          <p className="text-[14px] text-text-2">{dict.footer.studio}</p>
          <p className="mono text-[12px] text-text-3">{dict.footer.rights}</p>
        </div>

        <section aria-labelledby="footer-company-title" className="col-span-12 md:col-span-8 lg:col-span-5">
          <h2 id="footer-company-title" className="index mb-4">{dict.footer.company}</h2>
          <dl className="flex flex-col gap-3 text-[14px] leading-relaxed">
            {companyRows.map(({ label, value }) => (
              <div key={label} className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
                <dt className="text-text-2">{label}</dt>
                <dd className="min-w-0 break-words text-text-2">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col items-start gap-6">
          <nav aria-label={dict.footer.legal} className="flex flex-col gap-2 text-[14px]">
            <h2 className="index mb-2">{dict.footer.legal}</h2>
            <Link href={`${base}/terms`} className="text-text-2 hover:text-text transition-colors">
              {dict.footer.terms}
            </Link>
            <Link href={`${base}/privacy`} className="text-text-2 hover:text-text transition-colors">
              {dict.footer.privacy}
            </Link>
            <Link href={`${base}/changelog`} className="text-text-2 hover:text-text transition-colors">
              {dict.footer.changelog}
            </Link>
            <a href={`mailto:${site.email}?subject=${encodeURIComponent(dict.footer.security)}`} className="text-text-2 hover:text-text transition-colors">
              {dict.footer.security}
            </a>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-text-2 hover:text-text transition-colors">
              GitHub
            </a>
          </nav>

          <div className="flex flex-col items-start gap-2">
            <span className="index">{dict.footer.language}</span>
            <LocaleSwitch locale={locale} label={dict.nav.langSwitch} ariaLabel={dict.nav.langSwitchAria} className="-ml-3" />
          </div>
        </div>
      </div>
    </footer>
  );
}
