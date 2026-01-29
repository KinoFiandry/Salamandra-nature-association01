"use client";

import { useState } from "react";
import Link from "next/link";
import PayPalDonateButton from "@/components/PayPalDonateButton";
import { supabase } from "@/lib/supabase";

export default function DonatePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handlePayPalSuccess = async (params: any) => {
    try {
      // Record donation in Supabase
      await supabase.from("donations").insert([{
        amount: parseFloat(params.amt),
        currency: params.cc,
        status: 'completed',
        paypal_order_id: params.tx,
        donor_name: donorName || 'Anonymous Donor',
        donor_email: donorEmail || 'donor@example.com'
      }]);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error recording donation:", error);
      // Still show success to user since PayPal transaction completed
      setShowSuccess(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (donorName && donorEmail) {
      setFormSubmitted(true);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-terracotta-50 to-sage-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-terracotta-600"
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
            Thank You!
          </h1>
          <p className="text-sage-700 mb-6">
            Your generous donation will help protect Madagascar&apos;s endangered
            turtles. Every contribution makes a difference in our conservation
            efforts.
          </p>
          <div className="bg-sage-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-sage-600">
              A confirmation has been sent to your PayPal account.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block bg-terracotta-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-terracotta-600 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-terracotta-50 to-sage-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-sage-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Salamandra Nature" className="h-12 w-auto" />
            </Link>
            <Link
              href="/"
              className="text-terracotta-600 hover:text-terracotta-700 font-medium"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-sage-800 mb-4">
                Support Turtle Conservation
              </h1>
              <p className="text-lg text-sage-700">
                Your donation directly supports our mission to protect
                Madagascar&apos;s endangered turtle species and their habitats.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-semibold text-sage-800 mb-4">
                Your Impact
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-terracotta-600"
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
                  <div>
                    <span className="font-medium text-sage-800">10€</span>
                    <p className="text-sm text-sage-600">
                      Provides food for rescued turtles for one week
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-terracotta-600"
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
                  <div>
                    <span className="font-medium text-sage-800">25€</span>
                    <p className="text-sm text-sage-600">
                      Supports nest protection for one nesting season
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-terracotta-600"
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
                  <div>
                    <span className="font-medium text-sage-800">50€</span>
                    <p className="text-sm text-sage-600">
                      Funds community education workshops
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-terracotta-600"
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
                  <div>
                    <span className="font-medium text-sage-800">100€</span>
                    <p className="text-sm text-sage-600">
                      Sponsors habitat restoration for one hectare
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-sage-700 text-white rounded-xl p-6">
              <h3 className="font-semibold mb-2">100% Secure Donation</h3>
              <p className="text-sage-100 text-sm">
                Your payment information is encrypted and secure. We use PayPal,
                a trusted payment processor used worldwide. You can donate using
                your PayPal balance or credit card.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-10 shadow-xl h-fit">
            <h2 className="text-2xl font-bold text-sage-800 mb-6 text-center">
              Make a Donation
            </h2>
            
            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <p className="text-sage-600 mb-6 text-center text-sm">
                  Please provide your information before proceeding to PayPal.
                </p>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-sage-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sage-800 text-white py-3 rounded-lg font-bold hover:bg-sage-900 transition-colors shadow-lg"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-sage-50 rounded-lg p-4 mb-6 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-sage-400">Donor Info</span>
                    <button 
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs text-terracotta-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="font-bold text-sage-800">{donorName}</p>
                  <p className="text-sm text-sage-600">{donorEmail}</p>
                </div>
                
                <p className="text-sage-600 mb-8 text-sm">
                  Click the button below to donate securely via PayPal.
                </p>
                
                <PayPalDonateButton 
                  onSuccess={handlePayPalSuccess} 
                  customData={JSON.stringify({ name: donorName, email: donorEmail })}
                />
                
                <div className="mt-8 flex items-center justify-center gap-4 grayscale opacity-50">
                  <img src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg" alt="Credit Cards" className="h-8 w-auto" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
