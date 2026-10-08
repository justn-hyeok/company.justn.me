import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";

/** Small editorial profile. No portrait: none was provided, and a stock or
 *  generated face would be a lie. */
export function Founder({ dict }: { dict: Dictionary }) {
  const { founder } = dict;
  return (
    <section id="founder" className="section scroll-mt-16 border-t border-border" aria-labelledby="founder-title">
      <div className="container">
        <Reveal className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <SectionHeading index={dict.sections.founder.index} title={dict.sections.founder.title} titleId="founder-title" />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="flex flex-col gap-6 border-t border-border-strong pt-6">
              <div>
                <p className="text-[24px] font-[560] leading-snug tracking-[-0.02em] text-text">{founder.name}</p>
                <p className="mono mt-2 text-[12.5px] text-text-2">{founder.role}</p>
              </div>
              <p className="max-w-[58ch] text-[16px] leading-[1.75] text-text-2">{founder.body}</p>
              <dl className="grid grid-cols-1 gap-6 border-y border-border py-6 sm:grid-cols-2">
                <div>
                  <dt className="index mb-2">{founder.stackLabel}</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {founder.stack.map((s) => (
                      <span key={s} className="text-[14px] text-text-2 not-last:after:mx-2 not-last:after:content-['·']">{s}</span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="index mb-2">{founder.ossLabel}</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {founder.oss.map((s) => (
                      <a key={s} href={`${site.github}/${s}`} target="_blank" rel="noopener noreferrer" className="link-ul mr-3 text-[14px] text-text-2">
                        {s} ↗
                      </a>
                    ))}
                  </dd>
                </div>
              </dl>
              <div>
                <p className="index mb-2">{founder.contribLabel}</p>
                <ul className="m-0 list-none p-0 text-[14.5px] leading-relaxed text-text-2">
                  {founder.contrib.map((c) => (
                    <li key={c.href}>
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="link-ul">{c.text} ↗</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={site.founder.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary !h-10 text-[14px]">
                  {founder.links.github} · {site.githubHandle}
                </a>
                <a href={site.founder.portfolio} target="_blank" rel="noopener noreferrer" className="btn btn-secondary !h-10 text-[14px]">
                  {founder.links.portfolio} · justn.me
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
