import Link from "next/link";
import HomeSearchForm from "@/components/public/HomeSearchForm";
import { getVisibleBlogsNewestFirst } from "@/lib/data/blog";

function formatPublishedAt(value: string | null) {
  if (!value) {
    return "empty";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type HomePageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const blogs = await getVisibleBlogsNewestFirst(query);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <section>
        <h1 className="text-3xl font-semibold">Visible blogs</h1>
        <p className="mt-2 text-sm text-gray-600">Sorted from newest to oldest.</p>
        <HomeSearchForm initialQuery={query} />
      </section>

      {blogs.length === 0 ? (
        <p className="mt-6 text-sm text-gray-600">empty</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {blogs.map((blog) => (
            <li key={blog.id} className="rounded-md border border-gray-200 p-4">
              <Link href={`/blog/${blog.pseudo}`} className="text-lg font-medium hover:underline">
                {blog.pseudo}
              </Link>
              <p className="mt-1 text-sm text-gray-700">Bio: {blog.bio || "empty"}</p>
              <p className="mt-1 text-sm text-gray-600">
                Latest post: {formatPublishedAt(blog.latestPublishedAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
