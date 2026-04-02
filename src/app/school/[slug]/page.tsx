import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { stateNames } from "@/lib/states";
import { School } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabaseAdmin.from("schools").select("slug");
  return (data || []).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabaseAdmin.from("schools").select("*").eq("slug", slug).single();
  const school = data as School | null;
  
  if (!school) return { title: "School Not Found" };
  
  return {
    title: `${school.name} Phlebotomy Program | Tuition, Reviews & Info`,
    description: `${school.name} phlebotomy training program in ${school.city}, ${school.state}. Tuition: $${school.tuition_low}-$${school.tuition_high}. ${school.program_length_display}. ${(school.accreditation || []).join(", ")} accredited.`
  };
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabaseAdmin.from("schools").select("*").eq("slug", slug).single();
  const school = data as School | null;
  
  if (!school) notFound();
  
  return (
    <main className="min-h-screen bg-surface text-on-surface font-body">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-medium font-serif text-slate-900 tracking-tight">PhlebGuide</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#schools" className="text-blue-700 font-semibold border-b-2 border-blue-700 pb-1">Find Programs</Link>
              <Link href="/#states" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">State Directory</Link>
              <Link href="/blog" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Career Blog</Link>
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
        <div className="max-w-screen-2xl mx-auto text-sm text-on-surface-variant">
          <Link href="/" className="hover:text-secondary font-medium">Home</Link>
          {" / "}
          {!school.national && (
            <>
              <Link href={`/state/${school.state_code.toLowerCase()}`} className="hover:text-secondary font-medium">
                {stateNames[school.state_code] || school.state}
              </Link>
              {" / "}
            </>
          )}
          <span className="text-on-surface font-medium">{school.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 px-8 bg-surface">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-6xl md:text-7xl font-semibold mb-4 text-on-surface tracking-tight">{school.name}</h1>
              <div className="flex items-center gap-2 text-xl md:text-2xl text-on-surface-variant">
                <span className="material-symbols-outlined">location_on</span>
                {school.city}, {school.state}
              </div>
            </div>
            <span className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest ${
              school.program_type === 'online' ? 'bg-secondary-fixed text-secondary' :
              school.program_type === 'hybrid' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container text-on-surface'
            }`}>
              {school.program_type === 'online' ? 'Online' :
               school.program_type === 'hybrid' ? 'Hybrid' : 'In-Person'}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-surface-container-lowest rounded-xl p-6 text-center shadow-sm ghost-border">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                {school.tuition_low ? (
                  <>
                    ${school.tuition_low.toLocaleString()}
                    {school.tuition_high && school.tuition_high > school.tuition_low && (
                      <div className="text-lg text-on-surface-variant"> - ${school.tuition_high.toLocaleString()}</div>
                    )}
                  </>
                ) : 'Contact School'}
              </div>
              <div className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">Tuition</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 text-center shadow-sm ghost-border">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">{school.program_length_display}</div>
              <div className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">Duration</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 text-center shadow-sm ghost-border">
              <div className="text-lg font-bold text-secondary mb-2">{(school.accreditation || []).join(", ") || "N/A"}</div>
              <div className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">Accreditation</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 text-center shadow-sm ghost-border">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                {school.externship_included ? (school.externship_hours ? `${school.externship_hours} hrs` : "Yes") : "No"}
              </div>
              <div className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">Externship</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mb-16">
            {school.website && (
              <a href={school.website} target="_blank" rel="noopener noreferrer"
                className="flex-1 cta-gradient text-white font-bold py-5 px-8 rounded-lg text-center text-lg transition-all hover:shadow-lg">
                Visit School Website
              </a>
            )}
            <Link href="/#get-matched"
              className="bg-surface-container-lowest border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-bold py-5 px-8 rounded-lg text-lg transition-all hover:shadow-lg">
              Request Info
            </Link>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm ghost-border">
              <h2 className="font-serif text-3xl font-semibold mb-6">Program Details</h2>
              <dl className="space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                  <dt className="text-on-surface-variant font-medium">Program Type</dt>
                  <dd className="font-bold capitalize text-on-surface">{school.program_type}</dd>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                  <dt className="text-on-surface-variant font-medium">Duration</dt>
                  <dd className="font-bold text-on-surface">{school.program_length_display}</dd>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                  <dt className="text-on-surface-variant font-medium">Tuition Range</dt>
                  <dd className="font-bold text-secondary">${school.tuition_low.toLocaleString()} - ${school.tuition_high.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                  <dt className="text-on-surface-variant font-medium">Financial Aid</dt>
                  <dd className="font-bold text-on-surface">{school.financial_aid ? "Available" : "Not Available"}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-on-surface-variant font-medium">Externship</dt>
                  <dd className="font-bold text-on-surface">{school.externship_included ? (school.externship_hours ? `${school.externship_hours} hours` : "Included") : "Not Included"}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm ghost-border">
              <h2 className="font-serif text-3xl font-semibold mb-6">Certifications</h2>
              <div className="mb-6">
                <h3 className="text-on-surface-variant font-medium text-sm mb-3 uppercase tracking-wider">Accreditation</h3>
                <div className="flex flex-wrap gap-2">
                  {(school.accreditation || []).length > 0 ? school.accreditation.map(acc => (
                    <span key={acc} className="bg-secondary-fixed text-secondary px-4 py-2 rounded-full text-sm font-medium">{acc}</span>
                  )) : <span className="text-on-surface-variant">Not specified</span>}
                </div>
              </div>
              <div>
                <h3 className="text-on-surface-variant font-medium text-sm mb-3 uppercase tracking-wider">Prepares For</h3>
                <div className="flex flex-wrap gap-2">
                  {(school.certifications_prepared || []).map(cert => (
                    <span key={cert} className="bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-full text-sm font-medium">{cert}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Program Highlights */}
          {school.highlights && school.highlights.length > 0 && (
            <div className="mt-8 bg-surface-container-low rounded-2xl p-8 ghost-border">
              <h2 className="font-serif text-3xl font-semibold mb-6">Program Highlights</h2>
              <ul className="grid md:grid-cols-2 gap-4">
                {school.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-3 text-on-surface-variant">
                    <span className="text-secondary text-lg font-bold">✓</span> 
                    <span className="font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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