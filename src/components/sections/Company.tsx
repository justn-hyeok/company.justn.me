import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/** Company overview. Every row is a confirmed fact; optional legal details
 *  (registration number, address, phone) render only once they are set. */
export function Company({ dict, locale }: { dict: Dictionary; locale: string }) {
  const { company } = dict;
  const linkClass = "link-ul break-all";
  const dateFmt = new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-GB", { year: "numeric", month: "long", day: "numeric" });
  const representative = locale === "ko" ? `${site.founder.name} (${site.founder.latinName})` : `${site.founder.latinName} (${site.founder.name})`;

  const rows: { label: string; value: ReactNode }[] = [
    { label: company.labels.name, value: site.name },
    { label: company.labels.type, value: company.type },
    { label: company.labels.founded, value: <time dateTime={site.foundedDate}>{dateFmt.format(new Date(site.foundedDate))}</time> },
    { label: company.labels.representative, value: representative },
    { label: company.labels.business, value: company.business },
    { label: company.labels.model, value: company.model },
    { label: company.labels.email, value: <a href={`mailto:${site.email}`} className={linkClass}>{site.email}</a> },
    { label: company.labels.location, value: company.location },
    ...(["address", "phone", "registrationNumber"] as const).flatMap((key) => {
      const value = key === "address" && locale !== "ko" ? (site.legal.addressEn ?? site.legal.address)?.trim() : site.legal[key]?.trim();
      return value ? [{ label: company.labels[key], value }] : [];
    }),
    { label: company.labels.repositories, value: <a href={site.github} target="_blank" rel="noopener noreferrer" className={linkClass}>github.com/{site.githubHandle}</a> },
  ];

  return (
    <section id="company" className="section scroll-mt-16 border-t border-border" aria-labelledby="company-title">
      <Reveal className="container grid-12 gap-y-8">
        <div className="col-span-12 lg:col-span-4">
          <SectionHeading index={dict.sections.company.index} title={dict.sections.company.title} lede={dict.sections.company.lede} titleId="company-title" />
        </div>
        <dl className="col-span-12 divide-y divide-border border-y border-border lg:col-span-7 lg:col-start-6">
          {rows.map(({ label, value }) => (
            <div key={label} className="grid gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
              <dt className="text-[14px] font-medium text-text">{label}</dt>
              <dd className="min-w-0 break-words text-[15px] leading-relaxed text-text-2">{value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
