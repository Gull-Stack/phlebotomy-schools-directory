import Link from "next/link";

export default function NotFound() {
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

      <section className="py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-8xl font-bold text-blue-600 mb-6">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:shadow-lg"
            >
              Browse Schools
            </Link>
            <Link
              href="/blog"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-4 px-8 rounded-full text-lg transition-all"
            >
              Read the Blog
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <Link href="/" className="text-3xl font-bold text-white">PhlebGuide</Link>
          <p className="mt-4 text-gray-300 text-lg">Your trusted guide to finding accredited phlebotomy training programs</p>
          <div className="text-gray-400 text-sm border-t border-gray-700 pt-8 mt-8">
            <p>&copy; 2026 PhlebGuide. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
