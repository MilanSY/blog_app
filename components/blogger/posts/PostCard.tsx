import Link from "next/link";
import { deletePostAction } from "@/app/actions/postEdit";

type PostCardProps = {
  pseudo: string;
  post: {
    id: string;
    title: string;
    slug: string;
    published_at: string | null;
    is_visible: boolean;
  };
};

export default function PostCard({ pseudo, post }: PostCardProps) {
  return (
    <article className="flex min-h-44 flex-col justify-between rounded-lg border border-gray-200 p-4">
      <div>
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="mt-1 text-xs text-gray-600">Slug: {post.slug}</p>
        <p className="mt-1 text-xs text-gray-600">
          Published: {post.published_at ? new Date(post.published_at).toLocaleString("fr-FR") : "empty"}
        </p>
        <p className="mt-1 text-xs text-gray-600">Visible: {post.is_visible ? "yes" : "no"}</p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/blog/${pseudo}/${post.id}/edit`}
          className="inline-flex rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Modifier
        </Link>
        <form action={deletePostAction}>
          <input type="hidden" name="post_id" value={post.id} />
          <button
            type="submit"
            className="inline-flex rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
          >
            Supprimer
          </button>
        </form>
      </div>
    </article>
  );
}
