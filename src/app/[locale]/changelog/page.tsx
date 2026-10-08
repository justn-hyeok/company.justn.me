import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { productById, releases, type ProductId } from "@/content/products";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.changelog.title,
    description: dict.changelog.lede,
    alternates: {
      canonical: `${site.url}/${locale}/changelog`,
      languages: { ko: `${site.url}/ko/changelog`, en: `${site.url}/en/changelog`, "x-default": `${site.url}/ko/changelog` },
    },
  };
}

/** The full GitHub release history of the open-source products, as a plain
 *  table. Data is a dated snapshot in src/content/releases.json. */
export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const c = dict.changelog;
  const dateFmt = new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-GB", { year: "numeric", month: "2-digit", day: "2-digit" });

  return (
    <>
      <SiteHeader locale={locale} dict={dict} nav={false} />
      <main id="main" className="container section flex-1">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <p className="index mb-4">{dict.sections.milestones.index.split(" / ")[0]} / CHANGELOG</p>
            <h1 className="h-section">{c.title}</h1>
            <p className="mt-5 max-w-[40ch] text-[14.5px] leading-relaxed text-text-2">{c.lede}</p>
            <p className="mono mt-4 text-[12px] text-text-3">
              {releases.length} {c.count}
            </p>
            <Link href={`/${locale}#milestones`} className="btn btn-secondary mt-8 !h-10 text-[14px]">
              ← {dict.legal.back}
            </Link>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-border-strong text-left">
                  <th scope="col" className="index py-3 pr-4 font-medium">{c.columns.date}</th>
                  <th scope="col" className="index py-3 pr-4 font-medium">{c.columns.product}</th>
                  <th scope="col" className="index py-3 pr-4 font-medium">{c.columns.version}</th>
                  <th scope="col" className="index py-3 text-right font-medium">{c.columns.link}</th>
                </tr>
              </thead>
              <tbody>
                {releases.map((r) => {
                  const product = productById[r.product as ProductId];
                  return (
                    <tr key={r.url} className="border-b border-border">
                      <td className="mono whitespace-nowrap py-3 pr-4 text-text-3">
                        <time dateTime={r.date}>{dateFmt.format(new Date(r.date))}</time>
                      </td>
                      <td className="py-3 pr-4 text-text">{product?.name ?? r.product}</td>
                      <td className="mono py-3 pr-4 text-text-2">
                        {r.tag}
                        {r.prerelease && <span className="chip ml-2">{c.prerelease}</span>}
                      </td>
                      <td className="py-3 text-right">
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="link-ul mono text-[12.5px] text-text-2">
                          GitHub ↗
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
