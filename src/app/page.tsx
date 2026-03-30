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
    <main className="min-h-screen bg-gray-50 text-slate-900 font-inter">
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
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
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              Request Info
            </Link>
          </div>
        </div>
        <div className="bg-slate-100/50 h-[1px] w-full"></div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[870px] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10"></div>
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100"></div>
        </div>
        <div className="relative z-20 max-w-screen-2xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            <span className="text-xs tracking-[0.2em] text-blue-600 font-semibold uppercase mb-6 block">Elite Medical Training</span>
            <h1 className="font-serif text-6xl md:text-7xl font-semibold text-slate-900 leading-[1.1] mb-8 tracking-tight">
              Clinical Excellence <br/><span className="italic text-slate-600">Starts Here.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-xl">
              Discover the nation's premier phlebotomy certification programs. We connect aspiring professionals with accredited clinical training centers that define modern healthcare standards.
            </p>
            
            {/* Search Box */}
            <div className="bg-white p-2 rounded-xl shadow-2xl shadow-blue-900/5 flex flex-col md:flex-row gap-2 max-w-xl border border-slate-200/20">
              <div className="flex-1 flex items-center px-4 py-3 gap-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400" 
                  placeholder="Zip code or State" 
                  type="text"
                />
              </div>
              <div className="h-10 w-[1px] bg-slate-200 hidden md:block self-center"></div>
              <div className="flex-1 flex items-center px-4 py-3 gap-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
                <select className="w-full bg-transparent border-none focus:ring-0 text-slate-900 appearance-none">
                  <option>Certification Level</option>
                  <option>CPT-1</option>
                  <option>CPT-2</option>
                </select>
              </div>
              <Link 
                href="#schools"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all text-center"
              >
                Find Schools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-gray-50 border-y border-slate-200/10">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            <p className="text-xs tracking-widest uppercase text-slate-500 mb-4 md:mb-0">Recognized by Leading Bodies</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center">
              <div className="font-serif text-2xl font-bold tracking-tighter text-slate-700">NAACLS</div>
              <div className="font-serif text-2xl font-bold tracking-tighter text-slate-700">ASCP</div>
              <div className="font-serif text-2xl font-bold tracking-tighter text-slate-700">AMT</div>
              <div className="font-serif text-2xl font-bold tracking-tighter text-slate-700">NHA</div>
              <div className="font-serif text-2xl font-bold tracking-tighter text-slate-700">ACA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schools */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-xs text-blue-600 font-bold tracking-widest uppercase block mb-4">Top Rated Programs</span>
              <h2 className="font-serif text-5xl font-semibold tracking-tight text-slate-900">Featured Clinical Centers</h2>
            </div>
            <Link href="#schools" className="text-blue-600 font-semibold flex items-center gap-2 group">
              Explore All Programs 
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nationalSchools.slice(0, 3).map(school => (
              <div key={school.slug} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                <div className="h-64 overflow-hidden relative bg-gradient-to-br from-blue-50 to-slate-100">
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    {school.program_type === 'online' ? 'Online Available' : 'Hybrid Program'}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-serif text-2xl font-semibold text-slate-900">{school.name}</h3>
                    <span className="text-slate-500 font-medium text-sm">
                      ${school.tuition_low.toLocaleString()} Est.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {school.state_code || 'National'}
                  </div>
                  <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="flex items-center gap-1 text-blue-600">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="font-bold">4.8</span>
                    </span>
                    <Link 
                      href={`/school/${school.slug}`}
                      className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-colors"
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
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-24 max-w-2xl mx-auto">
            <h2 className="font-serif text-5xl font-semibold mb-6 text-slate-900">The Clinical Path</h2>
            <p className="text-slate-600 text-lg leading-relaxed">A streamlined approach to entering the phlebotomy profession with confidence and prestige.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent z-0"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 border border-slate-200">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-blue-600 font-bold mb-4 uppercase tracking-widest">Step 01</span>
              <h4 className="font-serif text-2xl font-semibold mb-4 text-slate-900">Select Accreditation</h4>
              <p className="text-slate-600 leading-relaxed">Choose from NAACLS or ASCP-aligned programs that meet your state's rigorous requirements.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 border border-slate-200">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-xs text-blue-600 font-bold mb-4 uppercase tracking-widest">Step 02</span>
              <h4 className="font-serif text-2xl font-semibold mb-4 text-slate-900">Complete Training</h4>
              <p className="text-slate-600 leading-relaxed">Undergo hands-on clinical rotations at our partner medical centers and specialized labs.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 border border-slate-200">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <span className="text-xs text-blue-600 font-bold mb-4 uppercase tracking-widest">Step 03</span>
              <h4 className="font-serif text-2xl font-semibold mb-4 text-slate-900">Earn Certification</h4>
              <p className="text-slate-600 leading-relaxed">Pass your national exam and join the elite ranks of certified phlebotomy technicians.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section id="states" className="py-32 bg-white">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-xs text-blue-600 font-bold tracking-widest uppercase block mb-4">State Directory</span>
            <h2 className="font-serif text-5xl font-semibold mb-6 text-slate-900">Browse by State</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Find accredited phlebotomy programs in your state
            </p>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {states.map(state => (
              <Link
                key={state}
                href={`/state/${state.toLowerCase()}`}
                className="bg-slate-100 hover:bg-blue-600 hover:text-white rounded-xl py-4 text-center font-bold transition-all hover:shadow-md transform hover:scale-105 text-slate-700"
              >
                {state}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Phlebotomy */}
      <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-xs text-blue-600 font-bold tracking-widest uppercase block mb-4">Career Advantages</span>
            <h2 className="font-serif text-5xl font-semibold mb-6 text-slate-900">Why Choose Phlebotomy?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Start your healthcare career with these compelling advantages
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <h3 className="font-serif text-2xl font-semibold mb-4 text-blue-600">Fast Training</h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                Most programs take just 4-12 weeks. You could be working in healthcare within 2 months.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <h3 className="font-serif text-2xl font-semibold mb-4 text-blue-600">No Degree Required</h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                A high school diploma or GED is all you need to start. No college debt necessary.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <h3 className="font-serif text-2xl font-semibold mb-4 text-blue-600">High Demand</h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                22% job growth expected. Hospitals, labs, and clinics are always hiring phlebotomists.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <h3 className="font-serif text-2xl font-semibold mb-4 text-blue-600">Good Pay + Benefits</h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                Average salary of $37,380/year with full benefits. Top earners make $52K+.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="mb-32 px-8">
        <div className="max-w-screen-2xl mx-auto bg-primary-container rounded-[2rem] p-16 md:p-24 overflow-hidden relative">
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
              Get our comprehensive 'Phlebotomy Career Roadmap' and weekly insights delivered directly to your inbox.
            </p>
            <div id="get-matched">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <span className="text-xs text-blue-600 font-bold tracking-widest uppercase block mb-4">The Journal</span>
              <h2 className="font-serif text-5xl font-semibold tracking-tight mb-8 text-slate-900">Clinical Insights</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                Expert commentary on phlebotomy trends, medical technology, and career advancement in the diagnostic sector.
              </p>
              <Link 
                href="/blog"
                className="cta-gradient text-white px-8 py-3.5 rounded-lg font-semibold flex items-center gap-2 inline-flex"
              >
                Read Full Journal 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Placeholder blog cards */}
              <article className="group">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200"></div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 block">Career Strategy</span>
                <h3 className="font-serif text-3xl font-semibold mb-4 leading-snug group-hover:text-blue-600 transition-colors italic text-slate-900">
                  The Evolution of Phlebotomy in Precision Medicine
                </h3>
                <p className="text-slate-600 mb-6">How diagnostic collection techniques are changing to meet the demands of personalized genomic healthcare.</p>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent • 6 Min Read</span>
              </article>
              <article className="group">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200"></div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 block">Certification</span>
                <h3 className="font-serif text-3xl font-semibold mb-4 leading-snug group-hover:text-blue-600 transition-colors italic text-slate-900">
                  ASCP vs. AMT: Choosing Your National Credential
                </h3>
                <p className="text-slate-600 mb-6">A comprehensive comparison of the industry's most respected certification bodies for clinical technicians.</p>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent • 10 Min Read</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 w-full border-t border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-12 py-20 max-w-screen-2xl mx-auto">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-semibold font-serif text-slate-900 mb-6">PhlebGuide</div>
            <p className="font-inter text-sm tracking-wide text-slate-500 mb-8 max-w-xs">© 2026 PhlebGuide. Clinical Excellence in Phlebotomy Education.</p>
            <div className="flex gap-4">
              <svg className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m3 0H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
              </svg>
              <svg className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-6">Education</h5>
            <ul className="space-y-4 font-inter text-sm">
              <li><Link href="/#schools" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">Program Directory</Link></li>
              <li><Link href="#states" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">State Requirements</Link></li>
              <li><Link href="/blog" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">Certification Prep</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-6">Resources</h5>
            <ul className="space-y-4 font-inter text-sm">
              <li><Link href="/blog" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">Career Center</Link></li>
              <li><Link href="/privacy" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-transform inline-block">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-6">Contact</h5>
            <p className="font-inter text-sm tracking-wide text-slate-500">
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
