import Link from "next/link";
import { ko } from "@/i18n/dictionaries/ko";
import { en } from "@/i18n/dictionaries/en";
import { Wordmark } from "@/components/brand/Wordmark";

/** Rendered inside the locale layout. The locale is not available here, so
 *  both languages are shown, Korean first. */
export default function NotFound() {
  return (
    <main className="container flex flex-1 flex-col justify-center py-24">
      <Wordmark size={22} />
      <p className="index mt-12">404</p>
      <h1 className="h-section mt-3 text-text" lang="ko">{ko.notFound.title}</h1>
      <p className="mt-3 text-text-2" lang="ko">{ko.notFound.body}</p>
      <p className="mt-6 text-text-2" lang="en">
        {en.notFound.title}. {en.notFound.body}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/ko" className="btn btn-primary" lang="ko">{ko.notFound.home}</Link>
        <Link href="/en" className="btn btn-secondary" lang="en">{en.notFound.home}</Link>
      </div>
    </main>
  );
}
