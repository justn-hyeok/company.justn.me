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
      <main id="main" className="container doc-layout section flex-1">
        <nav className="doc-toc" aria-label={doc.title}>
          <ol>
            {doc.sections.map((s, i) => (
              <li key={s.h}><a href={`#article-${i + 1}`}>{s.h}</a></li>
            ))}
          </ol>
        </nav>
        <article className="doc" aria-labelledby="document-title">
          <p className="index mb-4">
            {dict.legal.updated} · <time dateTime={site.legalUpdated}>{dateFmt.format(new Date(site.legalUpdated))}</time>
          </p>
          <h1 id="document-title">{doc.title}</h1>
          <p className="intro">{doc.intro}</p>
          {doc.sections.map((s, i) => (
            <section key={s.h} id={`article-${i + 1}`} aria-labelledby={`article-heading-${i + 1}`}>
              <h2 id={`article-heading-${i + 1}`}>{s.h}</h2>
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          <div className="mt-12 border-t border-border pt-8">
            <Link href={`/${locale}`} className="btn btn-secondary !h-10 text-[14px]">
              ← {dict.legal.back}
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
