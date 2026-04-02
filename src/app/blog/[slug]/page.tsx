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
    .replace(/^### (.+)$/gm, '<h3 class="font-serif text-2xl md:text-3xl font-semibold mt-8 mb-4 text-on-surface">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-serif text-3xl md:text-4xl font-semibold mt-10 mb-6 text-on-surface">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-serif text-4xl md:text-5xl font-semibold mt-10 mb-6 text-on-surface">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-on-surface">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-secondary underline hover:text-secondary/80 font-medium" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-on-surface-variant">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-on-surface-variant">$2</li>');
  
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="my-6 space-y-2">$1</ul>');
  
  // Wrap remaining lines in <p>
  html = html.split('\n').map(line => {
    if (line.trim() === '') return '';
    if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<li') || line.startsWith('</')) return line;
    return `<p class="mb-6 leading-relaxed text-on-surface-variant text-lg">${line}</p>`;
  }).join('\n');

  return html;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabaseAdmin.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").single();
  const post = data as BlogPost | null;
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-surface text-on-surface font-body">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-medium font-serif text-slate-900 tracking-tight">PhlebGuide</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#schools" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Find Programs</Link>
              <Link href="/#states" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">State Directory</Link>
              <Link href="/blog" className="text-blue-700 font-semibold border-b-2 border-blue-700 pb-1">Career Blog</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/#get-matched" className="cta-gradient text-white px-6 py-2.5 rounded-lg font-medium text-sm">Request Info</Link>
          </div>
        </div>
        <div className="bg-slate-100/50 h-[1px] w-full"></div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-surface-container-low py-4 px-8">
        <div className="max-w-4xl mx-auto text-sm text-on-surface-variant">
          <Link href="/" className="hover:text-secondary font-medium">Home</Link>{" / "}
          <Link href="/blog" className="hover:text-secondary font-medium">Blog</Link>{" / "}
          <span className="text-on-surface font-medium">{post.title}</span>
        </div>
      </div>

      <article className="py-16 px-8 bg-surface">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-semibold mb-6 text-on-surface leading-tight tracking-tight">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-on-surface-variant font-medium">
              <span>By {post.author}</span>
              <span className="w-1 h-1 bg-on-surface-variant rounded-full"></span>
              <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-surface-container text-on-surface px-3 py-1 rounded-full font-medium uppercase tracking-widest">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="mb-12">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full rounded-2xl max-h-96 object-cover shadow-sm ghost-border" 
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />

          {/* Back to Blog */}
          <div className="mt-16 pt-8 border-t border-outline-variant/20">
            <Link href="/blog" className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-bold text-lg">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Clinical Insights
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-slate-50 w-full border-t border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-12 py-20 max-w-screen-2xl mx-auto text-sm tracking-wide">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-semibold font-serif text-slate-900 mb-6">PhlebGuide</div>
            <p className="text-slate-500 mb-8 max-w-xs">&copy; 2026 PhlebGuide. Clinical Excellence in Phlebotomy Education.</p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary cursor-pointer">social_leaderboard</span>
              <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary cursor-pointer">linked_camera</span>
              <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary cursor-pointer">mail</span>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-6">Education</h5>
            <ul className="space-y-4">
              <li><Link href="/#schools" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">Program Directory</Link></li>
              <li><Link href="/#states" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">State Requirements</Link></li>
              <li><Link href="/blog" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">Certification Prep</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-6">Resources</h5>
            <ul className="space-y-4">
              <li><Link href="/blog" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">Career Center</Link></li>
              <li><Link href="/privacy" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-6">Contact</h5>
            <p className="text-slate-500">
              Questions about clinical training? <br/>
              <Link href="mailto:info@phlebguide.com" className="text-blue-800 font-medium hover:text-blue-600 transition-colors">
                info@phlebguide.com
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}