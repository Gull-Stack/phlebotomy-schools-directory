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
    description: `${school.name} phlebotomy training program in ${school.city}, ${school.state}. Tuition: $${school.tuition_low ?? 'N/A'}-$${school.tuition_high ?? 'N/A'}. ${school.program_length_display}. ${(school.accreditation || []).join(", ")} accredited.`
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
        <div className="flex justify-between items-center w-full px-6 py-3.5 max-w-6xl mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-medium font-serif text-slate-900 tracking-tight">PhlebGuide</Link>
            <nav className="hidden md:flex items-center gap-5 text-sm">
              <Link href="/#schools" className="text-blue-700 font-semibold border-b-2 border-blue-700 pb-0.5">Find Programs</Link>
              <Link href="/#states" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">State Directory</Link>
              <Link href="/blog" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Career Blog</Link>
            </nav>
          </div>
          <Link href="/#get-matched" className="cta-gradient text-white px-5 py-2 rounded-lg font-medium text-sm">Request Info</Link>
        </div>
        <div className="bg-slate-100/50 h-[1px] w-full"></div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-surface-container-low py-3 px-6">
        <div className="max-w-6xl mx-auto text-xs text-on-surface-variant">
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

      <section className="py-10 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          {/* School Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div className="flex items-start gap-5">
              {/* Logo Placeholder */}
              <div className="w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 ghost-border">
                <span className="material-symbols-outlined text-3xl text-secondary">school</span>
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-semibold text-on-surface tracking-tight mb-1">{school.name}</h1>
                <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {school.city}, {school.state}
                </div>
              </div>
            </div>
            <span className={`self-start px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shrink-0 ${
              school.program_type === 'online' ? 'bg-secondary-fixed text-secondary' :
              school.program_type === 'hybrid' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container text-on-surface'
            }`}>
              {school.program_type === 'online' ? 'Online' :
               school.program_type === 'hybrid' ? 'Hybrid' : 'In-Person'}
            </span>
          </div>

          {/* Description */}
          {school.description ? (
            <p className="text-on-surface-variant text-base leading-relaxed mb-8 max-w-3xl">{school.description}</p>
          ) : (
            <p className="text-on-surface-variant text-base leading-relaxed mb-8 max-w-3xl">
              {school.name} offers {school.program_type === 'online' ? 'online' : school.program_type === 'hybrid' ? 'hybrid' : 'in-person'} phlebotomy training
              {school.city && school.state ? ` in ${school.city}, ${school.state}` : ' with multiple locations nationwide'}. 
              {school.program_length_display && ` The program runs ${school.program_length_display}`}
              {(school.accreditation || []).length > 0 && ` and is accredited by ${school.accreditation.join(', ')}`}.
              {school.externship_included && ' Includes hands-on clinical externship experience.'}
              {school.financial_aid && ' Financial aid options are available for qualifying students.'}
            </p>
          )}

          {/* Stats Grid — compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface-container-lowest rounded-lg p-4 text-center ghost-border">
              <div className="text-xl font-bold text-secondary mb-0.5">
                {school.tuition_low != null ? (
                  <>
                    ${school.tuition_low.toLocaleString()}
                    {school.tuition_high != null && school.tuition_high > school.tuition_low && (
                      <span className="text-sm text-on-surface-variant font-medium"> - ${school.tuition_high.toLocaleString()}</span>
                    )}
                  </>
                ) : 'Contact School'}
              </div>
              <div className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Tuition</div>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-4 text-center ghost-border">
              <div className="text-xl font-bold text-secondary mb-0.5">{school.program_length_display}</div>
              <div className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Duration</div>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-4 text-center ghost-border">
              <div className="text-base font-bold text-secondary mb-0.5">{(school.accreditation || []).join(", ") || "N/A"}</div>
              <div className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Accreditation</div>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-4 text-center ghost-border">
              <div className="text-xl font-bold text-secondary mb-0.5">
                {school.externship_included ? (school.externship_hours ? `${school.externship_hours} hrs` : "Yes") : "No"}
              </div>
              <div className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Externship</div>
            </div>
          </div>

          {/* CTA Buttons — contained */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            {school.website && (
              <a href={school.website} target="_blank" rel="noopener noreferrer"
                className="cta-gradient text-white font-semibold py-3 px-6 rounded-lg text-center text-sm transition-all hover:shadow-lg flex-1 sm:flex-none">
                Visit School Website
              </a>
            )}
            <Link href="/#get-matched"
              className="bg-surface-container-lowest border border-secondary/30 text-secondary hover:bg-secondary hover:text-white font-semibold py-3 px-6 rounded-lg text-sm transition-all">
              Request Info
            </Link>
          </div>

          {/* Details Grid — tighter */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface-container-lowest rounded-xl p-6 ghost-border">
              <h2 className="font-serif text-xl font-semibold mb-5">Program Details</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                  <dt className="text-on-surface-variant">Program Type</dt>
                  <dd className="font-semibold capitalize">{school.program_type}</dd>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                  <dt className="text-on-surface-variant">Duration</dt>
                  <dd className="font-semibold">{school.program_length_display}</dd>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                  <dt className="text-on-surface-variant">Tuition Range</dt>
                  <dd className="font-semibold text-secondary">
                    {school.tuition_low != null ? `$${school.tuition_low.toLocaleString()}` : 'N/A'} - {school.tuition_high != null ? `$${school.tuition_high.toLocaleString()}` : 'N/A'}
                  </dd>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                  <dt className="text-on-surface-variant">Financial Aid</dt>
                  <dd className="font-semibold">{school.financial_aid ? "Available" : "Not Available"}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-on-surface-variant">Externship</dt>
                  <dd className="font-semibold">{school.externship_included ? (school.externship_hours ? `${school.externship_hours} hours` : "Included") : "Not Included"}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 ghost-border">
              <h2 className="font-serif text-xl font-semibold mb-5">Certifications</h2>
              <div className="mb-5">
                <h3 className="text-on-surface-variant text-xs mb-2 uppercase tracking-wider font-medium">Accreditation</h3>
                <div className="flex flex-wrap gap-2">
                  {(school.accreditation || []).length > 0 ? school.accreditation.map(acc => (
                    <span key={acc} className="bg-secondary-fixed text-secondary px-3 py-1 rounded-full text-xs font-medium">{acc}</span>
                  )) : <span className="text-on-surface-variant text-sm">Not specified</span>}
                </div>
              </div>
              <div>
                <h3 className="text-on-surface-variant text-xs mb-2 uppercase tracking-wider font-medium">Prepares For</h3>
                <div className="flex flex-wrap gap-2">
                  {(school.certifications_prepared || []).length > 0 ? school.certifications_prepared.map(cert => (
                    <span key={cert} className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-xs font-medium">{cert}</span>
                  )) : <span className="text-on-surface-variant text-sm">Contact school for details</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Program Highlights */}
          {school.highlights && school.highlights.length > 0 && (
            <div className="bg-surface-container-low rounded-xl p-6 ghost-border mb-8">
              <h2 className="font-serif text-xl font-semibold mb-4">Program Highlights</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {school.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary text-base mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Why This Program */}
          <div className="bg-primary-container rounded-xl p-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-serif text-2xl font-semibold text-white mb-3">Ready to start your phlebotomy career?</h2>
              <p className="text-on-primary-container text-sm mb-6 max-w-lg mx-auto">Get matched with {school.name} and other accredited programs in your area. Free, no obligation.</p>
              <Link href="/#get-matched" className="cta-gradient text-white px-6 py-2.5 rounded-lg font-semibold text-sm inline-block hover:shadow-lg transition-all">
                Get Matched Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 w-full border-t border-slate-200 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-12 max-w-6xl mx-auto text-xs tracking-wide">
          <div className="col-span-2 md:col-span-1">
            <div className="text-lg font-semibold font-serif text-slate-900 mb-4">PhlebGuide</div>
            <p className="text-slate-500 mb-6">&copy; 2026 PhlebGuide. Clinical Excellence in Phlebotomy Education.</p>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary cursor-pointer text-lg">mail</span>
              <span className="material-symbols-outlined text-on-surface-variant hover:text-secondary cursor-pointer text-lg">share</span>
            </div>
          </div>
          <div>
            <h5 className="font-bold uppercase tracking-widest text-slate-900 mb-4">Education</h5>
            <ul className="space-y-2.5">
              <li><Link href="/#schools" className="text-slate-500 hover:text-slate-900 transition-colors">Program Directory</Link></li>
              <li><Link href="/#states" className="text-slate-500 hover:text-slate-900 transition-colors">State Requirements</Link></li>
              <li><Link href="/blog" className="text-slate-500 hover:text-slate-900 transition-colors">Certification Prep</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold uppercase tracking-widest text-slate-900 mb-4">Resources</h5>
            <ul className="space-y-2.5">
              <li><Link href="/blog" className="text-slate-500 hover:text-slate-900 transition-colors">Career Center</Link></li>
              <li><Link href="/privacy" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold uppercase tracking-widest text-slate-900 mb-4">Contact</h5>
            <p className="text-slate-500">
              Questions? <br/>
              <Link href="mailto:info@phlebguide.com" className="text-blue-800 font-medium">info@phlebguide.com</Link>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}