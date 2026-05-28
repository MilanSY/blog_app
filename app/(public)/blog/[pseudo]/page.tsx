import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicBlogByPseudo } from "@/lib/data/blog";

export const revalidate = 300;

type BlogPageProps = {
  params: Promise<{
    pseudo: string;
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

export default async function BlogPage({ params }: BlogPageProps) {
  const { pseudo } = await params;
  const data = await getPublicBlogByPseudo(pseudo);

  if (!data) {
    notFound();
  }

  const interests = data.blog.interests?.join(", ") || "empty";
  const avatarUrl = data.blog.avatar_url;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <section className="rounded-md border border-gray-200 p-6">
         <div className="mt-3">
          {avatarUrl?.startsWith("/") ? (
            <Image
              src={avatarUrl}
              alt={`${data.blog.pseudo} avatar`}
              width={72}
              height={72}
              className="mt-2 h-[72px] w-[72px] rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-700">{avatarUrl || "empty"}</p>
          )}
        </div>
        <h1 className="text-3xl font-semibold">{data.blog.pseudo}</h1>
        <p className="mt-3 text-sm text-gray-700">Bio: {data.blog.bio || "empty"}</p>
       
        <p className="mt-2 text-sm text-gray-700">Interests: {interests}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Posts</h2>

        {data.posts.length === 0 ? (
          <p className="mt-4 text-sm text-gray-600">empty</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {data.posts.map((post) => (
              <li key={post.id} className="rounded-md border border-gray-200 p-4">
                <Link
                  href={`/blog/${data.blog.pseudo}/${post.id}`}
                  className="text-lg font-medium hover:underline"
                >
                  {post.title}
                </Link>
                <p className="mt-1 text-sm text-gray-600">
                  Published: {formatPublishedAt(post.published_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
