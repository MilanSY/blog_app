import { redirect } from "next/navigation";
import { toggleBlogVisibilityAction, togglePostVisibilityAction } from "@/app/actions/admin";
import { getSession } from "@/lib/auth/session";
import { getModerationData } from "@/lib/data/moderation";

export default async function AdminModerationPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "admin") {
    redirect("/");
  }

  const { blogs, posts } = await getModerationData();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Admin - Moderation</h1>
      <p className="mt-2 text-sm text-gray-600">Toggle visibility for blogs and posts.</p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Blogs</h2>
        <div className="mt-3 overflow-hidden rounded-md border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-3 py-2">Pseudo</th>
                <th className="px-3 py-2">Visible</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-t border-gray-200">
                  <td className="px-3 py-2">{blog.pseudo}</td>
                  <td className="px-3 py-2">{blog.is_visible ? "yes" : "no"}</td>
                  <td className="px-3 py-2">
                    <form action={toggleBlogVisibilityAction}>
                      <input type="hidden" name="blog_id" value={blog.id} />
                      <input
                        type="hidden"
                        name="next_visible"
                        value={blog.is_visible ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
                      >
                        {blog.is_visible ? "Hide" : "Show"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Posts</h2>
        <div className="mt-3 overflow-hidden rounded-md border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Blog</th>
                <th className="px-3 py-2">Visible</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-gray-200">
                  <td className="px-3 py-2">{post.title}</td>
                  <td className="px-3 py-2">{post.blogs.pseudo}</td>
                  <td className="px-3 py-2">{post.is_visible ? "yes" : "no"}</td>
                  <td className="px-3 py-2">
                    <form action={togglePostVisibilityAction}>
                      <input type="hidden" name="post_id" value={post.id} />
                      <input
                        type="hidden"
                        name="next_visible"
                        value={post.is_visible ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
                      >
                        {post.is_visible ? "Hide" : "Show"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
