import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { stateNames } from "@/lib/states";
import { School } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabaseAdmin.from("schools").select("state_code").neq("national", true);
  const codes = [...new Set((data || []).map((s) => s.state_code))];
  return codes.map((code) => ({ code: code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const stateCode = code.toUpperCase();
  const stateName = stateNames[stateCode];
  if (!stateName) return { title: "State Not Found" };
  return {
    title: `Phlebotomy Schools in ${stateName} | ${stateCode} Phlebotomy Training Programs`,
    description: `Find accredited phlebotomy training programs in ${stateName}. Compare tuition, program length, and certification options for phlebotomy schools near you.`
  };
}

export default async function StatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const stateCode = code.toUpperCase();
  const stateName = stateNames[stateCode];
  if (!stateName) notFound();

  const { data: stateData } = await supabaseAdmin.from("schools").select("*").eq("state_code", stateCode).eq("national", false).order("name");
  const stateSchools = (stateData || []) as School[];

  const { data: natData } = await supabaseAdmin.from("schools").select("*").eq("national", true).order("name");
  const nationalSchools = (natData || []) as School[];

  return (
    <main className="min-h-screen bg-surface text-on-surface font-body">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-medium font-serif text-slate-900 tracking-tight">PhlebGuide</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#schools" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Find Programs</Link>
              <Link href="#states" className="text-blue-700 font-semibold border-b-2 border-blue-700 pb-1">State Directory</Link>
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
          <span className="font-medium text-on-surface">{stateName}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-2xl">
            <span className="text-xs text-secondary font-bold tracking-[0.1em] uppercase block mb-6">State Directory / {stateName}</span>
            <h1 className="font-serif text-6xl md:text-7xl font-semibold leading-tight mb-8 text-on-surface">
              Phlebotomy Schools in <span className="italic text-secondary">{stateName}</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              {stateSchools.length > 0 
                ? `Compare ${stateSchools.length} accredited phlebotomy programs in ${stateName}. Navigate certification pathways with editorial-grade precision.`
                : `View online programs available in ${stateName}. Connect with accredited training centers nationwide.`}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-surface-container-lowest p-4 rounded-xl shadow-sm ghost-border">
                <span className="material-symbols-outlined text-secondary">school</span>
                <div>
                  <div className="text-lg font-bold">{stateSchools.length || nationalSchools.length}+</div>
                  <div className="text-xs text-on-surface-variant uppercase tracking-wider">Available Programs</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-surface-container-lowest p-4 rounded-xl shadow-sm ghost-border">
                <span className="material-symbols-outlined text-secondary">verified</span>
                <div>
                  <div className="text-lg font-bold">NAACLS</div>
                  <div className="text-xs text-on-surface-variant uppercase tracking-wider">Accredited</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {stateSchools.length > 0 && (
        <section className="py-20 px-8 bg-surface">
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="font-serif text-5xl font-semibold mb-12 text-center">{stateName} Phlebotomy Programs</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {stateSchools.map(school => (
                <Link key={school.slug} href={`/school/${school.slug}`}
                  className="bg-surface-container-lowest rounded-xl p-8 hover:shadow-xl transition-all duration-500 ghost-border group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-serif text-2xl font-semibold group-hover:text-secondary transition-colors">{school.name}</h3>
                    <span className="text-xs bg-surface-container text-secondary px-3 py-1 rounded-full font-medium uppercase tracking-widest">{school.program_type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-6">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {school.city}, {school.state}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <span className="text-on-surface-variant font-medium">Tuition:</span>
                      <div className="text-secondary font-bold">
                        {school.tuition_low != null ? `$${school.tuition_low.toLocaleString()}` : 'Contact School'}
                        {school.tuition_high != null && school.tuition_low != null && school.tuition_high > school.tuition_low && ` - $${school.tuition_high.toLocaleString()}`}
                      </div>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-medium">Duration:</span>
                      <div className="font-bold text-on-surface">{school.program_length_display}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(school.accreditation || []).map(acc => (
                      <span key={acc} className="text-xs bg-secondary-fixed text-secondary px-3 py-1 rounded-full font-medium">{acc}</span>
                    ))}
                    {school.financial_aid && <span className="text-xs bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-medium">Financial Aid</span>}
                    {school.externship_included && <span className="text-xs bg-surface-container text-on-surface px-3 py-1 rounded-full font-medium">Externship Included</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Online Programs */}
      <section className="py-20 px-8 bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="font-serif text-5xl font-semibold mb-6 text-center">Online Programs Available in {stateName}</h2>
          <p className="text-lg text-on-surface-variant mb-12 text-center max-w-2xl mx-auto">These accredited online programs accept students from {stateName}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nationalSchools.map(school => (
              <Link key={school.slug} href={`/school/${school.slug}`}
                className="bg-surface-container-lowest rounded-xl p-6 hover:shadow-xl transition-all duration-500 ghost-border group">
                <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-secondary transition-colors">{school.name}</h3>
                <div className="text-on-surface-variant text-sm mb-4 font-medium">{school.program_type}</div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary font-bold">{school.tuition_low != null ? `$${school.tuition_low.toLocaleString()}` : 'Contact'}</span>
                  <span className="text-on-surface-variant font-medium">{school.program_length_display}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 px-8 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-5xl font-semibold mb-8 text-center">Phlebotomy Requirements in {stateName}</h2>
          <div className="bg-surface-container-low rounded-2xl p-8 ghost-border">
            <p className="text-on-surface-variant mb-6 text-lg leading-relaxed">
              {['CA','NV','LA','WA'].includes(stateCode) ? (
                <><strong className="text-error">{stateName} requires phlebotomist licensure.</strong>{" "}You must complete an approved training program and pass a certification exam to work as a phlebotomist in this state.</>
              ) : (
                <>{stateName} does not require state licensure for phlebotomists, but most employers prefer or require national certification (CPT, NCPT, etc.).</>
              )}
            </p>
            <p className="text-on-surface-variant text-lg">Average phlebotomist salary in {stateName}: <strong className="text-secondary">$35,000 - $45,000/year</strong></p>
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