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

      {/* Hero */}
      <section className="py-20 px-8 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto text-center">
          <span className="text-xs text-secondary font-bold tracking-widest uppercase block mb-4">The Journal</span>
          <h1 className="font-serif text-6xl md:text-7xl font-semibold mb-6 text-on-surface tracking-tight">Clinical Insights</h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">Expert commentary on phlebotomy trends, medical technology, and career advancement in the diagnostic sector.</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 px-8 bg-surface">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center mb-8 mx-auto">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">article</span>
              </div>
              <h2 className="font-serif text-4xl font-semibold text-on-surface mb-6">Editorial Content Coming Soon</h2>
              <p className="text-lg text-on-surface-variant mb-8 max-w-lg mx-auto">We&apos;re curating premium phlebotomy career insights and industry analysis. Check back soon for expert commentary.</p>
              <Link href="/" className="cta-gradient text-white font-bold py-4 px-8 rounded-lg text-lg transition-all hover:shadow-lg inline-block">
                Browse Training Programs
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="block bg-surface-container-lowest rounded-2xl p-8 hover:shadow-xl transition-all duration-500 group ghost-border">
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-4 font-medium">
                    <span>{post.author}</span>
                    <span className="w-1 h-1 bg-on-surface-variant rounded-full"></span>
                    <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 group-hover:text-secondary transition-colors text-on-surface leading-snug tracking-tight">{post.title}</h2>
                  {post.excerpt && <p className="text-on-surface-variant mb-6 text-lg leading-relaxed">{post.excerpt}</p>}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-surface-container text-on-surface px-3 py-1 rounded-full font-medium uppercase tracking-widest">{tag}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="pb-32 px-8">
        <div className="max-w-screen-2xl mx-auto bg-primary-container rounded-[2rem] p-16 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)", backgroundSize: "40px 40px"}}></div>
          <div className="relative z-10">
            <h2 className="font-serif text-5xl md:text-6xl font-semibold text-white mb-6 tracking-tight">Stay Updated on Healthcare Trends</h2>
            <p className="text-on-primary-container text-lg max-w-2xl mx-auto mb-12 leading-relaxed">Get the latest phlebotomy industry insights, certification updates, and career guidance delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-secondary outline-none placeholder:text-white/60" placeholder="Enter your email" type="email"/>
              <button className="cta-gradient text-white px-8 py-4 rounded-xl font-bold transition-transform active:scale-95 shadow-lg">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

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