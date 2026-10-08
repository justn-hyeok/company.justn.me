import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { LegalPage } from "@/components/legal/LegalPage";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.legal.privacy.title,
    alternates: {
      canonical: `${site.url}/${locale}/privacy`,
      languages: { ko: `${site.url}/ko/privacy`, en: `${site.url}/en/privacy`, "x-default": `${site.url}/ko/privacy` },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <LegalPage locale={locale} dict={dict} doc={dict.legal.privacy} />;
}
