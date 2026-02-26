import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { BlogPost } from "@/lib/types";

export const revalidate = 3600;

export const metadata = {
  title: "Phlebotomy Blog | Career Tips, Guides & Industry News",
  description: "Expert advice on phlebotomy training, certification, career tips, and industry news. Start your healthcare career with confidence.",
};

async function getPosts() {
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data || []) as BlogPost[];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-red-500">Phlebotomy Schools</Link>
          <nav className="flex gap-6">
            <Link href="/#schools" className="hover:text-red-500">Browse States</Link>
            <Link href="/blog" className="text-red-500 font-bold">Blog</Link>
          </nav>
        </div>
      </header>

      <section className="py-16 px-6 bg-gradient-to-b from-red-900/20 to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Phlebotomy Blog</h1>
          <p className="text-xl text-gray-300">Career tips, training guides, and industry insights</p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500 mb-4">No posts yet</p>
              <p className="text-gray-600">Check back soon for phlebotomy career tips and guides.</p>
              <Link href="/" className="inline-block mt-8 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-3 px-6 rounded-lg transition">
                Browse Schools
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="block bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-red-500 transition group">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>{post.author}</span>
                    <span>|</span>
                    <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-red-500 transition">{post.title}</h2>
                  {post.excerpt && <p className="text-gray-400 mb-4">{post.excerpt}</p>}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded">{tag}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="py-10 px-6 bg-gray-900 text-center text-gray-500">
        <p>&copy; 2026 Phlebotomy Schools Directory</p>
      </footer>
    </main>
  );
}
