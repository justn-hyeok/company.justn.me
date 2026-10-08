import { ImageResponse } from "next/og";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { products } from "@/content/products";

export const alt = "Justn — independent software studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`No font file for ${family}`);
  const res = await fetch(match[1]);
  return res.arrayBuffer();
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "ko");
  const title = "Justn";
  const label = "INDEPENDENT SOFTWARE STUDIO";
  const desc = dict.meta.ogDescription;

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 500 | 600; style: "normal" }[] = [];
  try {
    fonts.push({ name: "Geist", data: await loadGoogleFont("Geist", 600, title + label + products.map((p) => p.name).join("")), weight: 600, style: "normal" });
    fonts.push({
      name: "Body",
      data: await loadGoogleFont("Noto Sans KR", 400, desc + "company.justn.me" + products.map((p) => p.name + (p.release?.tag ?? "livewip")).join("")),
      weight: 400,
      style: "normal",
    });
  } catch {
    // Fall back to the renderer's default font rather than failing the build.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#040b09",
          color: "#ecf6ef",
          padding: 72,
          fontFamily: "Geist, Body, sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 18, letterSpacing: 2, color: "#8fb39e" }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: "#2ef2a8" }} />
            {label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ fontSize: 168, fontWeight: 600, letterSpacing: -9, lineHeight: 0.9 }}>{title}</div>
            <div style={{ fontFamily: "Body, sans-serif", fontSize: 26, lineHeight: 1.4, color: "#8fb39e", maxWidth: 540 }}>{desc}</div>
          </div>
          <div style={{ fontSize: 18, color: "#4f7462", letterSpacing: 1 }}>company.justn.me</div>
        </div>
        <div style={{ position: "absolute", right: 72, top: 120, display: "flex", flexDirection: "column", gap: 14, width: 420 }}>
          {products.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12, background: "#071410", border: `1px ${p.ownership === "cobuilt" ? "dashed" : "solid"} #1f4635` }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: p.live ? "#2ef2a8" : "#4f7462" }} />
              <div style={{ fontSize: 22, fontWeight: 600, color: "#ecf6ef", letterSpacing: -0.5 }}>{p.name}</div>
              <div style={{ marginLeft: "auto", fontSize: 16, color: "#8fb39e" }}>{p.release?.tag ?? (p.live ? "live" : "wip")}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
