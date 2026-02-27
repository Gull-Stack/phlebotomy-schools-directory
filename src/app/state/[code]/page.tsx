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
    title: `Phlebotomy Schools in ${stateName} | PhlebGuide`,
    description: `Find accredited phlebotomy training programs in ${stateName}. Compare tuition, program length, certification options, and start your healthcare career with local schools.`,
    keywords: [`phlebotomy schools ${stateName}`, `phlebotomy training ${stateName}`, `${stateCode} phlebotomist certification`, `medical training ${stateName}`],
    openGraph: {
      title: `Phlebotomy Schools in ${stateName} | PhlebGuide`,
      description: `Find accredited phlebotomy training programs in ${stateName}. Compare tuition, program length, certification options, and start your healthcare career with local schools.`,
      url: `https://phlebguide.com/state/${code.toLowerCase()}`,
    },
    alternates: {
      canonical: `https://phlebguide.com/state/${code.toLowerCase()}`,
    },
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

      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "PhlebGuide",
                    "item": "https://phlebguide.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": `Phlebotomy Schools in ${stateName}`,
                    "item": `https://phlebguide.com/state/${code.toLowerCase()}`
                  }
                ]
              })
            }}
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Phlebotomy Schools in <span className="text-blue-600">{stateName}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {stateSchools.length > 0 
              ? `Compare ${stateSchools.length} accredited phlebotomy programs in ${stateName}`
              : `View online programs available in ${stateName}`}
          </p>
        </div>
      </section>

      {stateSchools.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-black">{stateName} Phlebotomy Programs</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {stateSchools.map(school => (
                <Link key={school.slug} href={`/school/${school.slug}`}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {school.logo_url && (
                        <img src={school.logo_url} alt={`${school.name} logo`} className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100 flex-shrink-0" loading="lazy" />
                      )}
                      <h3 className="text-xl font-bold text-black">{school.name}</h3>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium flex-shrink-0">{school.program_type}</span>
                  </div>
                  <p className="text-gray-600 mb-6 font-medium">{school.city}, {school.state}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <span className="text-gray-500 font-medium">Tuition:</span>
                      <div className="text-green-600 font-bold">
                        {school.tuition_low ? (
                          <>
                            ${school.tuition_low.toLocaleString()}
                            {school.tuition_high && school.tuition_high > school.tuition_low && ` - $${school.tuition_high.toLocaleString()}`}
                          </>
                        ) : "Contact School"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Duration:</span>
                      <div className="font-bold text-black">{school.program_length_display}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(school.accreditation || []).map(acc => (
                      <span key={acc} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">{acc}</span>
                    ))}
                    {school.financial_aid && <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Financial Aid</span>}
                    {school.externship_included && <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">Externship Included</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-black">Online Programs Available in {stateName}</h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">These accredited online programs accept students from {stateName}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nationalSchools.map(school => (
              <Link key={school.slug} href={`/school/${school.slug}`}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  {school.logo_url && (
                    <img src={school.logo_url} alt={`${school.name} logo`} className="w-8 h-8 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100 flex-shrink-0" loading="lazy" />
                  )}
                  <h3 className="text-lg font-bold text-black">{school.name}</h3>
                </div>
                <div className="text-gray-500 text-sm mb-4 font-medium">{school.program_type}</div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-bold">{school.tuition_low ? `$${school.tuition_low.toLocaleString()}` : 'Contact School'}</span>
                  <span className="text-gray-500 font-medium">{school.program_length_display}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-black">Phlebotomy Requirements in {stateName}</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              {['CA','NV','LA','WA'].includes(stateCode) ? (
                <><strong className="text-orange-600">{stateName} requires phlebotomist licensure.</strong>{" "}You must complete an approved training program and pass a certification exam to work as a phlebotomist in this state.</>
              ) : (
                <>{stateName} does not require state licensure for phlebotomists, but most employers prefer or require national certification (CPT, NCPT, etc.).</>
              )}
            </p>
            <p className="text-gray-600 text-lg">Average phlebotomist salary in {stateName}: <strong className="text-green-600">$35,000 - $45,000/year</strong></p>
          </div>
        </div>
      </section>

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
