import Link from "next/link";
import { schools } from "@/data/schools";

const states = [...new Set(schools.filter(s => !s.national).map(s => s.state_code))].sort();
const nationalSchools = schools.filter(s => s.national);

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center bg-gradient-to-b from-red-900/20 to-gray-950">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find <span className="text-red-500">Phlebotomy Schools</span> Near You
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Compare accredited programs, tuition costs, and start your healthcare career in as little as 8 weeks.
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mb-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500">{schools.length}+</div>
              <div className="text-gray-400">Schools Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500">$37K</div>
              <div className="text-gray-400">Avg Salary</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500">8 Weeks</div>
              <div className="text-gray-400">Fastest Program</div>
            </div>
          </div>

          {/* CTA */}
          <Link 
            href="#schools"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition"
          >
            Browse Schools →
          </Link>
        </div>
      </section>

      {/* National Online Programs */}
      <section className="py-16 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            🌐 National Online Programs
          </h2>
          <p className="text-gray-400 text-center mb-10">
            Study from anywhere with these accredited online phlebotomy programs
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nationalSchools.map(school => (
              <Link 
                key={school.slug}
                href={`/school/${school.slug}`}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-red-500 transition group"
              >
                <h3 className="text-xl font-bold mb-2 group-hover:text-red-500">
                  {school.name}
                </h3>
                <div className="text-gray-400 text-sm mb-4">
                  {school.program_type === 'online' ? '💻 100% Online' : '🏫 Hybrid'}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-500 font-bold">
                    ${school.tuition_low.toLocaleString()}
                    {school.tuition_high > school.tuition_low && ` - $${school.tuition_high.toLocaleString()}`}
                  </span>
                  <span className="text-gray-400">
                    {school.program_length_display}
                  </span>
                </div>
                {school.highlights && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {school.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded">
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
      <section id="schools" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            📍 Browse by State
          </h2>
          
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {states.map(state => (
              <Link
                key={state}
                href={`/state/${state.toLowerCase()}`}
                className="bg-gray-800 hover:bg-red-600 rounded-lg py-3 text-center font-bold transition"
              >
                {state}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Phlebotomy */}
      <section className="py-16 px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            💉 Why Become a Phlebotomist?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-red-500">Fast Training</h3>
              <p className="text-gray-300">
                Most programs take just 4-12 weeks. You could be working in healthcare within 2 months.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-red-500">No Degree Required</h3>
              <p className="text-gray-300">
                A high school diploma or GED is all you need to start. No college debt necessary.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-red-500">High Demand</h3>
              <p className="text-gray-300">
                22% job growth expected. Hospitals, labs, and clinics are always hiring phlebotomists.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 text-red-500">Good Pay + Benefits</h3>
              <p className="text-gray-300">
                Average salary of $37,380/year with full benefits. Top earners make $52K+.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            🎓 Get Matched with Schools
          </h2>
          <p className="text-gray-400 mb-8">
            Enter your zip code and we&apos;ll connect you with accredited programs in your area.
          </p>
          
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="text"
              placeholder="Enter your zip code"
              className="bg-gray-800 border border-gray-700 rounded-lg px-6 py-4 text-lg w-full md:w-auto focus:border-red-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition"
            >
              Find Schools
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-gray-900 text-center text-gray-500">
        <p>© 2026 Phlebotomy Schools Directory. All rights reserved.</p>
        <p className="mt-2">
          <Link href="/about" className="hover:text-white">About</Link>
          {" • "}
          <Link href="/contact" className="hover:text-white">Contact</Link>
          {" • "}
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
        </p>
      </footer>
    </main>
  );
}
