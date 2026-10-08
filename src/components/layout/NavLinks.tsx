"use client";

import { useEffect, useState } from "react";

interface NavLinksProps {
  items: { href: string; id: string; label: string }[];
}

/** Section anchors with an animated underline that follows the section
 *  currently in view. */
export function NavLinks({ items }: NavLinksProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((s): s is HTMLElement => !!s);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.1, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="primary" className="ml-auto hidden items-center gap-1 md:flex">
      {items.map((item) => (
        <a key={item.href} href={item.href} className="btn btn-ghost nav-link !h-11 !text-[14px]" data-active={active === item.id} aria-current={active === item.id ? "location" : undefined}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
