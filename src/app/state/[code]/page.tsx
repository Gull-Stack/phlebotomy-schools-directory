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
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-red-500">Phlebotomy Schools</Link>
          <nav className="flex gap-6">
            <Link href="/#schools" className="hover:text-red-500">Browse States</Link>
            <Link href="/blog" className="hover:text-red-500">Blog</Link>
          </nav>
        </div>
      </header>

      <section className="py-16 px-6 bg-gradient-to-b from-red-900/20 to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Phlebotomy Schools in <span className="text-red-500">{stateName}</span>
          </h1>
          <p className="text-xl text-gray-300">
            {stateSchools.length > 0 
              ? `Compare ${stateSchools.length} accredited phlebotomy programs in ${stateName}`
              : `View online programs available in ${stateName}`}
          </p>
        </div>
      </section>

      {stateSchools.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{stateName} Phlebotomy Programs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {stateSchools.map(school => (
                <Link key={school.slug} href={`/school/${school.slug}`}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-red-500 transition">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{school.name}</h3>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">{school.program_type}</span>
                  </div>
                  <p className="text-gray-400 mb-4">{school.city}, {school.state}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Tuition:</span>
                      <div className="text-green-500 font-bold">
                        ${school.tuition_low.toLocaleString()}
                        {school.tuition_high > school.tuition_low && ` - $${school.tuition_high.toLocaleString()}`}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <div className="font-bold">{school.program_length_display}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(school.accreditation || []).map(acc => (
                      <span key={acc} className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded">{acc}</span>
                    ))}
                    {school.financial_aid && <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded">Financial Aid</span>}
                    {school.externship_included && <span className="text-xs bg-purple-900/50 text-purple-400 px-2 py-1 rounded">Externship Included</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Online Programs Available in {stateName}</h2>
          <p className="text-gray-400 mb-6">These accredited online programs accept students from {stateName}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nationalSchools.map(school => (
              <Link key={school.slug} href={`/school/${school.slug}`}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-red-500 transition">
                <h3 className="text-lg font-bold mb-2">{school.name}</h3>
                <div className="text-gray-400 text-sm mb-3">{school.program_type}</div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-500 font-bold">${school.tuition_low.toLocaleString()}</span>
                  <span className="text-gray-400">{school.program_length_display}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Phlebotomy Requirements in {stateName}</h2>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <p className="text-gray-300 mb-4">
              {['CA','NV','LA','WA'].includes(stateCode) ? (
                <><strong className="text-yellow-500">{stateName} requires phlebotomist licensure.</strong>{" "}You must complete an approved training program and pass a certification exam to work as a phlebotomist in this state.</>
              ) : (
                <>{stateName} does not require state licensure for phlebotomists, but most employers prefer or require national certification (CPT, NCPT, etc.).</>
              )}
            </p>
            <p className="text-gray-400">Average phlebotomist salary in {stateName}: <strong className="text-green-500">$35,000 - $45,000/year</strong></p>
          </div>
        </div>
      </section>

      <footer className="py-10 px-6 bg-gray-900 text-center text-gray-500">
        <p>&copy; 2026 Phlebotomy Schools Directory</p>
        <p className="mt-2">
          <Link href="/" className="hover:text-white">Home</Link>{" | "}
          <Link href="/blog" className="hover:text-white">Blog</Link>{" | "}
          <Link href="/about" className="hover:text-white">About</Link>
        </p>
      </footer>
    </main>
  );
}
