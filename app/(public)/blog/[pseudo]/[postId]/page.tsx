import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicPostById } from "@/lib/data/blog";

export const revalidate = 300;

type BlogPostPageProps = {
  params: Promise<{
    pseudo: string;
    post: string;
  }>;
};

function formatPublishedAt(value: string | null) {
  if (!value) {
    return "empty";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { pseudo, post } = await params;
  const data = await getPublicPostById(pseudo, post);

  if (!data) {
    notFound();
  }

  const interests = data.blog.interests?.join(", ") || "empty";

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <p className="text-sm text-gray-600">
        <Link href={`/blog/${data.blog.pseudo}`} className="hover:underline">
          {data.blog.pseudo}
        </Link>
      </p>

      <article className="mt-4 rounded-md border border-gray-200 p-6">
        <h1 className="text-3xl font-semibold">{data.post.title}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Published: {formatPublishedAt(data.post.published_at)}
        </p>
        <p className="mt-2 text-sm text-gray-700">
          Cover image: {data.post.cover_image_url || "empty"}
        </p>
        <div
          className="prose mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: data.post.content_html }}
        />
      </article>

      <section className="mt-6 rounded-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold">Author</h2>
        <p className="mt-2 text-sm text-gray-700">Bio: {data.blog.bio || "empty"}</p>
        <p className="mt-2 text-sm text-gray-700">
          Avatar: {data.blog.avatar_url || "empty"}
        </p>
        <p className="mt-2 text-sm text-gray-700">Interests: {interests}</p>
      </section>
    </main>
  );
}
