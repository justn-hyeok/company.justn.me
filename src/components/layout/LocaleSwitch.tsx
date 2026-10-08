"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { otherLocale, type Locale } from "@/i18n/config";

interface LocaleSwitchProps {
  locale: Locale;
  label: string;
  ariaLabel: string;
  className?: string;
}

/** Swaps the locale prefix and keeps the rest of the path plus the current
 *  section hash, so switching language lands on the same section. */
export function LocaleSwitch({ locale, label, ariaLabel, className = "" }: LocaleSwitchProps) {
  const pathname = usePathname();
  const target = otherLocale(locale);
  const rest = pathname.replace(/^\/(ko|en)(?=\/|$)/, "");
  const [hash, setHash] = useState("");

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return (
    <Link
      href={`/${target}${rest}${hash}`}
      hrefLang={target}
      lang={target}
      aria-label={ariaLabel}
      className={`btn btn-ghost mono text-[13px] ${className}`}
      onClick={() => setHash(window.location.hash)}
    >
      <span aria-hidden="true" className="text-text-3">{locale.toUpperCase()}</span>
      <span aria-hidden="true" className="text-text-3">/</span>
      <span>{label}</span>
    </Link>
  );
}
