import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

interface LegalPageProps {
  locale: Locale;
  dict: Dictionary;
  doc: Dictionary["legal"]["terms"];
}

/** Same tokens and type as the landing page, no animation: a document. */
export function LegalPage({ locale, dict, doc }: LegalPageProps) {
  const dateFmt = new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-GB", { year: "numeric", month: "long", day: "numeric" });
  return (
    <>
      <SiteHeader locale={locale} dict={dict} nav={false} />
      <main id="main" className="container flex-1 py-16 md:py-24">
        <article className="doc">
          <p className="index mb-4">
            {dict.legal.updated} · <time dateTime={site.legalUpdated}>{dateFmt.format(new Date(site.legalUpdated))}</time>
          </p>
          <h1>{doc.title}</h1>
          <p className="intro">{doc.intro}</p>
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          <p className="mt-12">
            <Link href={`/${locale}`} className="btn btn-secondary !h-10 text-[14px]">
              ← {dict.legal.back}
            </Link>
          </p>
        </article>
      </main>
      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
