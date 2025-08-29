import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="relative py-24 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
                Find Your{' '}
                <span className="text-indigo-600">Dream Job</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
                Connect with top companies and discover opportunities that match your skills and passion.
                Your next career move starts here.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/jobs"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Browse Jobs
                </Link>
                <Link
                    href="/companies"
                    className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  View Companies
                </Link>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">
                Why Choose Our Platform?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Quality Jobs
                  </h3>
                  <p className="text-gray-600">
                    Access curated job opportunities from verified companies across various industries.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Fast Applications
                  </h3>
                  <p className="text-gray-600">
                    Apply to multiple jobs quickly with your saved profile and customizable applications.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Verified Companies
                  </h3>
                  <p className="text-gray-600">
                    Connect with legitimate, verified companies that are actively hiring talented professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-indigo-600 py-16">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-indigo-200 mb-8">
                Join thousands of professionals who found their perfect job through our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/auth/signup"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                    href="/auth/signin"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-indigo-500 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">J</span>
                  </div>
                  <span className="ml-2 text-xl font-bold">JobBoard</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Connecting talented professionals with amazing companies.
                  Find your next opportunity or hire the best talent.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                  <li><Link href="/companies" className="hover:text-white transition-colors">Companies</Link></li>
                  <li><Link href="/auth/signup" className="hover:text-white transition-colors">Create Account</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">For Employers</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/recruiter/signup" className="hover:text-white transition-colors">Post Jobs</Link></li>
                  <li><Link href="/recruiter/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Sales</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 JobBoard. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}
