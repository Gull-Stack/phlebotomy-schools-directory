import Link from "next/link";
import { notFound } from "next/navigation";
import { schools, getSchoolBySlug, stateNames } from "@/data/schools";

export function generateStaticParams() {
  return schools.map(school => ({ slug: school.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);
  
  if (!school) return { title: "School Not Found" };
  
  return {
    title: `${school.name} Phlebotomy Program | Tuition, Reviews & Info`,
    description: `${school.name} phlebotomy training program in ${school.city}, ${school.state}. Tuition: $${school.tuition_low}-$${school.tuition_high}. ${school.program_length_display}. ${school.accreditation.join(", ")} accredited.`
  };
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);
  
  if (!school) {
    notFound();
  }
  
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-red-500">
            💉 Phlebotomy Schools
          </Link>
          <nav className="flex gap-6">
            <Link href="/#schools" className="hover:text-red-500">Browse States</Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-900/50 py-3 px-6">
        <div className="max-w-6xl mx-auto text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          {" / "}
          {!school.national && (
            <>
              <Link href={`/state/${school.state_code.toLowerCase()}`} className="hover:text-white">
                {stateNames[school.state_code] || school.state}
              </Link>
              {" / "}
            </>
          )}
          <span className="text-white">{school.name}</span>
        </div>
      </div>

      {/* School Header */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{school.name}</h1>
              <p className="text-xl text-gray-400">
                {school.city}, {school.state}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              school.program_type === 'online' ? 'bg-blue-600' :
              school.program_type === 'hybrid' ? 'bg-purple-600' :
              'bg-green-600'
            }`}>
              {school.program_type === 'online' ? '💻 Online' :
               school.program_type === 'hybrid' ? '🔄 Hybrid' :
               '🏫 In-Person'}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                ${school.tuition_low.toLocaleString()}
                {school.tuition_high > school.tuition_low && (
                  <span className="text-lg"> - ${school.tuition_high.toLocaleString()}</span>
                )}
              </div>
              <div className="text-gray-400 text-sm">Tuition</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-500">
                {school.program_length_display}
              </div>
              <div className="text-gray-400 text-sm">Duration</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {school.accreditation.join(", ") || "N/A"}
              </div>
              <div className="text-gray-400 text-sm">Accreditation</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">
                {school.externship_included ? (
                  school.externship_hours ? `${school.externship_hours} hrs` : "Yes"
                ) : "No"}
              </div>
              <div className="text-gray-400 text-sm">Externship</div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-4 mb-12">
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-center text-lg transition"
            >
              Visit School Website →
            </a>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition">
              Request Info
            </button>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Program Details */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Program Details</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-400">Program Type</dt>
                  <dd className="font-bold capitalize">{school.program_type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Duration</dt>
                  <dd className="font-bold">{school.program_length_display}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Tuition Range</dt>
                  <dd className="font-bold text-green-500">
                    ${school.tuition_low.toLocaleString()} - ${school.tuition_high.toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Financial Aid</dt>
                  <dd className="font-bold">{school.financial_aid ? "✅ Available" : "❌ Not Available"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Externship</dt>
                  <dd className="font-bold">
                    {school.externship_included 
                      ? `✅ ${school.externship_hours ? `${school.externship_hours} hours` : "Included"}`
                      : "❌ Not Included"
                    }
                  </dd>
                </div>
              </dl>
            </div>

            {/* Certifications */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Certifications</h2>
              
              <div className="mb-6">
                <h3 className="text-gray-400 text-sm mb-2">Accreditation</h3>
                <div className="flex flex-wrap gap-2">
                  {school.accreditation.length > 0 ? (
                    school.accreditation.map(acc => (
                      <span key={acc} className="bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm">
                        {acc}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm mb-2">Prepares For</h3>
                <div className="flex flex-wrap gap-2">
                  {school.certifications_prepared.map(cert => (
                    <span key={cert} className="bg-blue-900/50 text-blue-400 px-3 py-1 rounded-full text-sm">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Highlights */}
          {school.highlights && school.highlights.length > 0 && (
            <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Program Highlights</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {school.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-gray-900 text-center text-gray-500">
        <p>© 2026 Phlebotomy Schools Directory</p>
      </footer>
    </main>
  );
}
