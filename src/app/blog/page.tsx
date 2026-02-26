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
    <main className="min-h-screen bg-white text-black">
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">PhlebGuide</Link>
          <nav className="flex gap-8">
            <Link href="/#schools" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Browse States</Link>
            <Link href="/blog" className="text-blue-600 font-bold">Blog</Link>
          </nav>
        </div>
      </header>

      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black">Phlebotomy Blog</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">Career tips, training guides, and industry insights</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-3xl text-gray-600 mb-6 font-bold">No posts yet</p>
              <p className="text-xl text-gray-500 mb-8">Check back soon for phlebotomy career tips and guides.</p>
              <Link href="/" className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:shadow-lg">
                Browse Schools
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="block bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition-all group">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 font-medium">
                    <span>{post.author}</span>
                    <span>|</span>
                    <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors text-black">{post.title}</h2>
                  {post.excerpt && <p className="text-gray-600 mb-6 text-lg leading-relaxed">{post.excerpt}</p>}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-white">PhlebGuide</Link>
            <p className="mt-4 text-gray-300 text-lg">
              Your trusted guide to finding accredited phlebotomy training programs
            </p>
          </div>
          <div className="flex justify-center gap-8 mb-8">
            <Link href="/about" className="text-gray-300 hover:text-white font-medium transition-colors">About</Link>
            <Link href="/blog" className="text-gray-300 hover:text-white font-medium transition-colors">Blog</Link>
            <Link href="/contact" className="text-gray-300 hover:text-white font-medium transition-colors">Contact</Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white font-medium transition-colors">Privacy</Link>
          </div>
          <div className="text-center text-gray-400 text-sm border-t border-gray-700 pt-8">
            <p>&copy; 2026 PhlebGuide. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
