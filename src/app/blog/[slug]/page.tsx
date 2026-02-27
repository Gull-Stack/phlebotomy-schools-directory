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
    title: post.seo_title || `${post.title} | PhlebGuide Blog`,
    description: post.seo_description || post.excerpt || `Read ${post.title} on the PhlebGuide blog for phlebotomy career tips and training advice.`,
    keywords: post.tags || ["phlebotomy", "healthcare careers", "medical training"],
    openGraph: {
      title: post.seo_title || `${post.title} | PhlebGuide Blog`,
      description: post.seo_description || post.excerpt || `Read ${post.title} on the PhlebGuide blog for phlebotomy career tips and training advice.`,
      url: `https://phlebguide.com/blog/${slug}`,
      type: "article",
      ...(post.cover_image && { images: [{ url: post.cover_image }] }),
    },
    alternates: {
      canonical: `https://phlebguide.com/blog/${slug}`,
    },
  };
}

function renderMarkdown(md: string): string {
  // Simple markdown to HTML (headings, bold, italic, links, lists, paragraphs)
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="text-xl md:text-2xl font-bold mt-8 mb-4 text-black">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl md:text-3xl font-bold mt-10 mb-6 text-black">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl md:text-4xl font-bold mt-10 mb-6 text-black">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 underline hover:text-blue-700 font-medium" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700">$2</li>');
  
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="my-6 space-y-2">$1</ul>');
  
  // Wrap remaining lines in <p>
  html = html.split('\n').map(line => {
    if (line.trim() === '') return '';
    if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<li') || line.startsWith('</')) return line;
    return `<p class="mb-6 leading-relaxed text-gray-700 text-lg">${line}</p>`;
  }).join('\n');

  return html;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabaseAdmin.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").single();
  const post = data as BlogPost | null;
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">PhlebGuide</Link>
          <nav className="flex gap-8">
            <Link href="/#schools" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Browse States</Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Blog</Link>
          </nav>
        </div>
      </header>

      <div className="bg-blue-50 py-4 px-6">
        <div className="max-w-4xl mx-auto text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600 font-medium">Home</Link>{" / "}
          <Link href="/blog" className="hover:text-blue-600 font-medium">Blog</Link>{" / "}
          <span className="text-black font-medium">{post.title}</span>
        </div>
      </div>

      <article className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
              <span>By {post.author}</span>
              <span>|</span>
              <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {post.cover_image && (
            <img src={post.cover_image} alt={post.title} className="w-full rounded-2xl mb-12 max-h-96 object-cover shadow-sm" />
          )}

          <div className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />

          <div className="mt-16 pt-8 border-t border-gray-200">
            <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-bold text-lg">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </article>

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
