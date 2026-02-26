import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { BlogPost } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabaseAdmin.from("blog_posts").select("slug").eq("status", "published");
  return (data || []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabaseAdmin.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").single();
  const post = data as BlogPost | null;
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.seo_title || `${post.title} | Phlebotomy Blog`,
    description: post.seo_description || post.excerpt || `Read ${post.title} on the Phlebotomy Schools blog.`,
  };
}

function renderMarkdown(md: string): string {
  // Simple markdown to HTML (headings, bold, italic, links, lists, paragraphs)
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-red-500 underline hover:text-red-400" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>');
  
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="my-4 space-y-1">$1</ul>');
  
  // Wrap remaining lines in <p>
  html = html.split('\n').map(line => {
    if (line.trim() === '') return '';
    if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<li') || line.startsWith('</')) return line;
    return `<p class="mb-4 leading-relaxed">${line}</p>`;
  }).join('\n');

  return html;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabaseAdmin.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").single();
  const post = data as BlogPost | null;
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-red-500">Phlebotomy Schools</Link>
          <nav className="flex gap-6">
            <Link href="/#schools" className="hover:text-red-500">Browse States</Link>
            <Link href="/blog" className="hover:text-red-500">Blog</Link>
          </nav>
        </div>
      </header>

      <div className="bg-gray-900/50 py-3 px-6">
        <div className="max-w-4xl mx-auto text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>{" / "}
          <Link href="/blog" className="hover:text-white">Blog</Link>{" / "}
          <span className="text-white">{post.title}</span>
        </div>
      </div>

      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>By {post.author}</span>
              <span>|</span>
              <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {post.cover_image && (
            <img src={post.cover_image} alt={post.title} className="w-full rounded-xl mb-8 max-h-96 object-cover" />
          )}

          <div className="prose prose-invert max-w-none text-gray-300"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />

          <div className="mt-16 pt-8 border-t border-gray-800">
            <Link href="/blog" className="text-red-500 hover:text-red-400 font-bold">
              &larr; Back to Blog
            </Link>
          </div>
        </div>
      </article>

      <footer className="py-10 px-6 bg-gray-900 text-center text-gray-500">
        <p>&copy; 2026 Phlebotomy Schools Directory</p>
      </footer>
    </main>
  );
}
