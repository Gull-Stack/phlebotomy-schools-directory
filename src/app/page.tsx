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
    <main className="min-h-screen bg-white text-black">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">PhlebGuide</Link>
          <nav className="flex gap-8">
            <Link href="/#schools" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Browse States</Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Blog</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Find <span className="text-blue-600">Phlebotomy Schools</span> Near You
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Compare accredited programs, tuition costs, and start your healthcare career in as little as 8 weeks.
          </p>
          
          <div className="flex justify-center gap-12 mb-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600">{schools.length}+</div>
              <div className="text-gray-500 font-medium">Schools Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600">$37K</div>
              <div className="text-gray-500 font-medium">Avg Salary</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600">8 Weeks</div>
              <div className="text-gray-500 font-medium">Fastest Program</div>
            </div>
          </div>

          <Link 
            href="#schools"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-10 rounded-full text-lg transition-all hover:shadow-lg transform hover:scale-105"
          >
            Browse Schools
          </Link>
        </div>
      </section>

      {/* National Online Programs */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center text-black">
            National Online Programs
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Study from anywhere with these accredited online phlebotomy programs
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nationalSchools.map(school => (
              <Link 
                key={school.slug}
                href={`/school/${school.slug}`}
                className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  {school.logo_url && (
                    <img 
                      src={school.logo_url} 
                      alt={`${school.name} logo`}
                      className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100 flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                    {school.name}
                  </h3>
                </div>
                <div className="text-gray-500 text-sm mb-6 font-medium">
                  {school.program_type === 'online' ? '100% Online' : 'Hybrid'}
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-green-600 font-bold">
                    {school.tuition_low ? (
                      <>
                        ${school.tuition_low.toLocaleString()}
                        {school.tuition_high && school.tuition_high > school.tuition_low && ` - $${school.tuition_high.toLocaleString()}`}
                      </>
                    ) : "Contact School"}
                  </span>
                  <span className="text-gray-500 font-medium">
                    {school.program_length_display}
                  </span>
                </div>
                {school.highlights && school.highlights.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {school.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section id="schools" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center text-black">
            Browse by State
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Find accredited phlebotomy programs in your state
          </p>
          
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {states.map(state => (
              <Link
                key={state}
                href={`/state/${state.toLowerCase()}`}
                className="bg-gray-100 hover:bg-blue-600 hover:text-white rounded-2xl py-4 text-center font-bold transition-all hover:shadow-md transform hover:scale-105"
              >
                {state}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Phlebotomy */}
      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center text-black">
            Why Become a Phlebotomist?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Start your healthcare career with these compelling advantages
          </p>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How long does phlebotomy training take?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Most phlebotomy programs take just 4-12 weeks. You could be working in healthcare within 2 months of starting your training."
                    }
                  },
                  {
                    "@type": "Question", 
                    "name": "Do I need a college degree to become a phlebotomist?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No college degree is required. A high school diploma or GED is all you need to start phlebotomy training. No college debt necessary."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is there high demand for phlebotomists?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, 22% job growth is expected for phlebotomists. Hospitals, labs, and clinics are always hiring qualified phlebotomists."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How much do phlebotomists earn?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The average phlebotomist salary is $37,380/year with full benefits. Top earners make $52,000 or more annually."
                    }
                  }
                ]
              })
            }}
          />
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Fast Training</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Most programs take just 4-12 weeks. You could be working in healthcare within 2 months.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">No Degree Required</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                A high school diploma or GED is all you need to start. No college debt necessary.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">High Demand</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                22% job growth expected. Hospitals, labs, and clinics are always hiring phlebotomists.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Good Pay + Benefits</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Average salary of $37,380/year with full benefits. Top earners make $52K+.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Get Matched with Schools
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Enter your info and we&apos;ll connect you with accredited programs in your area.
          </p>
          <LeadForm />
        </div>
      </section>

      {/* Blog CTA */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Latest from the Blog</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Tips, guides, and career advice for aspiring phlebotomists</p>
          <Link href="/blog" className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:shadow-md">
            Read the Blog
          </Link>
        </div>
      </section>

      {/* Footer */}
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
