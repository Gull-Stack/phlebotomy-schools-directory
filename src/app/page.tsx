import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { stateNames } from "@/lib/states";
import { School } from "@/lib/types";
import LeadForm from "@/components/LeadForm";

export const revalidate = 3600;

async function getSchools() {
  const { data } = await supabaseAdmin
    .from("schools")
    .select("*")
    .order("name");
  return (data || []) as School[];
}

export default async function Home() {
  const schools = await getSchools();
  const states = [...new Set(schools.filter(s => !s.national).map(s => s.state_code))].sort();
  const nationalSchools = schools.filter(s => s.national);

  return (
    <main className="min-h-screen bg-surface text-on-surface font-body">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-medium font-serif text-slate-900 tracking-tight">PhlebGuide</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#schools" className="text-blue-700 font-semibold border-b-2 border-blue-700 pb-1">Find Programs</Link>
              <Link href="#states" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">State Directory</Link>
              <Link href="/blog" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Career Blog</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="#get-matched"
              className="cta-gradient text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              Request Info
            </Link>
          </div>
        </div>
        <div className="bg-slate-100/50 h-[1px] w-full"></div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[870px] flex items-center overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent z-10"></div>
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100"></div>
        </div>
        <div className="relative z-20 max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <span className="text-xs tracking-[0.2em] text-secondary font-semibold uppercase mb-6 block">Elite Medical Training</span>
            <h1 className="font-serif text-6xl md:text-7xl font-semibold text-on-surface leading-[1.1] mb-8 tracking-tight">
              Clinical Excellence <br/><span className="italic text-on-primary-container">Starts Here.</span>
            </h1>
            <p className="text-lg text-on-surface-variant mb-12 leading-relaxed max-w-xl">
              Discover the nation&apos;s premier phlebotomy certification programs. We connect aspiring professionals with accredited clinical training centers that define modern healthcare standards.
            </p>
            
            {/* Search Box */}
            <div className="bg-white p-2 rounded-xl shadow-2xl shadow-blue-900/5 flex flex-col md:flex-row gap-2 max-w-xl ghost-border">
              <div className="flex-1 flex items-center px-4 py-3 gap-3">
                <span className="material-symbols-outlined text-outline">location_on</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline-variant" 
                  placeholder="Zip code or State" 
                  type="text"
                />
              </div>
              <div className="h-10 w-[1px] bg-outline-variant/30 hidden md:block self-center"></div>
              <div className="flex-1 flex items-center px-4 py-3 gap-3">
                <span className="material-symbols-outlined text-outline">school</span>
                <select className="w-full bg-transparent border-none focus:ring-0 text-on-surface appearance-none">
                  <option>Certification Level</option>
                  <option>CPT-1</option>
                  <option>CPT-2</option>
                </select>
              </div>
              <Link 
                href="#schools"
                className="cta-gradient text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all text-center"
              >
                Find Schools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-surface border-y border-outline-variant/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            <p className="text-xs tracking-widest uppercase text-on-surface-variant mb-4 md:mb-0">Recognized by Leading Bodies</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-20 items-center">
              <div className="font-serif text-2xl font-bold tracking-tighter">NAACLS</div>
              <div className="font-serif text-2xl font-bold tracking-tighter">ASCP</div>
              <div className="font-serif text-2xl font-bold tracking-tighter">AMT</div>
              <div className="font-serif text-2xl font-bold tracking-tighter">NHA</div>
              <div className="font-serif text-2xl font-bold tracking-tighter">ACA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schools */}
      <section id="schools" className="py-32 bg-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-xs text-secondary font-bold tracking-widest uppercase block mb-4">Top Rated Programs</span>
              <h2 className="font-serif text-5xl font-semibold tracking-tight">Featured Clinical Centers</h2>
            </div>
            <Link href="#schools" className="text-secondary font-semibold flex items-center gap-2 group">
              Explore All Programs 
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nationalSchools.slice(0, 3).map(school => (
              <div key={school.slug} className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                <div className="h-64 overflow-hidden relative bg-gradient-to-br from-blue-50 to-slate-100">
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-secondary">
                    {school.program_type === 'online' ? 'Online Available' : 'Hybrid Program'}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-serif text-2xl font-semibold">{school.name}</h3>
                    <span className="text-on-surface-variant font-medium text-sm">
                      {school.tuition_low ? `$${school.tuition_low.toLocaleString()} Est.` : 'Contact School'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-6">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {school.state_code || 'National'}
                  </div>
                  <div className="mt-auto pt-6 border-t border-outline-variant/10 flex justify-between items-center">
                    <span className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      <span className="font-bold">4.8</span>
                    </span>
                    <Link 
                      href={`/school/${school.slug}`}
                      className="text-sm font-bold uppercase tracking-widest text-on-surface hover:text-secondary transition-colors"
                    >
                      View Program
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Clinical Path (Steps) */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24 max-w-2xl mx-auto">
            <h2 className="font-serif text-5xl font-semibold mb-6">The Clinical Path</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">A streamlined approach to entering the phlebotomy profession with confidence and prestige.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-outline-variant to-transparent z-0"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 border border-outline-variant/20">
                <span className="material-symbols-outlined text-4xl text-secondary">search_check</span>
              </div>
              <span className="text-xs text-secondary font-bold mb-4 uppercase tracking-widest">Step 01</span>
              <h4 className="font-serif text-2xl font-semibold mb-4">Select Accreditation</h4>
              <p className="text-on-surface-variant leading-relaxed">Choose from NAACLS or ASCP-aligned programs that meet your state&apos;s rigorous requirements.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 border border-outline-variant/20">
                <span className="material-symbols-outlined text-4xl text-secondary">biotech</span>
              </div>
              <span className="text-xs text-secondary font-bold mb-4 uppercase tracking-widest">Step 02</span>
              <h4 className="font-serif text-2xl font-semibold mb-4">Complete Training</h4>
              <p className="text-on-surface-variant leading-relaxed">Undergo hands-on clinical rotations at our partner medical centers and specialized labs.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 border border-outline-variant/20">
                <span className="material-symbols-outlined text-4xl text-secondary">verified_user</span>
              </div>
              <span className="text-xs text-secondary font-bold mb-4 uppercase tracking-widest">Step 03</span>
              <h4 className="font-serif text-2xl font-semibold mb-4">Earn Certification</h4>
              <p className="text-on-surface-variant leading-relaxed">Pass your national exam and join the elite ranks of certified phlebotomy technicians.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section id="states" className="py-32 bg-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs text-secondary font-bold tracking-widest uppercase block mb-4">State Directory</span>
            <h2 className="font-serif text-5xl font-semibold mb-6">Browse by State</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Find accredited phlebotomy programs in your state
            </p>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {states.map(state => (
              <Link
                key={state}
                href={`/state/${state.toLowerCase()}`}
                className="bg-surface-container-lowest hover:bg-secondary hover:text-white rounded-xl py-4 text-center font-bold transition-all hover:shadow-md transform hover:scale-105 text-on-surface ghost-border"
              >
                {state}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Phlebotomy */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs text-secondary font-bold tracking-widest uppercase block mb-4">Career Advantages</span>
            <h2 className="font-serif text-5xl font-semibold mb-6">Why Choose Phlebotomy?</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Start your healthcare career with these compelling advantages
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow ghost-border">
              <h3 className="font-serif text-2xl font-semibold mb-4 text-secondary">Fast Training</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Most programs take just 4-12 weeks. You could be working in healthcare within 2 months.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow ghost-border">
              <h3 className="font-serif text-2xl font-semibold mb-4 text-secondary">No Degree Required</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                A high school diploma or GED is all you need to start. No college debt necessary.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow ghost-border">
              <h3 className="font-serif text-2xl font-semibold mb-4 text-secondary">High Demand</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                22% job growth expected. Hospitals, labs, and clinics are always hiring phlebotomists.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow ghost-border">
              <h3 className="font-serif text-2xl font-semibold mb-4 text-secondary">Good Pay + Benefits</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Average salary of $37,380/year with full benefits. Top earners make $52K+.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="mb-32 px-6">
        <div className="max-w-6xl mx-auto bg-primary-container rounded-[2rem] p-10 md:p-14 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full scale-150 rotate-12" fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="150" stroke="white" strokeDasharray="10 10" strokeWidth="0.5"></circle>
              <circle cx="200" cy="200" r="100" stroke="white" strokeDasharray="5 5" strokeWidth="0.5"></circle>
            </svg>
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-serif text-5xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
              Ready to join the <br/><span className="italic text-secondary-fixed">clinical frontlines?</span>
            </h2>
            <p className="text-on-primary-container text-xl mb-12 leading-relaxed">
              Get our comprehensive &apos;Phlebotomy Career Roadmap&apos; and weekly insights delivered directly to your inbox.
            </p>
            <div id="get-matched">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="py-32 bg-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <span className="text-xs text-on-tertiary-container font-bold tracking-widest uppercase block mb-4">The Journal</span>
              <h2 className="font-serif text-5xl font-semibold tracking-tight mb-8">Clinical Insights</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
                Expert commentary on phlebotomy trends, medical technology, and career advancement in the diagnostic sector.
              </p>
              <Link 
                href="/blog"
                className="cta-gradient text-white px-6 py-3.5 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                Read Full Journal 
                <span className="material-symbols-outlined">open_in_new</span>
              </Link>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <article className="group">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-blue-50 to-slate-100 ghost-border"></div>
                <span className="text-xs text-on-tertiary-container font-bold uppercase tracking-wider mb-3 block">Career Strategy</span>
                <h3 className="font-serif text-3xl font-semibold mb-4 leading-snug group-hover:text-secondary transition-colors italic">
                  The Evolution of Phlebotomy in Precision Medicine
                </h3>
                <p className="text-on-surface-variant mb-6">How diagnostic collection techniques are changing to meet the demands of personalized genomic healthcare.</p>
                <span className="text-xs font-bold text-outline-variant uppercase tracking-widest">Recent &bull; 6 Min Read</span>
              </article>
              <article className="group">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-blue-50 to-slate-100 ghost-border"></div>
                <span className="text-xs text-on-tertiary-container font-bold uppercase tracking-wider mb-3 block">Certification</span>
                <h3 className="font-serif text-3xl font-semibold mb-4 leading-snug group-hover:text-secondary transition-colors italic">
                  ASCP vs. AMT: Choosing Your National Credential
                </h3>
                <p className="text-on-surface-variant mb-6">A comprehensive comparison of the industry&apos;s most respected certification bodies for clinical technicians.</p>
                <span className="text-xs font-bold text-outline-variant uppercase tracking-widest">Recent &bull; 10 Min Read</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 w-full border-t border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-12 max-w-6xl mx-auto text-sm tracking-wide">
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
              <li><Link href="#states" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">State Requirements</Link></li>
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
