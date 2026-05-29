import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublicPostById } from "@/lib/data/blog";

export const revalidate = 300;

type BlogPostPageProps = {
  params: Promise<{
    pseudo: string;
    postId: string;
  }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { pseudo, postId } = await params;
  const data = await getPublicPostById(pseudo, postId);

  if (!data) {
    return {
      title: "Post not found | Blog App",
      description: "This post is unavailable.",
    };
  }

  return {
    title: `${data.post.title} | ${data.blog.pseudo} | Blog App`,
    description: `Read ${data.post.title} by ${data.blog.pseudo}.`,
  };
}

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
  const { pseudo, postId } = await params;
  const data = await getPublicPostById(pseudo, postId);

  if (!data) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <p className="text-sm text-gray-600">
        <Link href={`/blog/${data.blog.pseudo}`} className="hover:underline">
          {data.blog.pseudo}
        </Link>
      </p>

      <article className="mt-4 rounded-md border border-gray-200 p-6">
        {data.post.cover_image_url ? (
          <div className="relative mb-6 h-64 w-full overflow-hidden rounded-md sm:h-80 lg:h-96">
            <Image
              src={data.post.cover_image_url}
              alt={data.post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 896px, 1024px"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        <h1 className="text-3xl font-semibold">{data.post.title}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Published: {formatPublishedAt(data.post.published_at)}
        </p>
        <div
          className="prose mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: data.post.content_html }}
        />
      </article>

      <section className="mt-6 rounded-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold">Author</h2>
        <p className="mt-2 text-sm text-gray-700">Pseudo: {data.blog.pseudo}</p>
      </section>
    </main>
  );
}
