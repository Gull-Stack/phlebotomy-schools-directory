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
        <div className="max-w-6xl mx-auto text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600 font-medium">Home</Link>
          {" / "}
          {!school.national && (
            <>
              <Link href={`/state/${school.state_code.toLowerCase()}`} className="hover:text-blue-600 font-medium">
                {stateNames[school.state_code] || school.state}
              </Link>
              {" / "}
            </>
          )}
          <span className="text-black font-medium">{school.name}</span>
        </div>
      </div>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">{school.name}</h1>
              <p className="text-xl md:text-2xl text-gray-600">{school.city}, {school.state}</p>
            </div>
            <span className={`px-6 py-3 rounded-full text-sm font-bold ${
              school.program_type === 'online' ? 'bg-blue-100 text-blue-700' :
              school.program_type === 'hybrid' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
            }`}>
              {school.program_type === 'online' ? 'Online' :
               school.program_type === 'hybrid' ? 'Hybrid' : 'In-Person'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-green-600">
                {school.tuition_low ? (
                  <>
                    ${school.tuition_low.toLocaleString()}
                    {school.tuition_high && school.tuition_high > school.tuition_low && (
                      <span className="text-lg"> - ${school.tuition_high.toLocaleString()}</span>
                    )}
                  </>
                ) : 'Contact School'}
              </div>
              <div className="text-gray-500 text-sm font-medium">Tuition</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{school.program_length_display}</div>
              <div className="text-gray-500 text-sm font-medium">Duration</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="text-lg font-bold text-purple-600">{(school.accreditation || []).join(", ") || "N/A"}</div>
              <div className="text-gray-500 text-sm font-medium">Accreditation</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-orange-600">
                {school.externship_included ? (school.externship_hours ? `${school.externship_hours} hrs` : "Yes") : "No"}
              </div>
              <div className="text-gray-500 text-sm font-medium">Externship</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-16">
            {school.website && (
              <a href={school.website} target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-full text-center text-lg transition-all hover:shadow-lg">
                Visit School Website
              </a>
            )}
            <Link href="/#lead-form"
              className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-5 px-8 rounded-full text-lg transition-all hover:shadow-lg">
              Request Info
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-black">Program Details</h2>
              <dl className="space-y-4">
                <div className="flex justify-between items-center"><dt className="text-gray-600 font-medium">Program Type</dt><dd className="font-bold capitalize text-black">{school.program_type}</dd></div>
                <div className="flex justify-between items-center"><dt className="text-gray-600 font-medium">Duration</dt><dd className="font-bold text-black">{school.program_length_display}</dd></div>
                <div className="flex justify-between items-center"><dt className="text-gray-600 font-medium">Tuition Range</dt><dd className="font-bold text-green-600">${school.tuition_low.toLocaleString()} - ${school.tuition_high.toLocaleString()}</dd></div>
                <div className="flex justify-between items-center"><dt className="text-gray-600 font-medium">Financial Aid</dt><dd className="font-bold text-black">{school.financial_aid ? "Available" : "Not Available"}</dd></div>
                <div className="flex justify-between items-center"><dt className="text-gray-600 font-medium">Externship</dt><dd className="font-bold text-black">{school.externship_included ? (school.externship_hours ? `${school.externship_hours} hours` : "Included") : "Not Included"}</dd></div>
              </dl>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-black">Certifications</h2>
              <div className="mb-6">
                <h3 className="text-gray-600 font-medium text-sm mb-3">Accreditation</h3>
                <div className="flex flex-wrap gap-2">
                  {(school.accreditation || []).length > 0 ? school.accreditation.map(acc => (
                    <span key={acc} className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">{acc}</span>
                  )) : <span className="text-gray-500">Not specified</span>}
                </div>
              </div>
              <div>
                <h3 className="text-gray-600 font-medium text-sm mb-3">Prepares For</h3>
                <div className="flex flex-wrap gap-2">
                  {(school.certifications_prepared || []).map(cert => (
                    <span key={cert} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">{cert}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {school.highlights && school.highlights.length > 0 && (
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-black">Program Highlights</h2>
              <ul className="grid md:grid-cols-2 gap-4">
                {school.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <span className="text-blue-600 text-lg font-bold">✓</span> 
                    <span className="font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
