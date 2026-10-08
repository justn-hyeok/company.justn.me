import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { cobuiltProducts, ownProducts } from "@/content/products";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Hero } from "@/components/hero/Hero";
import { ProductExplorer } from "@/components/products/ProductExplorer";
import { Philosophy } from "@/components/sections/Philosophy";
import { Milestones } from "@/components/sections/Milestones";
import { Founder } from "@/components/sections/Founder";
import { Company } from "@/components/sections/Company";
import { Contact } from "@/components/sections/Contact";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  // Organization data: only facts that appear on the page. Own products are
  // listed as creations; team products are listed with justn as contributor.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.name,
      url: site.url,
      email: site.email,
      description: dict.meta.description,
      foundingDate: site.foundedDate,
      numberOfEmployees: { "@type": "QuantitativeValue", value: 1 },
      founder: { "@type": "Person", name: site.founder.latinName, alternateName: site.founder.name, url: site.founder.portfolio, sameAs: [site.founder.github] },
      sameAs: [site.github],
    },
    ...ownProducts.map((p) => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: p.name,
      url: p.url,
      applicationCategory: "DeveloperApplication",
      ...(p.stack.includes("Rust") ? { operatingSystem: "macOS" } : {}),
      ...(p.release ? { softwareVersion: p.release.tag } : {}),
      creator: { "@type": "Organization", name: site.name, url: site.url },
    })),
    ...cobuiltProducts.map((p) => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: p.name,
      url: p.url,
      applicationCategory: "WebApplication",
      contributor: { "@type": "Organization", name: site.name, url: site.url },
    })),
  ];

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main id="main" className="flex-1">
        <Hero dict={dict} locale={locale} />

        <section id="products" className="section scroll-mt-16" aria-labelledby="products-title">
          <div className="container">
            <Reveal>
              <SectionHeading index={dict.sections.products.index} title={dict.sections.products.title} lede={dict.sections.products.lede} align="split" titleId="products-title" />
            </Reveal>
            <div className="mt-12 md:mt-16">
              <ProductExplorer dict={dict} locale={locale} />
            </div>
          </div>
        </section>

        <Philosophy dict={dict} />
        <Milestones dict={dict} locale={locale} />
        <Founder dict={dict} />
        <Company dict={dict} locale={locale} />
        <Contact dict={dict} />
      </main>
      <SiteFooter locale={locale} dict={dict} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
