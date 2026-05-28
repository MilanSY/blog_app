import Link from "next/link";
import PostCard from "@/components/blogger/posts/PostCard";

type PostCardsGridProps = {
  pseudo: string;
  posts: {
    id: string;
    title: string;
    slug: string;
    published_at: string | null;
    is_visible: boolean;
  }[];
};

export default function PostCardsGrid({ pseudo, posts }: PostCardsGridProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} pseudo={pseudo} post={post} />
      ))}

      <Link
        href={`/blog/${pseudo}/post/add`}
        className="flex min-h-44 items-center justify-center rounded-lg border border-dashed border-gray-300 text-5xl text-gray-500 hover:bg-gray-50"
        aria-label="Add post"
      >
        +
      </Link>
    </div>
  );
}
