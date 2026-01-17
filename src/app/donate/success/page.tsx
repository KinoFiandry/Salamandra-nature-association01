import Link from "next/link";

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-terracotta-50 to-sage-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-terracotta-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-sage-800 mb-4">
          Thank You for Your Donation!
        </h1>
        <p className="text-sage-600 mb-6">
          Your generous contribution will help protect Madagascar&apos;s endangered
          turtles. Every donation makes a real difference in our conservation
          efforts.
        </p>
        <div className="bg-sage-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-terracotta-500">
            A confirmation email has been sent to your email address.
          </p>
        </div>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-terracotta-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sage-600 transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/donate"
            className="block w-full border border-sage-200 text-sage-600 px-8 py-3 rounded-lg font-semibold hover:bg-sage-50 transition-colors"
          >
            Make Another Donation
          </Link>
        </div>
      </div>
    </div>
  );
}
