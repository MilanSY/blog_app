import type { Metadata } from "next";
import { getAboutContent } from "@/lib/data/about";

export const metadata: Metadata = {
  title: "About | Blog App",
  description: "Learn more about Blog App.",
};

export default async function AboutPage() {
  const about = await getAboutContent();

  if (!about) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-semibold">About</h1>
        <p className="mt-4 text-gray-600">
          This page is not available at the moment.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">{about.title}</h1>
      <article
        className="prose mt-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: about.contentHtml }}
      />
    </main>
  );
}
