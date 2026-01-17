import Link from "next/link";

export default function DonationCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-terracotta-50 to-sage-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-4">
            Donation Cancelled
          </h1>
          <p className="text-sage-600 mb-6">
            Your donation was not processed. No charges have been made to your
            account. If you encountered any issues, please feel free to try again
            or contact us for assistance.
          </p>
          <div className="space-y-3">
            <Link
              href="/donate"
              className="block w-full bg-terracotta-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-terracotta-600 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full border border-sage-200 text-sage-700 px-8 py-3 rounded-lg font-semibold hover:bg-sage-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
      </div>
    </div>
  );
}
